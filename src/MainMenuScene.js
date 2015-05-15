//Variable to create the scene if it has not yet been initalized
var INITIALIZED2 = false;
//MenuLayer 
//Contains 3 menu items and is called by the MenuScene
var MenuLayer = cc.Layer.extend({
	//Constructor for Layer
	ctor:function() {
		this._super();
		this.init(this);

	},
	
	init:function(Layer){
		this._super();
		
		var winsize = cc.director.getWinSize();
		//MenuItems to navigate to PreGame, Scores, and Settings scene
		var menuItem1 = new cc.MenuItemSprite(
				new cc.Sprite("res/play_default.png"),
				new cc.Sprite("res/play_default.png"),
				Layer.mainPlay, Layer);
		var menuItem2 = new cc.MenuItemSprite(
				new cc.Sprite("res/scores_default.png"),
				new cc.Sprite("res/scores_default.png"),
				Layer.mainScores, Layer);
		var menuItem3 = new cc.MenuItemSprite(
				new cc.Sprite("res/settings_default.png"),
				new cc.Sprite("res/settings_default.png"),
				Layer.mainSettings, Layer);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
<<<<<<< HEAD
		menu.alignItemsVerticallyWithPadding(130);
		//Adds menu to layer
		Layer.removeAllChildren();
=======
		menu.alignItemsVerticallyWithPadding(550);
		//Adds menu to layer
>>>>>>> origin/master
		Layer.addChild(menu);
	},
	
	//The following 3 functions are called when the buttons in the menu are pressed
	//All the functions reset INITIALZIED2 to false, so it can be called by the scene again
	//Each function runs the appropriate scene
	mainPlay:function() {
		INITIALIZED2 = false;
		var scene = new PreGameScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.runScene(scene);
	},

	mainScores:function() {
		INITIALIZED2 = false;
		var scene = new ScoresScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.runScene(scene); //push
	},

	mainSettings:function() {
		INITIALIZED2 = false;
		var scene = new SettingsScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.runScene(scene); //push
	}
});

//MenuScene
//Adds a MenuLayer to itself if the scene has not already been initialized
var MenuScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		
		if(INITIALIZED2 == false) {
			
			INITIALIZED2 = true;
			
			var layer = new MenuLayer();
			this.addChild(layer);
			cc.audioEngine.playMusic(res.background_mp3, true); //starts audio NOTE: browsers don't support loop, seperate loop needs to be made
		}
	}
});

