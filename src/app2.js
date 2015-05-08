//Variable to create the scene if it has not yet been initalized
var INITIALIZED2 = false;
//MenuLayer 
//Contains 3 menu items and is called by the MenuScene
var MenuLayer = cc.Layer.extend({
	//Constructor for Layer
	ctor:function() {
		this._super();
		//var size = cc.winSize;
		//MenuItems to navigate to PreGame, Scores, and Settings scene
		var menuItem1 = new cc.MenuItemFont("Play", play);
		var menuItem2 = new cc.MenuItemFont("Scores", scores);
		var menuItem3 = new cc.MenuItemFont("Settings", settings);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		this.addChild(menu);
		
		return true;
	}
});
//The following 3 functions are called when the buttons in the menu are pressed
//All the functions reset INITIALZIED2 to false, so it can be called by the scene again
//Each function runs the appropriate scene
var play = function() {
	INITIALIZED2 = false;
	var scene = new PreGameScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.runScene(scene);
}

var scores = function() {
	INITIALIZED2 = false;
	var scene = new ScoresScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.runScene(scene); //push
}

var settings = function() {
	INITIALIZED2 = false;
	var scene = new SettingsScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.runScene(scene); //push
}
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

