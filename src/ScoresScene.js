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
	
	ctor:function() {
		this._super();
		spriteArray = [];
		locGlob = 1;
		sortBy = 0;
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
	spriteArray[0] = spriteBack = new cc.Sprite.create(res.UnclickedRect_png);
	spriteBack.setAnchorPoint(cc.p(0.5, 0.5));
	var backSize = ((size.width/10)*2)/spriteBack.width;
	spriteBack.setPosition(cc.p(spriteBack.width * backSize/2,size.height-spriteBack.height));
	spriteBack.setScaleX(backSize);
	spriteBack.setScaleY(2);
	
	label1 = new cc.LabelTTF("Back", "Courier");
	label1.setFontSize(50);
	label1.setColor(cc.color(0,0,0));
	label1.setPosition(cc.p(spriteBack.x, spriteBack.y));
	Layer.addChild(label1, 110);
	
	spriteArray[1] = spriteLocal = new cc.Sprite.create(res.UnclickedRect_png);
	var globalLocalSize = ((size.width/10)*4)/spriteLocal.width;
	spriteLocal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteLocal.setPosition(cc.p((spriteBack.width * backSize) + (spriteLocal.width * globalLocalSize/2),size.height-spriteLocal.height));
	spriteLocal.setScaleX(globalLocalSize);
	spriteLocal.setScaleY(2);
	if (locGlob == 0)
		spriteLocal.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label2 = new cc.LabelTTF("Local", "Courier");
	label2.setFontSize(50);
	label2.setColor(cc.color(0,0,0));
	label2.setPosition(cc.p(spriteLocal.x, spriteLocal.y));
	Layer.addChild(label2, 110);
	
	spriteArray[2] = spriteGlobal = new cc.Sprite.create(res.UnclickedRect_png);
	spriteGlobal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteGlobal.setPosition(cc.p((spriteBack.width * backSize) + (spriteLocal.width * globalLocalSize) + (spriteGlobal.width * globalLocalSize/2),size.height-spriteGlobal.height));
	spriteGlobal.setScaleX(globalLocalSize);
	spriteGlobal.setScaleY(2);
	
	if (locGlob == 1)
		spriteGlobal.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label3 = new cc.LabelTTF("Global", "Courier");
	label3.setFontSize(50);
	label3.setColor(cc.color(0,0,0));
	label3.setPosition(cc.p(spriteGlobal.x, spriteGlobal.y));
	Layer.addChild(label3, 110);
	
	////////////
	spriteArray[3] = spriteScore = new cc.Sprite.create(res.UnclickedRect_png);
	var sortSizes = (size.width/3)/spriteScore.width;
	spriteScore.setAnchorPoint(cc.p(0.5, 0.5));
	spriteScore.setPosition(cc.p(spriteScore.width * sortSizes/2,size.height-spriteGlobal.height * 2 - spriteScore.height));
	spriteScore.setScaleX(sortSizes);
	spriteScore.setScaleY(2);
	
	if (sortBy == 0)
		spriteScore.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label4 = new cc.LabelTTF("Score", "Courier");
	label4.setFontSize(50);
	label4.setColor(cc.color(0,0,0));
	label4.setPosition(cc.p(spriteScore.x, spriteScore.y));
	Layer.addChild(label4, 110);
	
	spriteArray[4] = spriteDifficulty = new cc.Sprite.create(res.UnclickedRect_png);
	spriteDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
	spriteDifficulty.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes/2),size.height-spriteGlobal.height * 2 - spriteDifficulty.height));
	spriteDifficulty.setScaleX(sortSizes);
	spriteDifficulty.setScaleY(2);
	
	if (sortBy == 1)
		spriteDifficulty.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label5 = new cc.LabelTTF("Diff.", "Courier");
	label5.setFontSize(50);
	label5.setColor(cc.color(0,0,0));
	label5.setPosition(cc.p(spriteDifficulty.x, spriteDifficulty.y));
	Layer.addChild(label5, 110);
	
	spriteArray[5] = spriteTime = new cc.Sprite.create(res.UnclickedRect_png);
	spriteTime.setAnchorPoint(cc.p(0.5, 0.5));
	spriteTime.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes) + (spriteTime.width * sortSizes/2),size.height-spriteGlobal.height * 2 - spriteTime.height));
	spriteTime.setScaleX(sortSizes);
	spriteTime.setScaleY(2);
	
	if (sortBy == 2)
		spriteTime.runAction(cc.TintTo.create(0, 100, 100, 100));
	
	label6 = new cc.LabelTTF("Time", "Courier");
	label6.setFontSize(50);
	label6.setColor(cc.color(0,0,0));
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
					initMouseEvents(Layer);
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
	label.setColor(cc.color(200,200,200));
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
	var dataPackArray;
	
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
		
		for (var j = dataPackArray[i].name.length; j < 8; j++)
			dataPackArray[i].name += " ";
		
		if (dataPackArray[i].score< 10)
			dataPackArray[i].score = dataPackArray[i].score + "  ";
		else
		if (dataPackArray[i].score < 100)
			dataPackArray[i].score = dataPackArray[i].score + " ";
		
		if (dataPackArray[i].difficulty < 10)
			dataPackArray[i].difficulty = dataPackArray[i].difficulty + "  ";
		
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
	
	initScore(Layer);
}

var initScore = function(Layer) {
	var size = cc.winSize;
	fontSize = 50;
	fontRoom = Math.round(fontSize*(9/8));
	defaultFromTop = size.height - fontSize/2 - (spriteGlobal.height * 2) - (spriteTime.height * 2);
	labelArray = [];
	var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
	for (var i = 0; i < amount; i++) {
		labelArray[i] = new cc.LabelTTF(dataArray[i], "Courier");
		labelArray[i].setFontSize(fontSize);
		labelArray[i].setColor(cc.color(200,200,200));
		labelArray[i].setAnchorPoint(cc.p(0, 0.5));
		labelArray[i].setPosition(cc.p(0, defaultFromTop - (i * fontRoom) ));
		Layer.addChild(labelArray[i]);
	}

	var loop = setInterval(function() {
			updateScore();
		}, 34);
}

var initMouseEvents = function(Layer) {
	cc.eventManager.addListener({
		event: cc.EventListener.MOUSE,
		mouseDown: null,
		relativeY: null,
		clickedY: null,
		
		onMouseDown: function(event) {
			if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
				isDown = true;
				mouseDown = event.getLocation();
				snapBack = false;
				doClicked(getButtonClicked(event.getLocation()), Layer);
			}
		},

		onMouseUp: function(event) {
			if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
				isDown = false;
				offset = 0;
				if (snapBack == true)
					moveToPos();
			}
		},

		onMouseMove: function(event) {
			if(isDown) {
				var cury = event.getLocation().y;
				var dis = cury - mouseDown.y;
				offset = (Math.abs(dis / 8) < 16)?dis/8:((dis > 0)?16:-16);
			}
		}
	}, Layer);
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
	Layer.removeAllChildren();
	init(Layer);
}

var scorePressDifficulty = function(Layer) {
	sortBy = 1;
	Layer.removeAllChildren();
	init(Layer);
}

var scorePressTime = function(Layer) {
	sortBy = 2;
	Layer.removeAllChildren();
	init(Layer);
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