//Variable to create the scene if it has not yet been initalized
var INITIALIZED4 = false;
//SettingsLayer 
//Contains 1 menu item and is called by the SettingsScene
var SettingsLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		//var size = cc.winSize;
		//MenuItem to navigate to MenuScene
		//Settings is a placeholder, not clickable
		var menuItem1 = new cc.MenuItemFont("Settings");
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
//All the functions reset INITIALZIED4 to false, so it can be called by the scene again
var back = function() {
	INITIALIZED4 = false;
	var scene = new MenuScene();
	//cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene);
}
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
