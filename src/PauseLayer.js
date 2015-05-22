

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
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		this.addChild(bgSprite, -100);

		Layer.currentVolume = cc.audioEngine.getMusicVolume().toFixed(1);
		Layer.currentEffectVolume = cc.audioEngine.getEffectsVolume().toFixed(1);


		var musicVolumeLabel = new cc.LabelTTF("Background Music Volume", "Helvetica", 30);
		musicVolumeLabel.setColor(cc.color(0,0,0));
		musicVolumeLabel.setPosition(cc.p(winsize.width/2, winsize.height/1.45));
		Layer.addChild(musicVolumeLabel);

		var effectVolumeLabel = new cc.LabelTTF("Effect Music Volume", "Helvetica", 30);
		effectVolumeLabel.setColor(cc.color(0,0,0));
		effectVolumeLabel.setPosition(cc.p(winsize.width/2, winsize.height/1.8));
		Layer.addChild(effectVolumeLabel);

		bgVolumeLabel = new cc.LabelTTF(Layer.currentVolume, "Helvetica", 30);
		bgVolumeLabel.setColor(cc.color(0,0,0));	

		var musicUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeUp, this);
		var menuItem2 = new cc.MenuItemLabel(bgVolumeLabel);
		var musicDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeDown, this);
		var musicMenu = new cc.Menu(musicUp, menuItem2, musicDown);

		musicMenu.setPosition(cc.p(winsize.width/2, winsize.height/1.6));



		effectVolumeNumber = new cc.LabelTTF(Layer.currentEffectVolume, "Helvetica", 30);
		effectVolumeNumber.setColor(cc.color(0,0,0));


		var effectUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeEffectUp, this);
		var menuItem3 = new cc.MenuItemLabel(effectVolumeNumber);
		var effectDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeEffectDown, this);
		var effectMenu = new cc.Menu(effectUp, menuItem3, effectDown);

		effectMenu.setPosition(cc.p(winsize.width/2, winsize.height/2));

		if(!paddedSettings){
			effectMenu.alignItemsHorizontallyWithPadding(50);
			musicMenu.alignItemsHorizontallyWithPadding(50);
			paddedSettings = true;
		}else{
			effectMenu.alignItemsHorizontally();
			musicMenu.alignItemsHorizontally();
		}

		Layer.addChild(effectMenu);
		Layer.addChild(musicMenu);


		colorBlind = new cc.MenuItemFont("Color Blind Mode", Layer.changeThing);
		colorBlind.setColor(cc.color(0,0,0));
		var backButton = new cc.MenuItemFont("Back", Layer.backScene);
		backButton.setColor(cc.color(0,0,0));
		var tempMenu = new cc.Menu(colorBlind, backButton);
		tempMenu.alignItemsVertically();
		tempMenu.setPosition(cc.p(winsize.width/2, winsize.height/3));
		Layer.addChild(tempMenu);


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
		effectVolumeNumber.setString("Effect Volume: " + display.toFixed(1));

	},

	//The volume up and down functions adjust the   background music by increments of 10%. Starting volume is 100%
	volumeEffectUp: function() {
		var current = cc.audioEngine.getEffectsVolume() + 0.1;
		cc.audioEngine.setEffectsVolume(current);
		var display = current;
		if(display >= 1){
			display = 1;
		}
		effectVolumeNumber.setString("Effect Volume: " + display.toFixed(1));

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