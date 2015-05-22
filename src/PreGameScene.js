//Variable to create the scene if it has not yet been initalized
var INITIALIZED3 = false;
//PreGameLayer 
//Contains 3 menu items and is called by the PreGameScene
var PreGameLayer = cc.Layer.extend({
	pregameSprite: null,
	
	ctor:function() {
		this._super();
		
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
		this.initLabels("11", "20", "1880", "59");

		return true;
	},
	
	initLabels: function(unitsToGo, obstaclesToGo, scoreToGo, difficultyToGO) {
		var fontSizePregame = pregameSprite.width/14;
		
		var labelUnits = new cc.LabelTTF(unitsToGo, res.Porkys_ttf);
		labelUnits.setAnchorPoint(cc.p(0.5, 0.5));
		labelUnits.setFontSize(fontSizePregame);
		labelUnits.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/3 + 4));
		labelUnits.setColor(cc.color(255,255,255));
		labelUnits.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelObstacles = new cc.LabelTTF(obstaclesToGo, res.Porkys_ttf);
		labelObstacles.setAnchorPoint(cc.p(0.5, 0.5));
		labelObstacles.setFontSize(fontSizePregame);
		labelObstacles.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/5));
		labelObstacles.setColor(cc.color(255,255,255));
		labelObstacles.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelScore = new cc.LabelTTF(scoreToGo, res.Porkys_ttf);
		labelScore.setAnchorPoint(cc.p(0.5, 0.5));
		labelScore.setFontSize(fontSizePregame);
		labelScore.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/7));
		labelScore.setColor(cc.color(255,255,255));
		labelScore.enableStroke(cc.color(0,0,0), 3, false)
		
		var labelDifficulty = new cc.LabelTTF(difficultyToGO, res.Porkys_ttf);
		labelDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
		labelDifficulty.setFontSize(fontSizePregame);
		labelDifficulty.setPosition(cc.p(cc.winSize.width*3/4, pregameSprite.y + pregameSprite.height/9));
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
	var scene = new Runner();
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
