//Variable to create the scene if it has not yet been initalized
var INITIALIZED3 = false;
//PreGameLayer 
//Contains 3 menu items and is called by the PreGameScene
var PreGameLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		//var size = cc.winSize;
		//MenuItems to navigate to Runner, Settings, and MainMenu scene
		var menuItem1 = new cc.MenuItemFont("Start", start);
		var menuItem2 = new cc.MenuItemFont("Settings", settings);
		var menuItem3 = new cc.MenuItemFont("Back", back);
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
//All the functions reset INITIALZIED3 to false, so it can be called by the scene again
//Each function runs the appropriate scene
var start = function() {
	INITIALIZED3 = false;
	var scene = new Runner();
	cc.audioEngine.playEffect(res.button);
	cc.audioEngine.stopMusic(); //stops the music so that the game music can be played.
	
	cc.director.pushScene(scene);
}

var back = function() {
	INITIALIZED3 = false;
	var scene = new MenuScene();
	cc.director.runScene(scene);
}

var settings = function() {
	INITIALIZED3 = false;
	var scene = new SettingsScene();
	cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene); //push
}
//PreGameScene
//Adds a PreGameLayer to itself if the scene has not already been initialized
var PreGameScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED3 == false) {

			INITIALIZED3 = true;

			var layer = new PreGameLayer();
			this.addChild(layer);
		}
	}
});
