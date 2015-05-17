//Variable to create the scene if it has not yet been initialized
var INITIALIZED5 = false;

//ScoresLayer 
//Contains 1 menu item and is called by the ScoresScene
var ScoresLayer = cc.Layer.extend({
	spriteBack: null,
	spriteLocal: null,
	spriteGlobal: null,
	spriteScore: null,
	spriteDifficulty: null,
	spriteTime: null,
	spriteArray : null,
	labelArray : null,
	offset : null,
	isDown: null,
	fontSize: null,
	defaultFromTop: null,
	fontRoom: null,
	dataArray: null,
	snapBack: null,
	sortBy: null,
	locGlob: null,
	dataPackArray: null,
	spriteBackground: null,
	
	ctor:function() {
		this._super();
		spriteArray = [];
		locGlob = 1;
		sortBy = 0;
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
	
	//size.height-(spriteLocal.height * globalLocalY)/2
	spriteArray[1] = spriteLocal = new cc.Sprite.create(res.UnclickedRect_png);
	var globalLocalSize = ((size.width/10)*4.5)/spriteLocal.width;
	var globalLocalY = (spriteArray[0].height * backSize * 1.2) / spriteLocal.height;
	spriteLocal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteLocal.setPosition(cc.p((spriteBack.width * backSize*1.2) + ((spriteLocal.width * globalLocalSize)/2),spriteArray[0].y));
	spriteLocal.setScaleX(globalLocalSize);
	spriteLocal.setScaleY(((size.height - spriteArray[1].y)/spriteArray[1].height)*2);
	if (locGlob == 0)
		spriteLocal.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label2 = new cc.LabelTTF("Local", "Courier");
	label2.setFontSize(50);
	label2.setColor(cc.color(255,255,255));
	label2.setPosition(cc.p(spriteLocal.x, spriteLocal.y));
	Layer.addChild(label2, 110);
	
	spriteArray[2] = spriteGlobal = new cc.Sprite.create(res.UnclickedRect_png);
	spriteGlobal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteGlobal.setPosition(cc.p((spriteBack.width * backSize*1.2) + (spriteLocal.width * globalLocalSize) + ((spriteGlobal.width * globalLocalSize)/2), spriteArray[0].y));
	spriteGlobal.setScaleX(globalLocalSize);
	spriteGlobal.setScaleY(((size.height - spriteArray[2].y)/spriteArray[2].height)*2);
	var temp = ((size.height - spriteArray[2].y)/spriteArray[2].height)*2;
	
	if (locGlob == 1)
		spriteGlobal.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label3 = new cc.LabelTTF("Global", "Courier");
	label3.setFontSize(50);
	label3.setColor(cc.color(255,255,255));
	label3.setPosition(cc.p(spriteGlobal.x, spriteGlobal.y));
	Layer.addChild(label3, 110);
	
	////////////
	spriteArray[3] = spriteScore = new cc.Sprite.create(res.UnclickedRect_png);
	var sortSizes = (size.width/3)/spriteScore.width;
	spriteScore.setAnchorPoint(cc.p(0.5, 0.5));
	spriteScore.setPosition(cc.p(cc.p((spriteScore.width * sortSizes)/2,size.height-(spriteGlobal.height * temp) - (spriteScore.height * temp / 2))));
	spriteScore.setScaleX(sortSizes);
	spriteScore.setScaleY(temp);
	
	label4 = new cc.LabelTTF("Score", "Courier");
	label4.setFontSize(50);
	label4.setColor(cc.color(255,255,255));
	label4.setPosition(cc.p(spriteScore.x, spriteScore.y));
	Layer.addChild(label4, 110);
	
	if (sortBy == 0)
		spriteScore.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	spriteArray[4] = spriteDifficulty = new cc.Sprite.create(res.UnclickedRect_png);
	spriteDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
	spriteDifficulty.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes/2),size.height-(spriteGlobal.height * temp) - (spriteScore.height * temp / 2)));
	spriteDifficulty.setScaleX(sortSizes);
	spriteDifficulty.setScaleY(temp);
	
	if (sortBy == 1)
		spriteDifficulty.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label5 = new cc.LabelTTF("Diff.", "Courier");
	label5.setFontSize(50);
	label5.setColor(cc.color(255,255,255));
	label5.setPosition(cc.p(spriteDifficulty.x, spriteDifficulty.y));
	Layer.addChild(label5, 110);
	
	spriteArray[5] = spriteTime = new cc.Sprite.create(res.UnclickedRect_png);
	spriteTime.setAnchorPoint(cc.p(0.5, 0.5));
	spriteTime.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes) + (spriteTime.width * sortSizes/2),size.height-(spriteGlobal.height * temp) - (spriteScore.height * temp / 2)));
	spriteTime.setScaleX(sortSizes);
	spriteTime.setScaleY(temp);
	
	if (sortBy == 2)
		spriteTime.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label6 = new cc.LabelTTF("Time", "Courier");
	label6.setFontSize(50);
	label6.setColor(cc.color(255,255,255));
	label6.setPosition(cc.p(spriteTime.x, spriteTime.y));
	Layer.addChild(label6, 110);
	
	for(var i = 0; i < spriteArray.length; i++)
		Layer.addChild(spriteArray[i], 100);
	
	if (locGlob == 1) {
		initOnlineDataPre();
		var waitTime = 20;
		var waitCounter = 0;
		var getDataDelay = setInterval(function() {
				if (dataPackArray != null) {
					initData(Layer);
					initTouchEvents(Layer);
					clearInterval(getDataDelay);
				} else {
					waitCounter += waitTime;
					if (waitCounter >= 10000) {
						noConnection(Layer);
						clearInterval(getDataDelay);
					}
				}
			}, waitTime);
	}
}

var initOnlineDataPre = function() {
	sendCommand("GETSCORE;", 0);
}

var noConnection = function(Layer) {
	label = new cc.LabelTTF("No Connection", "Courier");
	label.setFontSize(60);
	label.setColor(cc.color(0,0,100));
	label.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 100));
	Layer.addChild(label);

}

var getDataPackLocal = function() {
	var dpArray = [];
	
	for (var i = 0; i < localStorage.length - 1; i++) {
			dpArray[i] = loadScore(i);
		}
		
	return dpArray;
}


var initData = function(Layer) {
	
	if (locGlob == 0) {
		dataPackArray = getDataPackLocal();
	}
	
	else if (locGlob == 1) {
		dataPackArray = getDataPackArray();
	}

	if (sortBy == 0)
		dataPackArray.sort(sortByScore);
	if (sortBy == 1)
		dataPackArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataPackArray.sort(sortByTime);
	
	dataArray = [];
	
	for (var i = 0; i < dataPackArray.length; i++) {
		formatString(i);
	}
	
	initScore(Layer);
}

var formatString = function(i) {
	for (var j = dataPackArray[i].name.length; j < 8; j++)
			dataPackArray[i].name += " ";
		
	if (dataPackArray[i].score< 10)
		dataPackArray[i].score = dataPackArray[i].score + "   ";
	else
	if (dataPackArray[i].score < 100)
		dataPackArray[i].score = dataPackArray[i].score + "  ";
	else
	if (dataPackArray[i].score < 1000)
		dataPackArray[i].score = dataPackArray[i].score + " ";
	
	
	if (dataPackArray[i].difficulty < 10)
		dataPackArray[i].difficulty = dataPackArray[i].difficulty + " ";
		
	if (dataPackArray[i].time< 10)
		dataPackArray[i].time = dataPackArray[i].time + "  ";
	else
	if (dataPackArray[i].time < 100)
		dataPackArray[i].time = dataPackArray[i].time + " ";
		
			if (i < 9)
		dataArray[i] = (i+1) + " : " + dataPackArray[i].name + "\t" + dataPackArray[i].score + "\t" + dataPackArray[i].difficulty + "\t" + dataPackArray[i].time;
	else
		dataArray[i] = (i+1) + ": " + dataPackArray[i].name + "\t" + dataPackArray[i].score + "\t" + dataPackArray[i].difficulty + "\t" + dataPackArray[i].time;
}

var reinitData = function(Layer) {
	if (sortBy == 0)
		dataPackArray.sort(sortByScore);
	if (sortBy == 1)
		dataPackArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataPackArray.sort(sortByTime);
	
	dataArray = [];
	
	for (var i = 0; i < dataPackArray.length; i++) {
		if (i < 9)
			dataArray[i] = (i+1) + " : " + dataPackArray[i].name + "\t" + dataPackArray[i].score + "\t" + dataPackArray[i].difficulty + "\t" + dataPackArray[i].time;
		else
			dataArray[i] = (i+1) + ": " + dataPackArray[i].name + "\t" + dataPackArray[i].score + "\t" + dataPackArray[i].difficulty + "\t" + dataPackArray[i].time;
	}
	
	reinitScore(Layer);
}

var initScore = function(Layer) {
	var size = cc.winSize;
	var temp = ((cc.winSize.height - spriteArray[2].y)/spriteArray[2].height)*2;
	var temp2 = size.height-(spriteGlobal.height * temp) - (spriteScore.height * temp);
	fontSize = 46;
	fontRoom = Math.round(fontSize*(9/8));
	defaultFromTop = temp2 - fontSize/2 ;
	labelArray = [];
	var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
	for (var i = 0; i < amount; i++) {
		labelArray[i] = new cc.LabelTTF(dataArray[i], "Courier");
		labelArray[i].setFontSize(fontSize);
		labelArray[i].setColor(cc.color(0,0,100));
		labelArray[i].setAnchorPoint(cc.p(0, 0.5));
		labelArray[i].setPosition(cc.p(cc.winSize.width/20, defaultFromTop - (i * fontRoom) ));
		Layer.addChild(labelArray[i]);
	}

	var loop = setInterval(function() {
			updateScore();
		}, 34);
}

var reinitScore = function(Layer) {
	var amount = dataArray.length;
	cc.log(amount);
	for (var i = 0; i < amount; i++) {
		cc.log(i);
		labelArray[i].setString(dataArray[i]);
		labelArray[i].y = defaultFromTop - (i * fontRoom);
	}
}

var initTouchEvents = function(Layer) {
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
				if (snapBack == true)
					moveToPos();
            }
        }), Layer);
}

var doClicked = function(i, Layer) {
	switch(i) {
		case 0:
		scoreSceneBack(Layer);
		break;
		case 1:
		scorePressLocal(Layer);
		break;
		case 2:
		scorePressGlobal(Layer);
		break;
		case 3:
		scorePressScore(Layer);
		break;
		case 4:
		scorePressDifficulty(Layer);
		break;
		case 5:
		scorePressTime(Layer);
		break;
	}
}

var scorePressLocal = function(Layer) {
	locGlob = 0;
	Layer.removeAllChildren();
	init(Layer);
}

var scorePressGlobal = function(Layer) {
	locGlob = 1;
	Layer.removeAllChildren();
	init(Layer);
}

var scorePressScore = function(Layer) {
	sortBy = 0;
	for(i = 3; i <= 5; i++)
		spriteArray[i].runAction(cc.TintTo.create(0, 255, 255, 255));
	spriteArray[3].runAction(cc.TintTo.create(0, 100, 100, 100));
	reinitData(Layer);
}

var scorePressDifficulty = function(Layer) {
	sortBy = 1;
	for(i = 3; i <= 5; i++)
		spriteArray[i].runAction(cc.TintTo.create(0, 255, 255, 255));
	spriteArray[4].runAction(cc.TintTo.create(0, 100, 100, 100));
	reinitData(Layer);
}

var scorePressTime = function(Layer) {
	sortBy = 2;
	for(i = 3; i <= 5; i++)
		spriteArray[i].runAction(cc.TintTo.create(0, 255, 255, 255));
	spriteArray[5].runAction(cc.TintTo.create(0, 100, 100, 100));
	reinitData(Layer);
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

var moveToPos = function()  {
	var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
	for (var i = 0; i < amount; i++)
		labelArray[i].y = defaultFromTop - (i * fontRoom);
}

var updateScore = function() {
	if (isDown) {
		var len = labelArray.length;
		if (len >= Math.ceil(defaultFromTop / fontRoom)) {
			var goDown = (parseInt((labelArray[0].getString().split(" "))[0]) == 1 && labelArray[len-1].y < - fontRoom)?false:true;
			for (var i = 0; i < len; i++) {
				if (labelArray[i].y > defaultFromTop + fontRoom && offset > 0) {
					var amount = (50 < (dataArray.length))?50:dataArray.length;
					var stringBottom = parseInt((labelArray[len-1].getString().split(" "))[0]);
					if (stringBottom != amount) {
						labelArray[len-1] = (labelArray.splice(i, 1))[0];
						labelArray[len-1].setString(dataArray[(stringBottom)]);
						labelArray[len-1].y = labelArray[len-2].y - fontRoom;
					} else {
						offset = 0;
					}
				} else if (labelArray[i].y < - fontRoom && offset < 0){
					var stringTop = parseInt((labelArray[0].getString().split(" "))[0]);
					if (stringTop != 1) {
						labelArray.unshift((labelArray.splice(i, 1)[0]));
						labelArray[0].setString(dataArray[(stringTop - 2)]);
						labelArray[0].y = labelArray[1].y + fontRoom;
					} else {
						offset = 0;
						snapBack = true;
					}
				}
				
				if (!dataArray.length < Math.ceil(defaultFromTop / fontRoom))
					if (offset > 0 || goDown)
						labelArray[i].y += offset;
			}
		}
	}
}

//The following function is called when the button in the menu is pressed
//All the functions reset INITIALZIED5 to false, so it can be called by the scene again
var scoreSceneBack = function(Layer) {
	INITIALIZED5 = false;
	var scene = new MenuScene();
	cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene);
}

var sortByScore = function(bJSON, aJSON) {
	var result = 0;
	result = aJSON.score - bJSON.score;
	
	if (result == 0)
		result = aJSON.name - bJSON.name;
	
    return result;
}

var sortByDifficulty = function(bJSON, aJSON) {
    var result = 0;
	result = aJSON.difficulty - bJSON.difficulty;
	
	if (result == 0)
		result = aJSON.score - bJSON.score;
	
	if (result == 0)
		result = aJSON.name - bJSON.name;
	
    return result;
}

var sortByTime = function(bJSON, aJSON) {
    var result = 0;
	result = aJSON.time - bJSON.time;
	
	if (result == 0)
		result = aJSON.score - bJSON.score;
	
	if (result == 0)
		result = aJSON.name - bJSON.name;
	
    return result;
}


//ScoresScene
//Adds a ScoresLayer to itself if the scene has not already been initialized
var ScoresScene = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED5 == false) {

			INITIALIZED5 = true;

			var layer = new ScoresLayer();
			this.addChild(layer);
		}
	}
});