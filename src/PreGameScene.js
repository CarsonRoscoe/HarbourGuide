//Variable to create the scene if it has not yet been initalized
var INITIALIZED3 = false;
//PreGameLayer 
//Contains 3 menu items and is called by the PreGameScene
var PreGameLayer = cc.Layer.extend({
	pregameSprite: null,
	gameVars: null,
	
	ctor:function() {
		this._super();
		this.buildInit();
		

		return true;
	},
	
	buildInit: function () {
		gameVars = new gameVariables();
		gameVars.score = 0;
		var readPlayer = loadPlayer(50);
		gameVars.difficulty = readPlayer.difficulty;
		gameVars.difficultyOffsetUp = readPlayer.difficultyUp;
		gameVars.difficultyOffsetDown = readPlayer.difficultyDown;
		gameVars.unitSpeed = 1000 - Math.round(gameVars.difficulty * 9);
		gameVars.unitsStart = 5 + Math.round(gameVars.difficulty * .35);
		gameVars.speedCount = 0;
		gameVars.realSpeed = 0;
		gameVars.unitsLeft = gameVars.unitsStart;
		gameVars.unitsComplete = 0;
		gameVars.frameRate = 16;
		gameVars.spawnRate = 10000 - Math.round(gameVars.difficulty * 50); //how often this spawns * time
		gameVars.spawnCount = gameVars.spawnRate;
		gameVars.unitsOnBoard = 1 + Math.round(gameVars.difficulty / 20);
		gameVars.isPaused = false;
		gameVars.thisScene = this;
		gameVars.blockedSpawns = 0;
		gameVars.forceKill = false;
		gameVars.passScore = Math.ceil(gameVars.unitsStart * (Math.round(gameVars.difficulty / (10)) + (gameVars.difficulty * (1 + (gameVars.difficulty / 100)))));

		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));

		pregameSprite = new cc.Sprite.create(res.Pregame_png);
		pregameSprite.setAnchorPoint(cc.p(0.5, 0.5));
		pregameSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));

		//MenuItems to navigate to Runner, Settings, and MainMenu scene
		var menuPlay = new cc.Menu(new cc.MenuItemSprite(
				new cc.Sprite(res.StartButton_png),
				new cc.Sprite(res.StartButtonP_png),
				preStart, this));

		var menuBack = new cc.MenuItemSprite(
				new cc.Sprite(res.ScoreboardBackButton_png),
				new cc.Sprite(res.ScoreboardBackButtonP_png),
				preBack, this);

		var menuSettings = new cc.MenuItemSprite(
				new cc.Sprite(res.SettingsSmall_png),
				new cc.Sprite(res.SettingsSmallP_png),
				preSettings, this);

		var topBar = new cc.Menu(menuBack, menuSettings);

		topBar.setAnchorPoint(cc.p(0.5, 0.5));
		topBar.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height - menuBack.height*3/4));

		menuPlay.setAnchorPoint(cc.p(0.5, 0.5));
		menuPlay.setPosition(cc.p(cc.winSize.width/2, (pregameSprite.y - pregameSprite.height/2)/2));
		//Aligns the items vertically
		menuPlay.alignItemsVertically();

		//Aligns top bar horizontally
		topBar.alignItemsHorizontallyWithPadding(cc.winSize.width - menuBack.width * 2.5);

		//Adds menu to layer
		this.removeAllChildren();
		this.addChild(bgSprite);
		this.addChild(pregameSprite);
		this.addChild(menuPlay);
		this.addChild(topBar);

		//Units To Send // Obstacles // Score To Pass // Difficulty Generated At
		this.initLabels(gameVars.unitsStart, 8 + Math.round(gameVars.difficulty / 20), gameVars.passScore, gameVars.difficulty);
	},
	
	initLabels: function(unitsToGo, obstaclesToGo, scoreToGo, difficultyToGO) {
		var fontSizePregame = pregameSprite.width/14;
		
		var labelUnits = new cc.LabelTTF("" + unitsToGo, "SF Slapstick Comic");
		labelUnits.setAnchorPoint(cc.p(0.5, 0.5));
		labelUnits.setFontSize(fontSizePregame);
		labelUnits.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/3));
		labelUnits.setColor(cc.color(255,255,255));
		labelUnits.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelObstacles = new cc.LabelTTF("" + obstaclesToGo, "SF Slapstick Comic");
		labelObstacles.setAnchorPoint(cc.p(0.5, 0.5));
		labelObstacles.setFontSize(fontSizePregame);
		labelObstacles.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/7.6 ));
		labelObstacles.setColor(cc.color(255,255,255));
		labelObstacles.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelScore = new cc.LabelTTF("" + scoreToGo, "SF Slapstick Comic");
		labelScore.setAnchorPoint(cc.p(0.5, 0.5));
		labelScore.setFontSize(fontSizePregame);
		labelScore.setPosition(cc.p(cc.winSize.width*.734, pregameSprite.y - pregameSprite.height/12.5));
		labelScore.setColor(cc.color(255,255,255));
		labelScore.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelDifficulty = new cc.LabelTTF("" + difficultyToGO, "SF Slapstick Comic");
		labelDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
		labelDifficulty.setFontSize(fontSizePregame);
		labelDifficulty.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y - pregameSprite.height/2.8));
		labelDifficulty.setColor(cc.color(255,255,255));
		labelDifficulty.enableStroke(cc.color(0,0,0), 3, false)
		
		this.addChild(labelUnits, 1000);
		this.addChild(labelObstacles, 1000);
		this.addChild(labelScore, 1000);
		this.addChild(labelDifficulty, 1000);
	}
});
//The following 3 functions are called when the buttons in the menu are pressed
//All the functions reset INITIALZIED3 to false, so it can be called by the scene again
//Each function runs the appropriate scene
var preStart = function() {
	INITIALIZED3 = false;
	var scene = new Runner(gameVars, this);
	cc.audioEngine.playEffect(res.button);
	cc.audioEngine.stopMusic(); //stops the music so that the game music can be played.
	
	cc.director.pushScene(scene);
}

var preBack = function() {
	INITIALIZED3 = false;
	var scene = new MenuScene();
	cc.director.popScene();
}

var preSettings = function() {
	INITIALIZED3 = false;
	var scene = new SettingsScene();
	cc.audioEngine.playEffect(res.button);
	cc.director.pushScene(scene); //push
}
//PreGameScene
//Adds a PreGameLayer to itself if the scene has not already been initialized
var PreGameScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED3 == false) {

			INITIALIZED3 = true;

			var layer = new PreGameLayer();
			this.removeAllChildren();
			this.addChild(layer);
		}
	}
});

var gameVariables = function() {
	score: null;
	unitsLeft: null;
	unitsComplete: null;
	unitsStart: null;
	unitSpeed: null;
	frameRate: null;
	spawnCount: null;
	spawnRate: null;
	difficulty: null;
	difficultyOffsetUp: null;
	difficultyOffsetDown: null;
	unitsOnBoard: null;
	isPaused: null;
	thisScene: null;
	speedCount: null;
	realSpeed: null;
	blockedSpawns: null;
	forceKill: null;
	passScore: null;
	newDiff: null;
}
