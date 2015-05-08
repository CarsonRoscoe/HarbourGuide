var INITIALIZED2 = false;

var MenuLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.winSize;
		
		var menuItem1 = new cc.MenuItemFont("Play", play);
		var menuItem2 = new cc.MenuItemFont("Scores", scores);
		var menuItem3 = new cc.MenuItemFont("Settings", settings);
		
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		
		menu.alignItemsVertically();
		
		this.addChild(menu);
		
		return true;
	}
});

var play = function() {
	var scene = new PreGameScene();
	cc.director.pushScene(scene);
}

var scores = function() {
	var scene = new ScoresScene();
	cc.director.pushScene(scene);
}

var settings = function() {
	var scene = new SettingsScene();
	cc.director.pushScene(scene);
}

var MenuScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		
		if(INITIALIZED2 == false) {
			
			INITIALIZED2 = true;
			
			var layer = new MenuLayer();
			this.addChild(layer);
		}
	}
});

