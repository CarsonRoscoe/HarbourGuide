//Variable to create the scene if it has not yet been initialized
var INITIALIZED6 = false;

//ScoresLayer 
//Contains 1 menu item and is called by the ScoresScene
var AchievementLayer = cc.Layer.extend({
	spriteBack: null,
	spriteTitle: null,
	achArray : null,
	offset : null,
	isDown: null,
	fontSize: null,
	defaultFromTop: null,
	achRoom: null,
	dataArray: null,
	snapBack: null,
	spriteBackground: null,
	
	ctor:function() {
		this._super();
		spriteArray = [];
		spriteBackground = new cc.Sprite.create(res.ScoreboardBack_png);
		spriteBackground.setAnchorPoint(cc.p(0.5, 0.5));
		spriteBackground.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		spriteBackground.setScaleX(cc.winSize.width/spriteBackground.width);
		spriteBackground.setScaleY(cc.winSize.height/spriteBackground.height);
		this.addChild(spriteBackground, -200);
		init(this);	
		return true;
	}
});

var init = function(Layer) {
	var size = cc.winSize;
	offset = 0;
	isDown = false;
	//Score;Dif;Time
	//Local;Global
	dataArray = [];
	
	/*GET RID OF THESE LABELS ONCE PROPER GRAPHICS ARE IN PLACE FOR BUTTONS*/
	spriteArray[0] = spriteBack = new cc.Sprite.create(res.ScoreboardBackButton_png);
	spriteBack.setAnchorPoint(cc.p(0.5, 0.5));
	var backSize = ((size.width/10)*1)/spriteBack.width;
	spriteBack.setPosition(cc.p((spriteBack.width * (backSize*1.2)/2),(size.height-(spriteBack.height)*.3)));
	spriteBack.setScaleX(backSize*1.3);
	spriteBack.setScaleY(backSize*1.2);
	
	//size.height-(spriteTitle.height * globalLocalY)/2
	spriteArray[1] = spriteTitle = new cc.Sprite.create(res.UnclickedRect_png);
	var globalLocalSize = ((size.width/10)*4.5)/spriteTitle.width;
	var globalLocalY = (spriteArray[0].height * backSize * 1.2) / spriteTitle.height;
	spriteTitle.setAnchorPoint(cc.p(0.5, 0.5));
	spriteTitle.setPosition(cc.p(cc.winSize.width/2,spriteArray[0].y));
	spriteTitle.setScaleX(size.width/spriteTitle.width);
	spriteTitle.setScaleY(((size.height - spriteArray[1].y)/spriteArray[1].height)*2);
	
	Layer.addChild(spriteBack, 20);
	Layer.addChild(spriteTitle, 10);
	
	initAchievements(Layer);
}

var initData = function() {
	dataArray = getMyAchievements(loadAchievements());
}

var formatString = function(i) {
		dataArray[i] = "Format " + i;
}

var initAchievements = function(Layer) {
	var size = cc.winSize;
	fontSize = 46;
	initData();
	defaultFromTop = cc.winSize.height - spriteArray[1].height * ((size.height - spriteArray[1].y)/spriteArray[1].height)*2 ;
	achArray = [];
	achRoom = ((new cc.Sprite.create(res.AchievementBack_png)).height) * 4;
	//var amount = (((defaultFromTop) / achRoom) < (dataArray.length))?Math.ceil(((defaultFromTop) / achRoom)):dataArray.length;
	var amount = dataArray.length;
	for (var i = 0; i < amount; i++) {
		achArray[i] = new achObject(i);
		cc.log(i);
		var newY = defaultFromTop - spriteTitle.height * i * 4;
		achArray[i].spriteB = new cc.Sprite.create(res.AchievementBack_png);
		achArray[i].spriteB.setAnchorPoint(cc.p(0, 1));
		achArray[i].spriteB.setPosition(cc.p(0, newY));
		achArray[i].spriteB.setScaleX(cc.winSize.width/achArray[i].spriteB.width);
		achArray[i].spriteB.setScaleY(4);
		
		achArray[i].spriteI = new cc.Sprite.create(dataArray[i].Img);
		achArray[i].spriteI.setAnchorPoint(cc.p(0, .5));
		achArray[i].spriteI.setPosition(cc.p(achArray[i].spriteI.width/3, achArray[i].spriteB.y - achArray[i].spriteB.height*2));
		achArray[i].spriteI.setScaleX(2);
		achArray[i].spriteI.setScaleY(2);
		
		achRoom = achArray[i].spriteB.height * 4;
		achArray[i].label = new cc.LabelTTF(dataArray[i].Details, "Courier");
		achArray[i].label.setFontSize(30);
		achArray[i].label.setColor(cc.color(0,0,0));
		achArray[i].label.setAnchorPoint(cc.p(0, 0.5));
		achArray[i].label.setPosition(cc.p(achArray[i].spriteI.width * 2 + achArray[i].spriteI.x + 10, newY - (achArray[i].spriteB.height*2.4)));
		
		achArray[i].labelT = new cc.LabelTTF(dataArray[i].Title, "Courier");
		achArray[i].labelT.setFontSize(50);
		achArray[i].labelT.setColor(cc.color(0,0,0));
		achArray[i].labelT.setAnchorPoint(cc.p(0, 0.5));
		achArray[i].labelT.setPosition(cc.p(cc.winSize.width/2 + achArray[i].spriteI.x, newY - (achArray[i].spriteB.height * 1.2)));
		Layer.addChild(achArray[i].spriteB);
		Layer.addChild(achArray[i].label);
		Layer.addChild(achArray[i].spriteI);
		Layer.addChild(achArray[i].labelT);
		cc.log(achArray[i].labelT.y);
	}
	initTouchEventsAch(Layer);
	var loop = setInterval(function() {
			updateAch();
		}, 34);
}

function achObject(newId) {
	this.spriteB = null;
	this.spriteI = null;
	this.label = null;
	this.labelT = null;
	this.id = newId;
}

var initTouchEventsAch = function(Layer) {
        cc.eventManager.addListener(cc.EventListener.create({
			touchDown: null,
			relativeY: null,
			clickedY: null,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
			
            onTouchesBegan: function(touches, event) {
				isDown = true;
				touchDown = touches[0].getLocation();
				snapBack = false;
				doClicked(getButtonClicked(touches[0].getLocation()), Layer);
            },

            onTouchesMoved: function(touches, event) {
                if(isDown) {
				var cury = touches[0].getLocation().y;
				var dis = cury - touchDown.y;
				offset = (Math.abs(dis / 8) < 16)?dis/8:((dis > 0)?16:-16);
				}
            },

            onTouchesEnded: function(touches, event){
				isDown = false;
				offset = 0;
				if (achArray.length != 0)
					if (((achArray[0].id) == 0 && achArray[0].spriteB.y <= defaultFromTop)?true:false)
						moveToPosTop();
            }
        }), Layer);
}

var doClicked = function(i, Layer) {
	switch(i) {
		case 0:
		achSceneBack(Layer);
		break;
	}
}

var getButtonClicked = function(clickPoint) {
	var left;
	var right;
	var up;
	var down
	var x = clickPoint.x;
	var y = clickPoint.y;
	for (var i = 0; i < spriteArray.length; i++) {
		left = spriteArray[i].x - spriteArray[i].width/2;
		right = spriteArray[i].x + spriteArray[i].width/2;
		up = spriteArray[i].y + spriteArray[i].height/2;
		down = spriteArray[i].y - spriteArray[i].height/2;
		
		if (left <= x && right >= x && up >= y && down <= y)
			return i;
	}
	return null;
}

var moveToPosTop = function()  {
	var amount = dataArray.length;
	for (var i = 0; i < amount; i++)  {
		var newY = defaultFromTop - spriteTitle.height * i * 4;
		achArray[i].spriteB.y = newY;
		achArray[i].label.y = newY - (achArray[i].spriteB.height*3);
		achArray[i].spriteI.y = achArray[i].spriteB.y - achArray[i].spriteB.height*2;
		achArray[i].labelT.y = newY - (achArray[i].spriteB.height * 1.2);
	}
}

var updateAch = function() {
	if (isDown) {
		var len = achArray.length;
		if (len >= Math.ceil(defaultFromTop / achRoom)) {
			var goDown = ((achArray[0].id) == 0 && achArray[0].spriteB.y <= defaultFromTop)?false:true;
			var goUp = ((achArray[len-1].id) == dataArray.length-1 && achArray[len-1].spriteB.y >= achRoom)?false:true;
			
			cc.log(goDown + ", " + goUp);
			for (var i = 0; i < len; i++){
				
				if (!dataArray.length < Math.ceil(defaultFromTop / achRoom)) {
					if (offset < 0 && goDown) {
						achArray[i].spriteB.y += offset;
						achArray[i].label.y += offset;
						achArray[i].labelT.y += offset;
						achArray[i].spriteI.y += offset;
					} else if (offset > 0 && goUp) {
						achArray[i].spriteB.y += offset;
						achArray[i].spriteI.y += offset;
						achArray[i].label.y += offset;
						achArray[i].labelT.y += offset;
					}
				}
			}
		}
	}
}

//The following function is called when the button in the menu is pressed
//All the functions reset INITIALZIED5 to false, so it can be called by the scene again
var achSceneBack = function(Layer) {
	INITIALIZED6 = false;
	var scene = new MenuScene();
	cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene);
}

//ScoresScene
//Adds a ScoresLayer to itself if the scene has not already been initialized
var AchievementScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED6 == false) {

			INITIALIZED6 = true;

			var layer = new AchievementLayer();
			this.addChild(layer);
		}
	}
});