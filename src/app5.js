var INITIALIZED5 = false;

var ScoresLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		var size = cc.winSize;

		var menuItem1 = new cc.MenuItemFont("Back", back);
		
		var menu = new cc.Menu(menuItem1);

		menu.alignItemsVertically();

		this.addChild(menu);

		return true;
	}
});

var back = function() {
	var scene = new MenuScene();
	cc.director.pushScene(scene);
}

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