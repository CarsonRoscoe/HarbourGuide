
var GameScene = cc.Layer.extend({
	ctor:function() {
		this._super();
		this.addChild(new GameBoard());
		return true;
	}
});

//GameScene objected created by main. Creates our GameLayer() ibject above.
var Runner = cc.Scene.extend({
	onEnter:function () {
		this._super();
		localStorage.clear();
		var layer = new GameScene();
		this.addChild(layer);
	}
});

