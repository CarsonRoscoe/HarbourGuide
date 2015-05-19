var INITALIZEDHUD = false;

var HUDLayer = cc.Layer.extend({
	scoreLabel: null,
	boatsLeftLabel: null,
	scoreBackground: null,
	boatsLeftBackground: null,

	ctor:function() {
		this._super();
		this.init(this);
	},

	init:function(Layer){
		Layer._super();
		Layer.removeAllChildren();

		var winsize = cc.director.getWinSize();
		
		Layer.scoreBackground = new cc.Sprite("res/woodenLabel.png");
		Layer.scoreBackground.setPosition(cc.p(360, winsize.height - 80));
		
		Layer.scoreLabel = new cc.LabelTTF("Score: 0", "Amiga Forever", 50);
		Layer.scoreLabel.setColor(cc.color(0,0,0));
		Layer.scoreLabel.setPosition(cc.p(
				winsize.width / 2,
				winsize.height / 10));
		
		Layer.scoreBackground.addChild(this.scoreLabel);
		Layer.addChild(this.scoreBackground);
		
		var settingsLabel = new cc.MenuItemSprite(
				new cc.Sprite(res.Button_png),
				new cc.Sprite(res.Button_png),
				this.settings, this);
		var menu = new cc.Menu(settingsLabel);
		menu.setPosition(cc.p(winsize.width - 40, winsize.height - 140));
		Layer.addChild(menu);
		
		Layer.boatsLeftBackground = new cc.Sprite("res/woodenLabel.png");
		Layer.boatsLeftBackground.setPosition(cc.p(360, winsize.height - 1200));
		
		Layer.boatsLeftLabel = new cc.LabelTTF("Boats Left: ", "Amiga Forever", 50);
		Layer.boatsLeftLabel.setColor(cc.color(0,0,0));
		Layer.boatsLeftLabel.setPosition(cc.p(
				winsize.width/2, 
				winsize.height / 10));
		
		Layer.boatsLeftBackground.addChild(Layer.boatsLeftLabel);
		Layer.addChild(Layer.boatsLeftBackground);
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
	}

});

