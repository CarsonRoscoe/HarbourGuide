

var PauseLayer = cc.Layer.extend({
	background:null,
	
	ctor:function(){
		this._super();
		
	},
	
	init:function(Layer){
		Layer._super();
		Layer.removeAllChildren();

		var winsize = cc.director.getWinSize();
		Layer.background = new cc.Sprite("res/PauseBG.png");
		Layer.background.setPosition(cc.p(winsize.width /2, winsize.height / 2));

		Layer.addChild(this.background);
		
		var menuItem1 = new cc.MenuItemFont("Resume", handlePause);
		var menuItem2 = new cc.MenuItemFont("Settings", Layer.pauseSettings);
		var menuItem3 = new cc.MenuItemFont("Quit", Layer.pauseQuit);
		//Adds menuItems to a Menu
		var menu = new cc.Menu(menuItem1, menuItem2, menuItem3);
		//Aligns the items vertically
		menu.alignItemsVertically();
		//Adds menu to layer
		
		Layer.addChild(menu);
	},
	
	deinit:function(Layer){
		Layer.removeAllChildren();
	},
	
	pauseQuit:function(){
		
	},
	
	pauseSettings:function(){
		
	}
	
});