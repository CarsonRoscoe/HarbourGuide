

var PauseLayer = cc.Layer.extend({
	background:null,
	thisLayer: null,
	bgVolumeLabel: null,
	effectVolumeLabel: null,
	currentVolume: null,
	currentEffectVolume: null,
	colorBlind: null,
	
	ctor:function(){
		this._super();
		
	},
	
	init:function(Layer){
		Layer._super();
		thisLayer = Layer;
		Layer.removeAllChildren();

		var winsize = cc.director.getWinSize();
		Layer.background = new cc.Sprite("res/PauseBG.png");
		Layer.background.setPosition(cc.p(winsize.width /2, winsize.height / 2));

		Layer.addChild(this.background);
		
		var menuItem1 = new cc.MenuItemFont("Resume", handlePause);
		var menuItem2 = new cc.MenuItemFont("Settings", Layer.pauseSettings);
		var menuItem3 = new cc.MenuItemFont("Quit", Layer.pauseQuit);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		
		
		
		Layer.addChild(menu);
	},
	
	

	initSettings:function(Layer) {
		Layer.removeAllChildren();
		var winsize = cc.director.getWinSize();
		cc.log("11dd");

		Layer.background = new cc.Sprite("res/PauseBG.png");
		Layer.background.setPosition(cc.p(winsize.width /2, winsize.height / 2));
		
		Layer.currentVolume = cc.audioEngine.getMusicVolume().toFixed(1);
		Layer.currentEffectVolume = cc.audioEngine.getEffectsVolume().toFixed(1);
		

		Layer.addChild(this.background);


		//Static right now because its giving me hell, not sure what else I can do.
		bgVolumeLabel = new cc.LabelTTF("Main Volume: " + Layer.currentVolume, "Helvetica", 30);
		bgVolumeLabel.setColor(cc.color(200,200,200));
		bgVolumeLabel.setPosition(cc.p(winsize.width / 2, winsize.height * 0.75));
		Layer.addChild(bgVolumeLabel);
	
		effectVolumeLabel = new cc.LabelTTF("Effect Volume: " + Layer.currentEffectVolume, "Helvetica", 30);
		effectVolumeLabel.setColor(cc.color(200,200,200));
		effectVolumeLabel.setPosition(cc.p(winsize.width / 2, winsize.height * 0.69));
		Layer.addChild(effectVolumeLabel);
	
		//MenuItem to navigate to MenuScene
		//Settings is a placeholder, not clickable
		//Volumes are backwards here but is drawn correctly in game
		var menuItem1 = new cc.MenuItemFont("Settings");
		var menuItem2 = new cc.MenuItemFont("Back", Layer.backScene);
		var menuItem3 = new cc.MenuItemFont("Game Volume Down", Layer.volumeDown);
		var menuItem4 = new cc.MenuItemFont("Game Volume Up", Layer.volumeUp);
		var menuItem5 = new cc.MenuItemFont("Effect Volume Down", Layer.volumeEffectDown);
		var menuItem6 = new cc.MenuItemFont("Effect Volume Up", Layer.volumeEffectUp);
		colorBlind = new cc.MenuItemFont("Color Blind Mode", Layer.changeThing);
	
		//Adds menuItems to a Menu. The volume up and down's are backwards because it was running the functions in them on loading.
		//So now it subtracts then adds to the volume very quickly so that you won't notice.
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem4, menuItem3, menuItem6, menuItem5, colorBlind);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		Layer.addChild(menu);
	},
	
	
	
	deinit:function(Layer){
		Layer.removeAllChildren();
	},
	
	pauseQuit:function(){
		gameVars.forceKill = true;
		handlePause();
	},
	
	pauseSettings:function(){
		thisLayer.initSettings(thisLayer);
	},
	
	
	
	


	volumeDown: function() {
		var current = cc.audioEngine.getMusicVolume() - 0.1;
		cc.audioEngine.setMusicVolume(current);
		var display = current;
		if(display <= 0){
			display = 0;
		}
		bgVolumeLabel.setString("Main Volume: " + display.toFixed(1));

	},

	//The volume up and down functions adjust the background music by increments of 10%. Starting volume is 100%
	volumeUp: function() {
		var current = cc.audioEngine.getMusicVolume() + 0.1;
		cc.audioEngine.setMusicVolume(current);
		var display = current;
		if(display >= 1){
			display = 1;
		}
		bgVolumeLabel.setString("Main Volume: " + display.toFixed(1));

	},

	volumeEffectDown: function() {
		var current = cc.audioEngine.getEffectsVolume() - 0.1;
		cc.audioEngine.setEffectsVolume(current);
		var display = current;
		if(display <= 0){
			display = 0;
		}
		effectVolumeLabel.setString("Effect Volume: " + display.toFixed(1));

	},

	//The volume up and down functions adjust the   background music by increments of 10%. Starting volume is 100%
	volumeEffectUp: function() {
		var current = cc.audioEngine.getEffectsVolume() + 0.1;
		cc.audioEngine.setEffectsVolume(current);
		var display = current;
		if(display >= 1){
			display = 1;
		}
		effectVolumeLabel.setString("Effect Volume: " + display.toFixed(1));

	},

	//The following function is called when the button in the menu is pressed
	//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
	backScene: function() {
		thisLayer.init(thisLayer);
	},

	//Just testing things with this
	changeThing: function() {
		colorBlind.setString("This doesn't work yet.");
	}
	
});