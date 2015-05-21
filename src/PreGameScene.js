//Variable to create the scene if it has not yet been initalized
var INITIALIZED3 = false;
//PreGameLayer 
//Contains 3 menu items and is called by the PreGameScene
var PreGameLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
		
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		
		var pregameSprite = new cc.Sprite.create(res.Pregame_png);
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

		return true;
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
