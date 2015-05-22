

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
		Layer.background = new cc.Sprite(res.PauseBg_png);
		Layer.background.setPosition(cc.p(winsize.width /2, winsize.height / 2));

		Layer.addChild(this.background);
		
		var menuItem1 = new cc.MenuItemFont("Resume", handlePause);
		var menuItem2 = new cc.MenuItemFont("Settings", Layer.pauseSettings);
		var menuItem3 = new cc.MenuItemFont("Quit", Layer.pauseQuit);
		
		menuItem1.setFontName("SF Slapstick Comic");
		menuItem1.setFontSize(90);
		
		menuItem2.setFontName("SF Slapstick Comic");
		menuItem2.setFontSize(90);
		
		menuItem3.setFontName("SF Slapstick Comic");
		menuItem3.setFontSize(90);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVerticallyWithPadding(100);
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

		var data = new loadSettings();
		Layer.currentVolume = data.volume;
		Layer.currentEffectVolume = data.effects;


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
		if (thisLayer.currentVolume >= 10) {
			thisLayer.currentVolume -= 10;
			cc.audioEngine.setMusicVolume(thisLayer.currentVolume / 100);
			bgVolumeLabel.setString(thisLayer.currentVolume);
		}
	},

	//The volume up and down functions adjust the background music by increments of 10%. Starting volume is 100%
	volumeUp: function() {
		if (thisLayer.currentVolume <= 90) {
			thisLayer.currentVolume += 10;
			cc.audioEngine.setMusicVolume(thisLayer.currentVolume / 100);
			bgVolumeLabel.setString(thisLayer.currentVolume);
		}
	},

	volumeEffectDown: function() {
		if (thisLayer.currentEffectVolume >= 10) {
			thisLayer.currentEffectVolume -= 10;
			cc.audioEngine.setEffectsVolume(thisLayer.currentEffectVolume / 100);
			effectVolumeNumber.setString(thisLayer.currentEffectVolume);
		}
	},

	//The volume up and down functions adjust the   background music by increments of 10%. Starting volume is 100%
	volumeEffectUp: function() {
		if (thisLayer.currentEffectVolume <= 90) {
			thisLayer.currentEffectVolume += 10;
			cc.audioEngine.setEffectsVolume(thisLayer.currentEffectVolume / 100);
			effectVolumeNumber.setString(thisLayer.currentEffectVolume);
		}
	},

	//The following function is called when the button in the menu is pressed
	//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
	backScene: function() {
		new saveSettings(new SettingsObj(thisLayer.currentVolume, thisLayer.currentEffectVolume));
		thisLayer.init(thisLayer);
	},

	//Just testing things with this
	changeThing: function() {
		colorBlind.setString("This doesn't work yet.");
	}
	
});