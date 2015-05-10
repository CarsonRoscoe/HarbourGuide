var INITALIZEDHUD = false;

var HUDLayer = cc.Layer.extend({
	scoreLabel: null,
	boatsLeftLabel: null,
	score: 0,

	ctor:function() {
		this._super();
		this.init();
	},

	init:function(){
		this._super();

		var winsize = cc.director.getWinSize();
		
		this.scoreLabel = new cc.LabelTTF("Score:0", "Helvetica", 100);
		this.scoreLabel.setColor(cc.color(200,200,200));
		this.scoreLabel.setPosition(cc.p(200, winsize.height - 100));
		this.addChild(this.scoreLabel);
		
		var settingsLabel = new cc.MenuItemSprite(
				new cc.Sprite(res.Button_png),
				new cc.Sprite(res.Button_png),
				this.settings, this);
		var menu = new cc.Menu(settingsLabel);
		menu.setPosition(cc.p(winsize.width - 100, winsize.height - 100));
		this.addChild(menu);
		
		this.boatsLeftLabel = new cc.LabelTTF("Boats Left:0", "Helvetica", 100);
		this.boatsLeftLabel.setColor(cc.color(200,200,200));
		this.boatsLeftLabel.setPosition(cc.p(280, winsize.height - winsize.height + 100));
		this.addChild(this.boatsLeftLabel);
	},
	
	settings :function() {
		var scene = new SettingsScene();
		cc.audioEngine.playEffect(res.button, false); //button sound doesn't loop
		cc.director.runScene(scene); //push
	},

	addScore:function(){
		this.score++;
		this.scoreLabel.setString("Score:" + score);
	}

});

