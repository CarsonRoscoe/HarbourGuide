var INITIALIZED = false;

/**
 * Creates a layer to place a new Game scene layer, pause layer, and hud layer on.
 */
var GameScene = cc.Layer.extend({
	ctor:function(newGameVars, parent) {
		this._super();
		var hudLayer = new HUDLayer(newGameVars.unitsLeft, gameVars.passScore);
		var pauseLayer = new PauseLayer();
		var gameBoard = new GameBoard(hudLayer, pauseLayer, newGameVars, parent);
		hudLayer.init(hudLayer);
		this.removeAllChildren();
		this.addChild(gameBoard);
		this.addChild(hudLayer);
		this.addChild(pauseLayer);
		return true;
	}
});



//GameScene objected created by main. Creates our GameLayer/pause/hud objects above.
var Runner = cc.Scene.extend({
	newGameVars: null,
	parentLayer: null,
	
	ctor:function(newGV, layer) {
		this._super();
		newGameVars = newGV;
		parentLayer = layer;
	}, 
	
	onEnter:function () {
		this._super();
		//if(INITIALIZED == false) {
			
			//localStorage.clear();
			INITIALIZED = true;
			var scene = new GameScene(newGameVars, parentLayer);
			this.removeAllChildren();
			this.addChild(scene);
			
			cc.audioEngine.playMusic(res.GameBackground_mp3, true); //starts audio NOTE: browsers don't support looping, own looping method needs to be made.
		//}
	}
});


