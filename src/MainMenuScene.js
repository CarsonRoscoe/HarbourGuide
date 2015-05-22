//Variable to create the scene if it has not yet been initalized
var INITIALIZED2 = false;
//MenuLayer 
//Contains 3 menu items and is called by the MenuScene
var MenuLayer = cc.Layer.extend({
	//Constructor for Layer
	ctor:function() {
		this._super();
		this.init(this);
		
	},
	
	init:function(Layer){
		this._super();
		var winsize = cc.director.getWinSize();
		//MenuItems to navigate to PreGame, Scores, and Settings scene
		var bgSprite = new cc.Sprite.create(res.MenuBg_png);
		bgSprite.setAnchorPoint(cc.p(0.5, 0.5));
		bgSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		
		var logoSprite = new cc.Sprite.create(res.MenuLogo_png);
		logoSprite.setAnchorPoint(cc.p(0.5, 0.5));
		logoSprite.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height * 3/4));
		logoSprite.setScaleX = 0;
		logoSprite.setScaleY = 0;
		
		var width = cc.winSize.width;
		var height = cc.winSize.height;
		
		/*var node = cc.DrawNode.create();
		Layer.addChild(node, 1000);
		
		var timer = 0;
		var drawTimer = setInterval(function (){
			if (timer < 120 ) {
				node.clear();
				node.drawRect(
					cc.p(width, height), 
					cc.p(0, 0), 
					cc.color(255, 255, 255, .5), 
					1, 
					cc.color(255, 255, 255, (120 - timer)/120)
				);
				cc.log();
				timer += 1;
			} else {
				clearInterval(drawTimer);
				Layer.removeChild(node, true);
			}
		}, 17);*/
		
		var menuItem1 = new cc.MenuItemSprite(
				new cc.Sprite(res.PlayButton_png),
				new cc.Sprite(res.PlayButtonP_png),
				Layer.mainPlay, Layer);
		var menuItem2 = new cc.MenuItemSprite(
				new cc.Sprite(res.ScoreButton_png),
				new cc.Sprite(res.ScoreButtonP_png),
				Layer.mainScores, Layer);
		var menuItem3 = new cc.MenuItemSprite(
				new cc.Sprite(res.AchievementButton_png),
				new cc.Sprite(res.AchievementButtonP_png),
				Layer.mainAchievement, Layer);
		var menuItem4 = new cc.MenuItemSprite(
				new cc.Sprite(res.SettingButton_png),
				new cc.Sprite(res.SettingButtonP_png),
				Layer.mainSettings, Layer);
				
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3, menuItem4);
		menu.opacity = 0;
		menu.setAnchorPoint(0.5, 0.5);
		menu.setPosition(cc.winSize.width/2, cc.winSize.height/3);
		
		var logoStartX = logoSprite.x;
		var logoStartY = logoSprite.y;
		
		logoSprite.runAction(cc.RotateTo.create(2,-15));
		logoSprite.runAction(cc.MoveTo.create(2, logoStartX, logoStartY + 15));
		
		var t = setTimeout(function() {
			var logoActionRotate = cc.RepeatForever.create(cc.Sequence.create(cc.RotateTo.create(4, 15), cc.RotateTo.create(4, -15)));
			logoSprite.runAction(logoActionRotate);
		}, 2000);
		
		var logoActionMove = cc.RepeatForever.create(cc.Sequence.create(cc.MoveTo.create(4, logoStartX, logoStartY + 30).easing(cc.easeSineInOut(0)),cc.MoveTo.create(4, logoStartX, logoStartY -30).easing(cc.easeSineInOut(0))));
		
		var logoActionGrow = cc.Sequence.create(cc.ScaleTo.create(0, 0, 0), cc.ScaleTo.create(1, 1.25, 1.25), cc.ScaleTo.create(.25, 1, 1));
		
		var menuActionMove = cc.MoveBy.create(1, 0, -cc.winSize.height/30);
		var menuActionFade = cc.Sequence.create(cc.FadeOut.create(0), cc.FadeIn.create(1));
		
		menu.runAction(menuActionFade);
		menu.runAction(menuActionMove);
		
		logoSprite.runAction(logoActionGrow);
		logoSprite.runAction(logoActionMove);
		cc.log(logoSprite.x + ", " + logoSprite.y);
		
		//Aligns the items vertically
		menu.alignItemsVertically();
		
		//Adds menu to layer
		Layer.addChild(bgSprite);
		Layer.addChild(logoSprite);
		Layer.addChild(menu);
		
	},
	
	//The following 3 functions are called when the buttons in the menu are pressed
	//All the functions reset INITIALZIED2 to false, so it can be called by the scene again
	//Each function runs the appropriate scene
	mainPlay: function() {
		INITIALIZED2 = false;
		var scene = new PreGameScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.pushScene(scene);
	},

	mainScores: function() {
		INITIALIZED2 = false;
		var scene2 = new ScoresScenes();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.pushScene(scene2); //push
	},

	mainSettings: function() {
		INITIALIZED2 = false;
		var scene = new SettingsScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.pushScene(scene); //push
	},
	
	mainAchievement: function() {
		INITIALIZED2 = false;
		var scene = new AchievementScenes();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.pushScene(scene); //push
	}
});

var BackgroundLayer = cc.Layer.extend({
	backgroundImg: null,
	
	ctor:function(){
		this._super();
		this.init(this);
	},

	init:function(Layer){
		var winsize = cc.director.getWinSize();
		
		Layer.backgroundImg = new cc.Sprite(res.MenuBg_png);
		Layer.backgroundImg.setPosition(cc.p(winsize.width / 2, winsize.height /2));
		Layer.addChild(Layer.backgroundImg);
	}
});

//MenuScene
//Adds a MenuLayer to itself if the scene has not already been initialized
var MenuScene = cc.Scene.extend({
	onEnter:function() {
		this._super();
		
		if(INITIALIZED2 == false) {
			
			INITIALIZED2 = true;
			var bgLayer = new BackgroundLayer();
			var layer = new MenuLayer();
			this.removeAllChildren();
			this.addChild(layer);
			cc.audioEngine.playMusic(res.background_mp3, true); //starts audio NOTE: browsers don't support loop, seperate loop needs to be made
		}
	}
});

