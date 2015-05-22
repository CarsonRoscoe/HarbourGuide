//Variable to create the scene if it has not yet been initalized
var INITIALIZED3 = false;
//postGameLayer 
//Contains 3 menu items and is called by the postGameScene
var PostGameLayer = cc.Layer.extend({
	postgameSprite: null,
	
	ctor:function(success, failed, difficulty, newDiff, score, time) {
		this._super();
		
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		
		postgameSprite = new cc.Sprite.create(res.Postgame_png);
		postgameSprite.setAnchorPoint(cc.p(0.5, 0.5));
		postgameSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		
		//MenuItems to navigate to Runner, Settings, and MainMenu scene
		var menuNext = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.NextDefault_png),
				new cc.Sprite(res.NextP_png),
				postNext, this));
		
		menuNext.setAnchorPoint(cc.p(0.5, 0.5));
		menuNext.setPosition(cc.p(cc.winSize.width/2, (postgameSprite.y - postgameSprite.height/2)/2));
		//Aligns the items vertically
		menuNext.alignItemsVertically();
		
		//Adds menu to layer
		this.removeAllChildren();
		this.addChild(bgSprite);
		this.addChild(postgameSprite);
		this.addChild(menuNext);
		getAchievements([17]);
		//Boats Sent Through // Units failed(wrong gate) // Difficulty Changed(+3 // -2) // New difficulty
		this.initLabels(success, failed, difficulty, newDiff);
		if (score >= 0) {
			var name = prompt("Please enter your name and submit your score", "Guest");
			var newData = new dataPack(name, score, newDiff - difficulty, Math.round(time));
			new sendCommand("DATA", newData);
			new saveScore(newData);
		}

		return true;
	},
	
	initLabels: function(unitsPass, unitsFailed, difficultyChange, newDifficulty) {
		var fontSizepostgame = postgameSprite.width/14;
		
		var labelUnits = new cc.LabelTTF("" + unitsPass, "SF Slapstick Comic");
		labelUnits.setAnchorPoint(cc.p(0.5, 0.5));
		labelUnits.setFontSize(fontSizepostgame);
		labelUnits.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/3));
		labelUnits.setColor(cc.color(255,255,255));
		labelUnits.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelObstacles = new cc.LabelTTF("" + unitsFailed, "SF Slapstick Comic");
		labelObstacles.setAnchorPoint(cc.p(0.5, 0.5));
		labelObstacles.setFontSize(fontSizepostgame);
		labelObstacles.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/7.6));
		labelObstacles.setColor(cc.color(255,255,255));
		labelObstacles.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelScore = new cc.LabelTTF("" + difficultyChange, "SF Slapstick Comic");
		labelScore.setAnchorPoint(cc.p(0.5, 0.5));
		labelScore.setFontSize(fontSizepostgame);
		labelScore.setPosition(cc.p(cc.winSize.width*.734, pregameSprite.y - pregameSprite.height/12.5));
		if (difficultyChange >= 0) {
			labelScore.setColor(cc.color(255,255,255));
		} else {
			labelScore.setColor(cc.color(255, 0, 0));
		}
		labelScore.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelDifficulty = new cc.LabelTTF("" + newDifficulty, "SF Slapstick Comic");
		labelDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
		labelDifficulty.setFontSize(fontSizepostgame);
		labelDifficulty.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y - pregameSprite.height/2.8));
		labelDifficulty.setColor(cc.color(255,255,255));
		labelDifficulty.enableStroke(cc.color(0,0,0), 3, false)
		
		this.addChild(labelUnits, 1000);
		this.addChild(labelObstacles, 1000);
		this.addChild(labelScore, 1000);
		this.addChild(labelDifficulty, 1000);
	}
});
//The following 3 functions are called when the buttons in the menu are postssed
//All the functions reset INITIALZIED3 to false, so it can be called by the scene again
//Each function runs the appropriate scene
var postNext = function() {
	/*INITIALIZED3 = false;
	var scene = new PreGameScene();
	cc.audioEngine.playEffect(res.button);
	cc.audioEngine.stopMusic(); //stops the music so that the game music can be played.
	cc.director.pushScene(scene);*/
	reInitLevel();
	cc.director.popScene();
}
//postGameScene
//Adds a postGameLayer to itself if the scene has not already been initialized
var postGameScene = cc.Scene.extend({
	success: null,
	fail: null,
	diffChange: null,
	newDiff: null,
	score: null,
	time: null,
	
	ctor:function(sent, failed, change, Diff, sc, t) {
		this._super();
		success = sent;
		fail = failed;
		diffChange = change;
		newDiff = Diff;
		score = sc;
		time = t;
	},
	
	onEnter:function() {
		this._super();

		if(INITIALIZED3 == false) {

			INITIALIZED3 = true;

			var layer = new PostGameLayer(success, fail, diffChange, newDiff, score, time);
			this.removeAllChildren();
			this.addChild(layer);
		}
	}
});
