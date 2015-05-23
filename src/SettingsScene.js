//Variable to create the scene if it has not yet been initalized
var INITIALIZED4 = false;
//Variable that controls the padding for the menus.
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
		
		Layer.removeAllChildren();
		
		//Sprite for the background
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		this.addChild(bgSprite, -100);
		
		//gets the settings saved in the local storage. if there is no settings in local storage it is set to 100% for both
		var data = new loadSettings();
		Layer.currentVolume = data.volume;//cc.audioEngine.getMusicVolume().toFixed(1) * 100;
		Layer.currentEffectVolume = data.effects;//cc.audioEngine.getEffectsVolume().toFixed(1) * 100;

		//Background music label above menu
		var musicVolumeLabel = new cc.LabelTTF("Background Music Volume %", "Helvetica", 30);
		musicVolumeLabel.setColor(cc.color(0,0,0));
		musicVolumeLabel.setPosition(cc.p(winsize.width/2, winsize.height/1.45));
		Layer.addChild(musicVolumeLabel);
		
		//Effect volume label above the menu
		var effectVolumeLabel = new cc.LabelTTF("Effect Music Volume %", "Helvetica", 30);
		effectVolumeLabel.setColor(cc.color(0,0,0));
		effectVolumeLabel.setPosition(cc.p(winsize.width/2, winsize.height/1.8));
		Layer.addChild(effectVolumeLabel);
		
		//Label that represents the percentage volume that the background music is at
		bgVolumeLabel = new cc.LabelTTF(Layer.currentVolume, "Helvetica", 30);
		bgVolumeLabel.setColor(cc.color(0,0,0));	
		
		
		//Background menu items
		//The volume up button increases volume by 10%
		var musicUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeUp, this);
		//Visual representation of the volume.
		var menuItem2 = new cc.MenuItemLabel(bgVolumeLabel);
		//The volume down button that decreases volume by 10%
		var musicDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeDown, this);
		var musicMenu = new cc.Menu(musicUp, menuItem2, musicDown);
		
		musicMenu.setPosition(cc.p(winsize.width/2, winsize.height/1.6));
		

		//Label that represents the percentage volume the sound effects is at
		effectVolumeNumber = new cc.LabelTTF(Layer.currentEffectVolume, "Helvetica", 30);
		effectVolumeNumber.setColor(cc.color(0,0,0));
		
		//Effect menu items
		//The volume up button increases sound effects by 10%
		var effectUp = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_up_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_up_pressed.png"),
				Layer.volumeEffectUp, this);
		//Visual representation of the sound effect volume
		var menuItem3 = new cc.MenuItemLabel(effectVolumeNumber);
		//The volume down button decreases sound effects by 10%
		var effectDown = new cc.MenuItemSprite(
				new cc.Sprite("res/mediumRes/buttons/volume_down_default.png"),
				new cc.Sprite("res/mediumRes/buttons/volume_down_pressed.png"),
				Layer.volumeEffectDown, this);
		var effectMenu = new cc.Menu(effectUp, menuItem3, effectDown);
		
		effectMenu.setPosition(cc.p(winsize.width/2, winsize.height/2));
		
		//Check if the menus are padded if already padded just align normally.
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
		
		//Bottom menu
		//Color blind is to be made
		//Secondary back button is also in here
		colorBlind = new cc.MenuItemFont("Color Blind Mode", Layer.changeThing);
		colorBlind.setColor(cc.color(0,0,0));
		var backButton = new cc.MenuItemFont("Back", Layer.backScene);
		backButton.setColor(cc.color(0,0,0));
		var tempMenu = new cc.Menu(colorBlind, backButton);
		tempMenu.alignItemsVertically();
		tempMenu.setPosition(cc.p(winsize.width/2, winsize.height/3));
		Layer.addChild(tempMenu);
		
		
		//Top or main back button
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

	//The volume up and down functions adjust the background music by increments of 10%. Default volume is 100%
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

	//The volume up and down functions adjust the sound effects by increments of 10%. Default volume is 100%
	volumeEffectUp: function() {
		if (thisLayer.currentEffectVolume <= 90) {
			thisLayer.currentEffectVolume += 10;
			cc.audioEngine.setEffectsVolume(thisLayer.currentEffectVolume / 100);
			effectVolumeNumber.setString(thisLayer.currentEffectVolume);
		}
	},
	
	//The following function is called when the back button in the menu is pressed
	//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
	backScene: function() {
		INITIALIZED4 = false;
		new saveSettings(new SettingsObj(thisLayer.currentVolume, thisLayer.currentEffectVolume));
		cc.director.popScene();
	},
	
	
	//lets players know that color blind doesn't work yet
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
			//Adds the layer to this scene
			var layer = new SettingsLayer();
			this.removeAllChildren();
			this.addChild(layer);
		}
	}
});
