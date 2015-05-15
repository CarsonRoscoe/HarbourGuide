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
		init(this);	
		return true;
	}
});

var init = function(Layer) {
	var size = cc.winSize;
	offset = 0;
	isDown = false;
	spriteArray = [];
	//Score;Dif;Time
	sortBy = 0;
	//Local;Global
	locGlob = 1;
	labelArray = [];
	dataArray = [];
	
	spriteArray[0] = spriteBack = new cc.Sprite.create(res.UnclickedRect_png);
	spriteBack.setAnchorPoint(cc.p(0.5, 0.5));
	var backSize = ((size.width/10)*2)/spriteBack.width;
	spriteBack.setPosition(cc.p(spriteBack.width * backSize/2,size.height-spriteBack.height));
	spriteBack.runAction(cc.ScaleTo.create(0, backSize, 2));
	
	spriteArray[1] = spriteLocal = new cc.Sprite.create(res.UnclickedRect_png);
	var globalLocalSize = ((size.width/10)*4)/spriteLocal.width;
	spriteLocal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteLocal.setPosition(cc.p((spriteBack.width * backSize) + (spriteLocal.width * globalLocalSize/2),size.height-spriteLocal.height));
	spriteLocal.runAction(cc.ScaleTo.create(0, globalLocalSize, 2));
	
	spriteArray[2] = spriteGlobal = new cc.Sprite.create(res.UnclickedRect_png);
	spriteGlobal.setAnchorPoint(cc.p(0.5, 0.5));
	spriteGlobal.setPosition(cc.p((spriteBack.width * backSize) + (spriteLocal.width * globalLocalSize) + (spriteGlobal.width * globalLocalSize/2),size.height-spriteGlobal.height));
	spriteGlobal.runAction(cc.ScaleTo.create(0, globalLocalSize, 2));
	////////////
	spriteArray[3] = spriteScore = new cc.Sprite.create(res.UnclickedRect_png);
	var sortSizes = (size.width/3)/spriteScore.width;
	spriteScore.setAnchorPoint(cc.p(0.5, 0.5));
	spriteScore.setPosition(cc.p(spriteScore.width * sortSizes/2,size.height-spriteGlobal.height * 2 - spriteScore.height));
	spriteScore.runAction(cc.ScaleTo.create(0, sortSizes, 2));
	
	spriteArray[4] = spriteDifficulty = new cc.Sprite.create(res.UnclickedRect_png);
	spriteDifficulty.setAnchorPoint(cc.p(0.5, 0.5));
	spriteDifficulty.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes/2),size.height-spriteGlobal.height * 2 - spriteDifficulty.height));
	spriteDifficulty.runAction(cc.ScaleTo.create(0, sortSizes, 2));
	
	spriteArray[5] = spriteTime = new cc.Sprite.create(res.UnclickedRect_png);
	spriteTime.setAnchorPoint(cc.p(0.5, 0.5));
	spriteTime.setPosition(cc.p((spriteScore.width * sortSizes) + (spriteDifficulty.width * sortSizes) + (spriteTime.width * sortSizes/2),size.height-spriteGlobal.height * 2 - spriteTime.height));
	spriteTime.runAction(cc.ScaleTo.create(0, sortSizes, 2));
	
	for(var i = 0; i < spriteArray.length; i++)
		Layer.addChild(spriteArray[i], 100);
	
	//initLocalData(Layer);
	initOnlineDataPre();
	var waitTime = 20;
	var waitCounter = 0;
	
	var getDataDelay = setInterval(function() {
			if (dataPackArray != null) {
				initOnlineData(Layer);
				initMouseEvents(Layer);
				clearInterval(getDataDelay);
			} else {
				waitCounter += waitTime;
				if (waitCounter >= 4000) {
					noConnection(Layer);
					clearInterval(getDataDelay);
				}
			}
		}, waitTime);
}

var initOnlineDataPre = function() {
	sendCommand("GETSCORE;", 0);
}

var noConnection = function(Layer) {
	label = new cc.LabelTTF("No Connection", "Helvetica");
	label.setFontSize(60);
	label.setColor(cc.color(200,200,200));
	label.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 100));
	Layer.addChild(label);

}

var initOnlineData = function(Layer) {
	var dataPackArray = getDataPackArray();
	
	if (sortBy == 0)
		dataPackArray.sort(sortByScore);
	if (sortBy == 1)
		dataPackArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataPackArray.sort(sortByTime);
	
	dataArray = [];
	for (var i = 0; i < dataPackArray.length; i++) {
		dataArray[i] = (i+1) + " : " + dataPackArray[i].name + "\t" + dataPackArray[i].score + "\t" + dataPackArray[i].difficulty + "\t" + dataPackArray[i].time;
	}
	initScore(Layer);
}

var initScore = function(Layer) {
	var size = cc.winSize;
	fontSize = 60;
	fontRoom = Math.round(fontSize*(9/8));
	defaultFromTop = size.height - fontSize/2 - (spriteGlobal.height * 2) - (spriteTime.height * 2);
	if (labelArray[0] == null) {
		labelArray = [];	
		var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
		for (var i = 0; i < amount; i++) {
			labelArray[i] = new cc.LabelTTF(dataArray[i], "Helvetica");
			labelArray[i].setFontSize(fontSize);
			labelArray[i].setColor(cc.color(200,200,200));
			labelArray[i].setPosition(cc.p(size.width / 2, defaultFromTop - (i * fontRoom) ));
			Layer.addChild(labelArray[i]);
		}
	} else {
		var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
		for (var i = 0; i < amount; i++) {
			labelArray[i].setString(dataArray[i]);
			labelArray[i].y = defaultFromTop - (i * fontRoom);
		}
	}
	
	var loop = setInterval(function() {
			updateScore();
		}, 34);
}

var initLocalData = function(Layer) {	
	for (var i = 0; i < localStorage.length - 1; i++) {
		var data = loadScore(i);
		dataArray[i] = (i+1) + " : " + data.score + "\t" + data.difficulty + "\t" + data.time;
	}
	if (sortBy == 0)
		dataArray.sort(sortByScore);
	if (sortBy == 1)
		dataArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataArray.sort(sortByTime);
	
	initScore(Layer);
}

var initMouseEvents = function(Layer) {
	cc.eventManager.addListener({
		event: cc.EventListener.MOUSE,
		mouseDown: null,
		relativeY: null,
		clickedY: null,
		selected: null,
		
		onMouseDown: function(event) {
			if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
				isDown = true;
				mouseDown = event.getLocation();
				snapBack = false;
				selected = getButtonClicked(event.getLocation())
			}
		},

		onMouseUp: function(event) {
			if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
				isDown = false;
				offset = 0;
				if (snapBack == true)
					moveToPos();
				
				if (selected != null && selected == getButtonClicked(event.getLocation())) {
					doClicked(getButtonClicked(event.getLocation()), Layer);
				}
				
				selected = null;
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
		scoreSceneBack();
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
	}
}

var scorePressLocal = function(Layer) {
	cleanupData();
	//initLocalData(Layer);
}

var scorePressGlobal = function(Layer) {
	cleanupData();
	initOnlineData(Layer);
}

var scorePressScore = function(Layer) {
	sortBy = 0;
	cleanupData();
	if (locGlob == 0)
		initLocalData(Layer);
	else
		initOnlineData(Layer);
}

var scorePressDifficulty = function(Layer) {
	sortBy = 1;
	cleanupData();
	if (locGlob == 0)
		initLocalData(Layer);
	else
		initOnlineData(Layer);
}

var cleanupData = function(Layer) {
	dataArray = null;
	offset = null;
}

var scorePressTime = function(Layer) {
	sortBy = 2;
	cleanupData();
	if (locGlob == 0)
		initLocalData(Layer);
	else
		initOnlineData(Layer);
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
				if (offset > 0 || goDown)
					labelArray[i].y += offset;
			}
		}
	}
}

//The following function is called when the button in the menu is pressed
//All the functions reset INITIALZIED5 to false, so it can be called by the scene again
var scoreSceneBack = function() {
	alert("XD");
	INITIALIZED5 = false;
	var scene = new MenuScene();
	cc.audioEngine.playEffect(res.button);
	cc.director.runScene(scene);
}

var settingsBack = function() {
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