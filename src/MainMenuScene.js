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
		var menuItem1 = new cc.MenuItemFont("Play", mainPlay);
		var menuItem2 = new cc.MenuItemFont("Scores", mainScores);
		var menuItem3 = new cc.MenuItemFont("Settings", mainSettings);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		this.removeAllChildren();
		this.addChild(menu);
		
		return true;
	}
});
//The following 3 functions are called when the buttons in the menu are pressed
//All the functions reset INITIALZIED2 to false, so it can be called by the scene again
//Each function runs the appropriate scene
var mainPlay = function() {
	INITIALIZED2 = false;
	var scene = new PreGameScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.pushScene(scene);
}

var mainScores = function() {
	INITIALIZED2 = false;
	var scene = new ScoresScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.pushScene(scene); //push
}

var mainSettings = function() {
	INITIALIZED2 = false;
	var scene = new SettingsScene();
	cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
	cc.director.pushScene(scene); //push
}
//MenuScene
//Adds a MenuLayer to itself if the scene has not already been initialized
var MenuScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		
		if(INITIALIZED2 == false) {
			
			INITIALIZED2 = true;
			
			var layer = new MenuLayer();
			this.removeAllChildren();
			this.addChild(layer);
			cc.audioEngine.playMusic(res.background_mp3, true); //starts audio NOTE: browsers don't support loop, seperate loop needs to be made
		}
	}
});

