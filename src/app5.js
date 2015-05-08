//Variable to create the scene if it has not yet been initalized
var INITIALIZED5 = false;
//ScoresLayer 
//Contains 1 menu item and is called by the ScoresScene
var ScoresLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		//var size = cc.winSize;
		//MenuItem to navigate to MenuScene
		//Scores is a placeholder, not clickable
		var menuItem1 = new cc.MenuItemFont("Scores");
		var menuItem2 = new cc.MenuItemFont("Back", back);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		this.addChild(menu);

		return true;
	}
});
//The following function is called when the button in the menu is pressed
//All the functions reset INITIALZIED5 to false, so it can be called by the scene again
var back = function() {
	INITIALIZED5 = false;
	var scene = new MenuScene();
	//cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene);
}
//ScoresScene
//Adds a ScoresLayer to itself if the scene has not already been initialized
var ScoresScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED5 == false) {

			INITIALIZED5 = true;

			var layer = new ScoresLayer();
			this.addChild(layer);
		}
	}
});
