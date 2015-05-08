var INITIALIZED4 = false;

var SettingsLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.winSize;

		var menuItem1 = new cc.MenuItemFont("Settings", settings);
		var menuItem2 = new cc.MenuItemFont("Back", back);
		
		var menu = new cc.Menu(menuItem1, menuItem2);

		menu.alignItemsVertically();

		this.addChild(menu);

		return true;
	}
});

var settings = function() {
	var scene = new SettingsScene();
	cc.director.pushScene(scene);
}

var back = function() {
	var scene = new MenuScene();
	cc.director.pushScene(scene);
}

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