var GameLayer = cc.Layer.extend({
	sprite:null,
	ctor:function () {
		//////////////////////////////
		// 1. super init first
		this._super();

		var size = cc.winSize;

		var sprite = new cc.Sprite.create(res.CloseNormal_png);
		sprite.setAnchorPoint(cc.p(0.5, 0.5));
		sprite.setPosition(cc.p(size.width/2, size.height/2));
		this.addChild(sprite, 0);

		return true;
	}
});

var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
	}
});