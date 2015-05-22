//Variable to create the scene if it has not yet been initalized
var INITIALIZED4 = false;
var paddedSettings = false;
//SettingsLayer 
//Contains 1 menu item and is called by the SettingsScene
var SettingsLayer = cc.Layer.extend({
	bgVolumeLabel: null,
	currentVolume: null,
	currentEffectVolume: null,
	colorBlind: null,
	effectVolumeNumber: null,
	thisLayer: null,
	
	ctor:function() {
		this._super();
		this.init(this);
		
	},
	
	init:function(Layer){
		thisLayer = this;
		var winsize = cc.director.getWinSize();
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		this.addChild(bgSprite, -100);
		
		var data = new loadSettings();
		Layer.currentVolume = data.volume;//cc.audioEngine.getMusicVolume().toFixed(1) * 100;
		Layer.currentEffectVolume = data.effects;//cc.audioEngine.getEffectsVolume().toFixed(1) * 100;


		var musicVolumeLabel = new cc.LabelTTF("Background Music Volume %", "Helvetica", 30);
		musicVolumeLabel.setColor(cc.color(0,0,0));
		musicVolumeLabel.setPosition(cc.p(winsize.width/2, winsize.height/1.45));
		Layer.addChild(musicVolumeLabel);
		
		var effectVolumeLabel = new cc.LabelTTF("Effect Music Volume %", "Helvetica", 30);
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
		
		var menuBack = new cc.MenuItemSprite(
				new cc.Sprite(res.ScoreboardBackButton_png),
				new cc.Sprite(res.ScoreboardBackButtonP_png),
				this.backScene, this);
		var backMenu = new cc.Menu(menuBack);
		backMenu.setPosition(cc.p(winsize.width  / 8, winsize.height - 70));
		Layer.addChild(backMenu);
		

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
		INITIALIZED4 = false;
		new saveSettings(new SettingsObj(thisLayer.currentVolume, thisLayer.currentEffectVolume));
		cc.director.popScene();
	},
	
	changeThing: function() {
		colorBlind.setString("This doesn't work yet.");
	}
	
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
