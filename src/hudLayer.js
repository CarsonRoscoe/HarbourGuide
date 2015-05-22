var INITALIZEDHUD = false;

var HUDLayer = cc.Layer.extend({
	scoreLabel: null,
	boatsLeftLabel: null,
	scoreHolder: null,
	scoreBackground: null,
	boatsLeftHolder: null,
	boatsLeftBackground: null,
	cellSize: null,
	cellsRow: null,
	cellsColumn: null,
	
	ctor:function() {
		this._super();
	},
	
	initVars:function(s, r, c) {
		cellSize = s;
		cellsRow = r;
		cellsColumn = c;
	},

	init:function(Layer, gameLayer){
		Layer._super();
		Layer.removeAllChildren();
		var winsize = cc.director.getWinSize();
		Layer.scoreBackground = new cc.Sprite(res.WoodBackHUD);
		Layer.boatsLeftBackground = new cc.Sprite(res.WoodBackHUD);
		
		Layer.scoreBackground.setAnchorPoint(.5, 1);
		Layer.scoreBackground.setScaleX(winsize.width / Layer.scoreBackground.width);
		Layer.scoreBackground.setScaleY((winsize.height - (cellSize * cellsColumn)) / 2 / Layer.scoreBackground.height);
		Layer.scoreBackground.setPosition(cc.p(winsize.width / 2, winsize.height));
		
		Layer.scoreHolder = new cc.Sprite(res.TextHolderHUD);
		Layer.scoreHolder.setAnchorPoint(.5, .5);
		Layer.scoreHolder.setPosition(cc.p(winsize.width / 2.5, winsize.height - ((winsize.height - (cellSize * cellsColumn)) / 4)));
		cc.log(Layer.scoreHolder.x + " " + Layer.scoreHolder.y);
		Layer.addChild(this.scoreHolder, 1000);
		
		Layer.scoreLabel = new cc.LabelTTF("Score: 0", "Amiga Forever", cellSize / 2);
		Layer.scoreLabel.setColor(cc.color(0,0,0));
		Layer.scoreLabel.setPosition(cc.p(winsize.width / 2, winsize.height / 10));
		
		Layer.scoreBackground.addChild(this.scoreLabel);
		Layer.addChild(this.scoreBackground);
		
		var settingsLabel = new cc.MenuItemSprite(new cc.Sprite(res.Button_png), new cc.Sprite(res.Button_png),	handlePause, this);
		var menu = new cc.Menu(settingsLabel);
		menu.setAnchorPoint(1, .5);
		menu.setPosition(cc.p(winsize.width - (winsize.width / 8), winsize.height - ((winsize.height - (cellSize * cellsColumn)) / 4)));
		Layer.addChild(menu);

		Layer.boatsLeftBackground.setAnchorPoint(.5, 0);
		Layer.boatsLeftBackground.setScaleX(winsize.width / Layer.scoreBackground.width);
		Layer.boatsLeftBackground.setScaleY((winsize.height - (cellSize * cellsColumn)) / 2 / Layer.scoreBackground.height);
		Layer.boatsLeftBackground.setPosition(cc.p(winsize.width / 2, 0));
		
		Layer.boatsLeftLabel = new cc.LabelTTF("Boats Left: ", "Amiga Forever", cellSize / 2);
		Layer.boatsLeftLabel.setColor(cc.color(0,0,0));
		Layer.boatsLeftLabel.setPosition(cc.p(winsize.width / 2, winsize.height / 10));		
		Layer.boatsLeftBackground.addChild(Layer.boatsLeftLabel);
		Layer.addChild(Layer.boatsLeftBackground);
	},
	

	updateBoatsLeft:function(boats) {
		this.boatsLeftLabel.setString("Boats Left: " + boats);
	},
	
	updateScore:function() {
		this.scoreLabel.setString("Score: " + Math.floor(gameVars.score));
	},

	addScore:function(unitTime) {
		//score variable from gameBoard
		var score = Math.round(gameVars.difficulty / (unitTime / 50)) + gameVars.difficulty;
		if (score < 0)
			score = 0;
		gameVars.score += score
		this.scoreLabel.setString("Score: " + Math.floor(gameVars.score));
	}

});

