//Variable to create the scene if it has not yet been initialized
var INITIALIZED6 = false;

/**
* AchievementLayer which is drawn by the AchievementScene. Draws achievement.
*/
var AchievementLayer = cc.Layer.extend({
	spriteBackAch: null,
	spriteTitle: null,
	achArray : null,
	offset : null,
	isDown: null,
	fontSize: null,
	defaultFromTop: null,
	achRoom: null,
	dataArrayAch: null,
	snapBack: null,
	spriteBackAchground: null,
	loop: null,
	
	/**
	* Constructor for achievement Layer. draws backgroun then calls the init function.
	*/
	ctor:function() {
		this._super();
		spriteArray = [];
		spriteBackAchground = new cc.Sprite.create(res.MenuBg_png);
		spriteBackAchground.setAnchorPoint(cc.p(0.5, 0.5));
		spriteBackAchground.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
		spriteBackAchground.setScaleX(cc.winSize.width/spriteBackAchground.width);
		spriteBackAchground.setScaleY(cc.winSize.height/spriteBackAchground.height);
		this.addChild(spriteBackAchground, -200);
		init(this);	
		return true;
	}
});

/**
*Init function for AchievementScene. Draws all buttons and fetches data.
* Param: Layer to draw to.
*/
var init = function(Layer) {
	var size = cc.winSize;
	offset = 0;
	isDown = false;
	//Score;Dif;Time
	//Local;Global
	dataArrayAch = [];
	
	/*GET RID OF THESE LABELS ONCE PROPER GRAPHICS ARE IN PLACE FOR BUTTONS*/
	spriteArray[0] = spriteBackAch = new cc.Sprite.create(res.ScoreboardBackButton_png);
	spriteBackAch.setAnchorPoint(cc.p(0, 1));
	spriteBackAch.setPosition(cc.p(0,cc.winSize.height));
	
	//size.height-(spriteTitle.height * globalLocalY)/2
	spriteArray[1] = spriteTitle = new cc.Sprite.create(res.AchievementLabel_png);
	spriteTitle.setAnchorPoint(cc.p(0, 1));
	spriteTitle.setPosition(cc.p(spriteArray[0].width, spriteArray[0].y));
	
	Layer.addChild(spriteBackAch, 20);
	Layer.addChild(spriteTitle, 10);
	
	initAchievements(Layer);
}

/**
* Initiates the data of achievements from local storage into an array.
*/
var initData = function() {
	dataArrayAch = getMyAchievements(loadAchievements());
}

/**
* Initiates each individual achievement drawn
* Param: Layer to draw to.
*/
var initAchievements = function(Layer) {
	var size = cc.winSize;
	fontSize = 46;
	initData();
	defaultFromTop = cc.winSize.height - spriteArray[1].height;
	achArray = [];
	achRoom = ((new cc.Sprite.create(res.AchievementBack_png)).height) * 4;
	//var amount = (((defaultFromTop) / achRoom) < (dataArrayAch.length))?Math.ceil(((defaultFromTop) / achRoom)):dataArrayAch.length;
	var amount = dataArrayAch.length;
	for (var i = 0; i < amount; i++) {
		achArray[i] = new achObject(i);
		var newY = defaultFromTop - spriteTitle.height * i * 1.5;
		achArray[i].spriteB = new cc.Sprite.create(dataArrayAch[i].Img);
		achArray[i].spriteB.setAnchorPoint(cc.p(0, 1));
		achArray[i].spriteB.setPosition(cc.p(0, newY));
		achArray[i].spriteB.setScaleX(cc.winSize.width/achArray[i].spriteB.width);
		achArray[i].spriteB.setScaleY(cc.winSize.width/achArray[i].spriteB.width);
		
		achRoom = achArray[i].spriteB.height;
		achArray[i].label = new cc.LabelTTF(dataArrayAch[i].Details, "Cousine");
		achArray[i].label.setFontSize(30);
		achArray[i].label.setColor(cc.color(0,0,0));
		achArray[i].label.setAnchorPoint(cc.p(0.5, 0));
		achArray[i].label.setPosition(cc.p(achArray[i].spriteB.width / 2 + achArray[i].spriteB.width / 10, achArray[i].spriteB.y - fontSize * 3.3));
		
		achArray[i].labelT = new cc.LabelTTF(dataArrayAch[i].Title, "Cousine");
		achArray[i].labelT.setFontSize(44);
		achArray[i].labelT.setColor(cc.color(0,0,0));
		achArray[i].labelT.setAnchorPoint(cc.p(0.5, 0.5));
		achArray[i].labelT.setPosition(cc.p(achArray[i].spriteB.width / 2 + achArray[i].spriteB.width / 10, achArray[i].spriteB.y - fontSize * 1.1));
		Layer.addChild(achArray[i].spriteB);
		Layer.addChild(achArray[i].label);
		Layer.addChild(achArray[i].labelT);
	}
	initTouchEventsAch(Layer);
	loop = setInterval(function() {
			updateAch();
		}, 34);
}

/**
* Achievement objects data structure.
* Param: Id of it.
*/
function achObject(newId) {
	this.spriteB = null;
	this.label = null;
	this.labelT = null;
	this.id = newId;
}

/**
* Initiates the touch events for controls.
* Param: Layer to get touch events for.
*/
var initTouchEventsAch = function(Layer) {
		
		/**
		* Creates the listener object
		*/
        cc.eventManager.addListener(cc.EventListener.create({
			touchDown: null,
			relativeY: null,
			clickedY: null,
			clickBack: null,
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
			
			/**
			* Touch detection on click
			* Param: Array of touches
			* Event: Type of touch
			*/
            onTouchesBegan: function(touches, event) {
				isDown = true;
				touchDown = touches[0].getLocation();
				snapBack = false;
				if (myClickContainsPoint(touchDown, 0)) {
					clickBack = true;
					Layer.removeChild(Layer.spriteBack);
					Layer.spriteBack = new cc.Sprite.create(res.ScoreboardBackButtonP_png);
					Layer.spriteBack.setAnchorPoint(cc.p(0, 1));
					Layer.spriteBack.setPosition(cc.p(0,cc.winSize.height));
					Layer.addChild(Layer.spriteBack, 100);
				}
						
            },

			/**
			* Touch detection on swiping
			* Param: Array of touches
			* Event: Type of touch
			*/
            onTouchesMoved: function(touches, event) {
                if(isDown) {
				var cury = touches[0].getLocation().y;
				var dis = cury - touchDown.y;
				offset = (Math.abs(dis / 8) < 16)?dis/8:((dis > 0)?16:-16);
				}
            },

			/**
			* Touch detection on ending a click
			* Param: Array of touches
			* Event: Type of touch
			*/
            onTouchesEnded: function(touches, event){
				isDown = false;
				offset = 0;
				if (achArray.length != 0)
					if (((achArray[0].id) == 0 && achArray[0].spriteB.y <= defaultFromTop)?true:false)
						moveToPosTop();
					
				if (myClickContainsPoint(touchDown, 0)) {
					if (clickBack == true) {
						achSceneBack(Layer);
					}
				}
				
				Layer.removeChild(Layer.spriteBack);
				Layer.spriteBack = new cc.Sprite.create(res.ScoreboardBackButton_png);
				Layer.spriteBack.setAnchorPoint(cc.p(0, 1));
				Layer.spriteBack.setPosition(cc.p(0,cc.winSize.height));
				Layer.addChild(Layer.spriteBack, 100);
				clickBack = false;
            }
        }), Layer);
}

/**
* Returns which button is being clicked
* Param: Point of click
*/
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

/**
*	Snaps it back to the top
*/
var moveToPosTop = function()  {
	var amount = dataArrayAch.length;
	for (var i = 0; i < amount; i++)  {
		var newY = defaultFromTop - spriteTitle.height * i * 1.5;
		achArray[i].spriteB.y = newY;
		achArray[i].label.y = achArray[i].spriteB.y - fontSize * 3.7;
		achArray[i].labelT.y = achArray[i].spriteB.y - fontSize * 1.2;
	}
}

/**
* Updates achievements positions
*/
var updateAch = function() {
	if (isDown) {
		var len = achArray.length;
		if (len >= Math.ceil(defaultFromTop / achRoom)) {
			var goDown = ((achArray[0].id) == 0 && achArray[0].spriteB.y <= defaultFromTop)?false:true;
			var goUp = ((achArray[len-1].id) == dataArrayAch.length-1 && achArray[len-1].spriteB.y >= achRoom)?false:true;
			for (var i = 0; i < len; i++){
				if (!dataArrayAch.length < Math.ceil(defaultFromTop / achRoom)) {
					if (offset < 0 && goDown) {
						achArray[i].spriteB.y += offset;
						achArray[i].label.y += offset;
						achArray[i].labelT.y += offset;
					} else if (offset > 0 && goUp) {
						achArray[i].spriteB.y += offset;
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
	isDown = false;
	cc.audioEngine.playEffect(res.button);
	cc.director.popScene();
}

//ScoresScene
//Adds a ScoresLayer to itself if the scene has not already been initialized
var AchievementScenes = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED6 == false) {

			INITIALIZED6 = true;

			var layer = new AchievementLayer();
			this.addChild(layer);
		}
	}
});