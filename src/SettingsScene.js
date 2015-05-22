//Variable to create the scene if it has not yet been initalized
var INITIALIZED4 = false;
//SettingsLayer 
//Contains 1 menu item and is called by the SettingsScene
var SettingsLayer = cc.Layer.extend({
	bgVolumeLabel: null,
	effectVolumeLabel: null,
	currentVolume: null,
	currentEffectVolume: null,
	colorBlind: null,
	
	ctor:function() {
		this._super();
		this.init(this);
		
	},
	
	init:function(Layer){
		var winsize = cc.director.getWinSize();

		Layer.currentVolume = cc.audioEngine.getMusicVolume().toFixed(1);
		Layer.currentEffectVolume = cc.audioEngine.getEffectsVolume().toFixed(1);


		var musicVolumeLabel = new cc.LabelTTF("Background Music Volume", "Helvetica", 30);
		
		bgVolumeLabel = new cc.LabelTTF(Layer.currentVolume, "Helvetica", 30);
		bgVolumeLabel.setColor(cc.color(200,200,200));	
		
		var musicUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeUp, this);
		var menuItem2 = new cc.MenuItemLabel(bgVolumeLabel, Layer.backScene);
		var musicDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeDown, this);
		var musicMenu = new cc.Menu(musicUp, menuItem2, musicDown);
		musicMenu.alignItemsHorizontallyWithPadding(50);
		musicMenu.setPosition(cc.p(winsize.width/2, winsize.height/1.5));
		Layer.addChild(musicMenu);

		
		effectVolumeLabel = new cc.LabelTTF(Layer.currentEffectVolume, "Helvetica", 30);
		effectVolumeLabel.setColor(cc.color(200,200,200));
		
		var effectUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeEffectUp, this);
		var menuItem3 = new cc.MenuItemLabel(effectVolumeLabel, Layer.backScene);
		var effectDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeEffectDown, this);
		var effectMenu = new cc.Menu(effectUp, menuItem3, effectDown);
		effectMenu.alignItemsHorizontallyWithPadding(50);
		effectMenu.setPosition(cc.p(winsize.width/2, winsize.height/3));
		Layer.addChild(effectMenu);
		
		

		//MenuItem to navigate to MenuScene
		//Settings is a placeholder, not clickable
		//Volumes are backwards here but is drawn correctly in game
		/*
		var menuItem1 = new cc.MenuItemFont("Settings");
		var menuItem2 = new cc.MenuItemFont("Back", Layer.backScene);
		var menuItem3 = new cc.MenuItemFont("Game Volume Down", Layer.volumeDown);
		var menuItem4 = new cc.MenuItemFont("Game Volume Up", Layer.volumeUp);
		var menuItem5 = new cc.MenuItemFont("Effect Volume Down", Layer.volumeEffectDown);
		var menuItem6 = new cc.MenuItemFont("Effect Volume Up", Layer.volumeEffectUp);
		colorBlind = new cc.MenuItemFont("Color Blind Mode", Layer.changeThing);
		*/
		//Adds menuItems to a Menu. The volume up and down's are backwards because it was running the functions in them on loading.
		//So now it subtracts then adds to the volume very quickly so that you won't notice.
		//var menu = new cc.Menu(menuItem1, menuItem2, menuItem4, menuItem3, menuItem6, menuItem5, colorBlind);
		//Aligns the items vertically
		//menu.alignItemsVertically();
		//Adds menu to layer
		//Layer.addChild(menu);

	},
	
	
	volumeDown: function() {
		var current = cc.audioEngine.getMusicVolume() - 0.1;
		cc.audioEngine.setMusicVolume(current);
		var display = current;
		if(display <= 0){
			display = 0;
		}
		bgVolumeLabel.setString(display.toFixed(1));

	},

	//The volume up and down functions adjust the background music by increments of 10%. Starting volume is 100%
	volumeUp: function() {
		var current = cc.audioEngine.getMusicVolume() + 0.1;
		cc.audioEngine.setMusicVolume(current);
		var display = current;
		if(display >= 1){
			display = 1;
		}
		bgVolumeLabel.setString(display.toFixed(1));

	},

	volumeEffectDown: function() {
		var current = cc.audioEngine.getEffectsVolume() - 0.1;
		cc.audioEngine.setEffectsVolume(current);
		var display = current;
		if(display <= 0){
			display = 0;
		}
		effectVolumeLabel.setString(display.toFixed(1));

	},

	//The volume up and down functions adjust the   background music by increments of 10%. Starting volume is 100%
	volumeEffectUp: function() {
		var current = cc.audioEngine.getEffectsVolume() + 0.1;
		cc.audioEngine.setEffectsVolume(current);
		var display = current;
		if(display >= 1){
			display = 1;
		}
		effectVolumeLabel.setString(display.toFixed(1));

	},
	
	//The following function is called when the button in the menu is pressed
	//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
	backScene: function() {
		INITIALIZED4 = false;

		cc.director.popScene();
	},
	
	/*
	//Just testing things with this
	changeThing: function() {
		colorBlind.setString("This doesn't work yet.");
	}
	*/
});


//SettingsScene
//Adds a SettingsLayer to itself if the scene has not already been initialized
var SettingsScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED4 == false) {

			INITIALIZED4 = true;

			var layer = new SettingsLayer();
			this.removeAllChildren();
			this.addChild(layer);
		}
	}
});
