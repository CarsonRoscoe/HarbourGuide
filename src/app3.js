var INITIALIZED3 = false;

var PreGameLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.winSize;

		var menuItem1 = new cc.MenuItemFont("Start", start);
		var menuItem2 = new cc.MenuItemFont("Back", back);
		var menuItem3 = new cc.MenuItemFont("Settings", settings);

		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);

		menu.alignItemsVertically();

		this.addChild(menu);

		return true;
	}
});

var start = function() {
	var scene = new Runner();
	cc.director.pushScene(scene);
}

var back = function() {
	var scene = new MenuScene();
	cc.director.pushScene();
}

var settings = function() {
	var scene = new SettingsScene();
	cc.director.pushScene(scene);
}

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