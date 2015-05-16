var INITALIZEDHUD = false;

var HUDLayer = cc.Layer.extend({
	scoreLabel: null,
	boatsLeftLabel: null,
	scoreBackground: null,
	boatsLeftBackground: null,

	ctor:function() {
		this._super();
		this.init();
	},

	init:function(boatsLeft){
		this._super();
		this.removeAllChildren();

		var winsize = cc.director.getWinSize();
		
		this.scoreBackground = new cc.Sprite("res/woodenLabel.png");
		this.scoreBackground.setPosition(cc.p(360, winsize.height - 80));
		
		this.scoreLabel = new cc.LabelTTF("Score: 0", "Helvetica", 100);
		this.scoreLabel.setColor(cc.color(200,200,200));
		this.scoreLabel.setPosition(cc.p(
				this.scoreBackground.width/2,
				this.scoreBackground.height/2));
		
		this.scoreBackground.addChild(this.scoreLabel);
		this.addChild(this.scoreBackground);
		
		var settingsLabel = new cc.MenuItemSprite(
				new cc.Sprite(res.Button_png),
				new cc.Sprite(res.Button_png),
				this.settings, this);
		var menu = new cc.Menu(settingsLabel);
		menu.setPosition(cc.p(winsize.width - 100, winsize.height - 100));
		this.addChild(menu);
		
		this.boatsLeftBackground = new cc.Sprite("res/woodenLabel.png");
		this.boatsLeftBackground.setPosition(cc.p(360, winsize.height - 1200));
		
		this.boatsLeftLabel = new cc.LabelTTF("Boats Left: ", "Helvetica", 100);
		this.boatsLeftLabel.setColor(cc.color(200,200,200));
		this.boatsLeftLabel.setPosition(cc.p(
				this.boatsLeftBackground.width/2, 
				this.boatsLeftBackground.height/2));
		
		this.boatsLeftBackground.addChild(this.boatsLeftLabel);
		this.addChild(this.boatsLeftBackground);
	},
	
	settings :function() {
		var scene = new SettingsScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.runScene(scene); //push
	},
	
	updateBoatsLeft:function(boats) {
		this.boatsLeftLabel.setString("Boats Left: " + boats);
	},

	addScore:function(unitTime) {
		var winsize = cc.director.getWinSize();
		//score variable from gameBoard
		var score = Math.round(gameVars.difficulty / (unitTime / 5));
		if (score < 0)
			score = 0;
		gameVars.score += score
		this.scoreLabel.setString("Score: " + gameVars.score);
		this.boatsLeftLabel.setPosition(cc.p(280, winsize.height - winsize.height + 100));
	}

});

