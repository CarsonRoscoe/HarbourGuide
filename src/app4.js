//Variable to create the scene if it has not yet been initalized
var INITIALIZED4 = false;
//SettingsLayer 
//Contains 1 menu item and is called by the SettingsScene
var SettingsLayer = cc.Layer.extend({
	bgVolumeLabel: null,
	effectVolumeLabel: null,
	
	
	ctor:function() {
		this._super();
		this.init();
		
	},
	
	init:function(){
		var winsize = cc.director.getWinSize();

		
		//Static right now because its giving me hell, not sure what else I can do.
		this.bgVolumeLabel = new cc.LabelTTF("Main Volume: %100", "Helvetica");
		this.bgVolumeLabel.setFontSize(30);
		this.bgVolumeLabel.setColor(cc.color(200,200,200));
		this.bgVolumeLabel.setPosition(cc.p(winsize.width / 2, winsize.height * 0.75));
		this.addChild(this.bgVolumeLabel);

		this.effectVolumeLabel = new cc.LabelTTF("Effect Volume: %100", "Helvetica");
		this.effectVolumeLabel.setFontSize(30);
		this.effectVolumeLabel.setColor(cc.color(200,200,200));
		this.effectVolumeLabel.setPosition(cc.p(winsize.width / 2, winsize.height * 0.69));
		this.addChild(this.effectVolumeLabel);

		//MenuItem to navigate to MenuScene
		//Settings is a placeholder, not clickable
		//Volumes are backwards here but is drawn correctly in game
		var menuItem1 = new cc.MenuItemFont("Settings");
		var menuItem2 = new cc.MenuItemFont("Back", back);
		var menuItem3 = new cc.MenuItemFont("Game Volume Down", this.volumeDown);
		var menuItem4 = new cc.MenuItemFont("Game Volume Up", this.volumeUp);

		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem4, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		this.addChild(menu);
	},
	
	volumeDown: function() {
		var current = cc.audioEngine.getMusicVolume() - 0.1;
		cc.audioEngine.setMusicVolume(current);
	},

	//The volume up and down functions adjust the background music by increments of 10%. Starting volume is 100%
	volumeUp: function() {
		var current = cc.audioEngine.getMusicVolume() + 0.1;
		cc.audioEngine.setMusicVolume(current);
	},
	
	//The following function is called when the button in the menu is pressed
	//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
	back: function() {
		INITIALIZED4 = false;
		var scene = new MenuScene();
		cc.audioEngine.playEffect(res.button);
		cc.director.runScene(scene);
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
			this.addChild(layer);
		}
	}
});
