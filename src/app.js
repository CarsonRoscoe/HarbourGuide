var INITIALIZED = false;

var GameScene = cc.Layer.extend({
	ctor:function() {
		this._super();
		var gameBoard = new GameBoard();
		var hudLayer = new HUDLayer();
		this.addChild(gameBoard);
		this.addChild(hudLayer);
		return true;
	}
});



//GameScene objected created by main. Creates our GameLayer() ibject above.
var Runner = cc.Scene.extend({
	onEnter:function () {
		this._super();
		if(INITIALIZED == false) {
			
			//localStorage.clear();

			INITIALIZED = true;
			
			this.addChild(new GameScene());
			
			cc.audioEngine.playMusic(res.GameBackground_mp3, true); //starts audio NOTE: browsers don't support looping, own looping method needs to be made.
		}
	}
});


