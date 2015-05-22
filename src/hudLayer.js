var INITALIZEDHUD = false;

var HUDLayer = cc.Layer.extend({
	scoreLabel: null,
	boatsLeftLabel: null,
	scoreHolder: null,
	scoreBackground: null,
	boatsLeftHolder: null,
	boatsLeftBackground: null,
	cueIcon: null,
	scoreIcon: null,
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
		Layer.scoreHolder.setPosition(cc.p(winsize.width / 2.75, winsize.height - ((winsize.height - (cellSize * cellsColumn)) / 4)));
		
		Layer.scoreIcon = new cc.Sprite(res.CurrentScoreIconHUD);
		Layer.scoreIcon.setScaleX(Layer.scoreHolder.width * .14379 / Layer.scoreIcon.width);
		Layer.scoreIcon.setScaleY(Layer.scoreHolder.height * .63636 / Layer.scoreIcon.height);
		Layer.scoreIcon.setAnchorPoint(.5, .5);
		Layer.scoreIcon.setPosition(cc.p(Layer.scoreHolder.x - Layer.scoreHolder.width / 2.54, Layer.scoreHolder.y));
		
		Layer.scoreLabel = new cc.LabelTTF("0", "SF Slapstick Comic", cellSize / 2);
		Layer.scoreLabel.setColor(cc.color(255,255,255)); 
		Layer.scoreLabel.enableStroke(cc.color(0,0,0), 3, false);
		Layer.scoreLabel.setAnchorPoint(0, .5);
		Layer.scoreLabel.setPosition(cc.p(Layer.scoreHolder.x - Layer.scoreHolder.width / 6, Layer.scoreHolder.y + 4));
		
		Layer.addChild(this.scoreBackground);
		Layer.addChild(Layer.scoreLabel, 2000);
		Layer.addChild(Layer.scoreHolder, 1000);
		Layer.addChild(Layer.scoreIcon, 1000);
		
		var settingsLabel = new cc.MenuItemSprite(new cc.Sprite(res.pauseButtonDown), new cc.Sprite(res.pauseButtonUp),	handlePause, this);
		var menu = new cc.Menu(settingsLabel);
		menu.setAnchorPoint(1, .5);
		menu.setPosition(cc.p(winsize.width - (winsize.width / 8), winsize.height - ((winsize.height - (cellSize * cellsColumn)) / 4)));
		Layer.addChild(menu);

		Layer.boatsLeftBackground.setAnchorPoint(.5, 0);
		Layer.boatsLeftBackground.setScaleX(winsize.width / Layer.scoreBackground.width);
		Layer.boatsLeftBackground.setScaleY((winsize.height - (cellSize * cellsColumn)) / 2 / Layer.scoreBackground.height);
		Layer.boatsLeftBackground.setPosition(cc.p(winsize.width / 2, 0));

		Layer.boatsLeftHolder = new cc.Sprite(res.TextHolderHUD);
		Layer.boatsLeftHolder.setAnchorPoint(.5, .5);
		Layer.boatsLeftHolder.setPosition(cc.p(winsize.width / 2, (winsize.height - (cellSize * cellsColumn)) / 4));
		
		Layer.cueIcon = new cc.Sprite(res.CueIconHUD);
		Layer.cueIcon.setScaleX(Layer.boatsLeftHolder.width * .14379 / Layer.cueIcon.width);
		Layer.cueIcon.setScaleY(Layer.boatsLeftHolder.height * .63636 / Layer.cueIcon.height);
		Layer.cueIcon.setAnchorPoint(.5, .5);
		Layer.cueIcon.setPosition(cc.p(Layer.boatsLeftHolder.x - Layer.boatsLeftHolder.width / 2.54, Layer.boatsLeftHolder.y));
		
		Layer.boatsLeftLabel = new cc.LabelTTF("", "SF Slapstick Comic", cellSize / 2);
		Layer.boatsLeftLabel.setColor(cc.color(255,255,255));
		Layer.boatsLeftLabel.enableStroke(cc.color(0,0,0), 3, false);
		Layer.boatsLeftLabel.setAnchorPoint(0, .5);
		Layer.boatsLeftLabel.setPosition(cc.p(Layer.boatsLeftHolder.x - Layer.boatsLeftHolder.width / 6, Layer.boatsLeftHolder.y + 4));
		
		Layer.addChild(Layer.boatsLeftBackground);
		Layer.addChild(Layer.boatsLeftHolder, 1000);
		Layer.addChild(Layer.boatsLeftLabel, 2000);
		Layer.addChild(Layer.cueIcon, 1000);
	},
	

	updateBoatsLeft:function(boats) {
		this.boatsLeftLabel.setString(boats);
	},
	
	updateScore:function() {
		this.scoreLabel.setString(Math.floor(gameVars.score));
	},

	addScore:function(unitTime) {
		//score variable from gameBoard
		var score = Math.round(gameVars.difficulty / (unitTime / 50)) + gameVars.difficulty;
		if (score < 0)
			score = 0;
		gameVars.score += score
		this.scoreLabel.setString(Math.floor(gameVars.score));
	}

});

