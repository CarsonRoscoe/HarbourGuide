//Variable to create the scene if it has not yet been initialized
var INITIALIZED5 = false;
var backScorePushed = false;

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
	dataPackArray: null,
	spriteHeader: null,
	
	ctor:function() {
		this._super();
		backScorePushed = false;
		spriteArray = [];
		locGlob = 0;
		sortBy = 0;
		initScores(this);	
		return true;
	}
});

var initScores = function(Layer) {
	var size = cc.winSize;
	offset = 0;
	isDown = false;
	//Score;Dif;Time
	//Local;Global
	dataArray = [];
	
	//Draws background
	spriteBackground = new cc.Sprite.create(res.MenuBg_png);
	spriteBackground.setAnchorPoint(cc.p(0.5, 0.5));
	spriteBackground.setPosition(cc.p(cc.winSize.width/2, cc.winSize.height/2));
	spriteBackground.setScaleX(cc.winSize.width/spriteBackground.width);
	spriteBackground.setScaleY(cc.winSize.height/spriteBackground.height);
	Layer.addChild(spriteBackground, -200);
	
	//Draws back button
	spriteArray[0] = spriteBack = new cc.Sprite.create(res.ScoreboardBackButton_png);
	spriteBack.setAnchorPoint(cc.p(0, 1));
	spriteBack.setPosition(cc.p(0,size.height));
	
	//Draws local button
	spriteArray[1] = spriteLocal = new cc.Sprite.create(res.LocalP_png);
	spriteLocal.setAnchorPoint(cc.p(0, 1));
	spriteLocal.setPosition(cc.p(spriteArray[0].width, size.height));
	
	//Draws global button
	spriteArray[2] = spriteGlobal = new cc.Sprite.create(res.Global_png);
	spriteGlobal.setAnchorPoint(cc.p(0, 1));
	spriteGlobal.setPosition(cc.p(spriteArray[0].width + spriteArray[1].width, size.height));
	
	var secondRowX = size.height - spriteArray[0].height;
	
	//Draws score button
	spriteArray[3] = spriteScore = new cc.Sprite.create(res.SortScoreP_png);
	spriteScore.setAnchorPoint(cc.p(0, 1));
	spriteScore.setPosition(cc.p(0, secondRowX));
	
	//Draws difficulty button
	spriteArray[4] = spriteDifficulty = new cc.Sprite.create(res.SortDifficulty_png);
	spriteDifficulty.setAnchorPoint(cc.p(0, 1));
	spriteDifficulty.setPosition(cc.p(spriteArray[3].width, secondRowX));
	
	//Draws time button
	spriteArray[5] = spriteTime = new cc.Sprite.create(res.SortTime_png);
	spriteTime.setAnchorPoint(cc.p(0, 1));
	spriteTime.setPosition(cc.p(spriteArray[3].width + spriteArray[4].width, secondRowX));
	
	spriteHeader = new cc.Sprite.create(res.ScoreHeader_png);
	spriteHeader.setAnchorPoint(cc.p(0.5, 1));
	spriteHeader.setPosition(cc.p(cc.winSize.width/2, secondRowX - spriteArray[5].height));
	spriteHeader.setScaleX(cc.winSize.width/spriteHeader.width);
	
	Layer.addChild(spriteHeader, 100);
	//Adds all button sprites to the draw layer
	for(var i = 0; i < spriteArray.length; i++)
		Layer.addChild(spriteArray[i], 100);
	
	//Prepares the online high score and initiates data to be drawn.
	initOnlineDataPre();
	var waitTime = 20;
	var waitCounter = 0;
	initDataScores(Layer);
	initTouchEvents(Layer);
	var getDataDelay = setInterval(function() {
			if (dataPackOnline != null) {
				clearInterval(getDataDelay);
			} else {
				waitCounter += waitTime;
				if (waitCounter >= 60000) {
					clearInterval(getDataDelay);
				}
			}
		}, waitTime);
}

var getDataPackGlobal = function() {
	if (dataPackOnline != null)
		return getDataPackArray();
	else
		return null;
}

var initOnlineDataPre = function() {
	sendCommand("GETSCORE;", 0);
}

var noConnection = function(Layer) {
	label = new cc.LabelTTF("No Connection", "SF Slapstick Comic");
	label.setFontSize(60);
	label.setColor(cc.color(0,0,100));
	label.setPosition(cc.p(cc.winSize.width / 2, cc.winSize.height / 2 - 100));
	Layer.addChild(label);

}

var getDataPackLocal = function() {
	var dpArray = [];
	
	for (var i = 0; i < localStorage.length - 2; i++) {
			dpArray[i] = loadScore(i);
		}
		
	return dpArray;
}


var initDataScores = function(Layer) {
	if (locGlob == 0) {
		dataPackArray = getDataPackLocal();
	} else if (locGlob == 1) {
		dataPackArray = getDataPackGlobal();
	}
	
	if (dataPackArray == null)
		return;

	if (sortBy == 0)
		dataPackArray.sort(sortByScore);
	if (sortBy == 1)
		dataPackArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataPackArray.sort(sortByTime);
	
	dataArray = [];
	
	for (var i = 0; i < dataPackArray.length; i++) {
		formatStringScore(i);
	}
	
	initScore(Layer);
}

var formatStringScore = function(i) {
	for (var j = dataPackArray[i].name.length; j < 8; j++)
			dataPackArray[i].name += "  ";
		
	if (dataPackArray[i].score< 10)
		dataPackArray[i].score = dataPackArray[i].score + "        ";
	else
	if (dataPackArray[i].score < 100)
		dataPackArray[i].score = dataPackArray[i].score + "      ";
	else
	if (dataPackArray[i].score < 1000)
		dataPackArray[i].score = dataPackArray[i].score + "    ";
	else
	if (dataPackArray[i].score < 10000)
		dataPackArray[i].score = dataPackArray[i].score + "  ";
	
	if (dataPackArray[i].difficulty < 10)
		dataPackArray[i].difficulty = dataPackArray[i].difficulty + "  ";
	if (dataPackArray[i].difficulty < 100)
		dataPackArray[i].difficulty = dataPackArray[i].difficulty + "";
	
	var minutes = Math.floor(dataPackArray[i].time/60);
	var seconds = (dataPackArray[i].time - minutes*60);
	var concat = "";	
		
	if (dataPackArray[i].time< 10)
		concat = minutes + ":" + seconds + "  ";
	else
	if (dataPackArray[i].time < 100)
		concat = minutes + ":" + seconds + " ";
	else
		concat = minutes + ":" + seconds + "";
		
			if (i < 9)
		dataArray[i] = (i+1) + "  : " + dataPackArray[i].name + "       " + dataPackArray[i].score + "      " + dataPackArray[i].difficulty + "    " + concat;
	else
		dataArray[i] = (i+1) + ": " + dataPackArray[i].name + "       " + dataPackArray[i].score + "      " + dataPackArray[i].difficulty + "    " + concat;
}

var reinitDataScores = function(Layer) {
	if (sortBy == 0)
		dataPackArray.sort(sortByScore);
	if (sortBy == 1)
		dataPackArray.sort(sortByDifficulty);
	if (sortBy == 2)
		dataPackArray.sort(sortByTime);
	
	dataArray = [];
	for (var i = 0; i < dataPackArray.length; i++) {
		var minutes = Math.floor(dataPackArray[i].time/60);
		var seconds = (dataPackArray[i].time - minutes*60);
		var concat = "";	
			
		if (dataPackArray[i].time< 10)
			concat = minutes + ":" + seconds + "  ";
		else
		if (dataPackArray[i].time < 100)
			concat = minutes + ":" + seconds + " ";
		else
			concat = minutes + ":" + seconds + "";
			
				if (i < 9)
			dataArray[i] = (i+1) + "  : " + dataPackArray[i].name + "       " + dataPackArray[i].score + "      " + dataPackArray[i].difficulty + "    " + concat;
		else
			dataArray[i] = (i+1) + ": " + dataPackArray[i].name + "       " + dataPackArray[i].score + "      " + dataPackArray[i].difficulty + "    " + concat;
		}
	reinitScore(Layer);
}

var initScore = function(Layer) {
	var size = cc.winSize;
	fontSize = 46;
	fontRoom = Math.round(fontSize*(9/8));
	defaultFromTop = size.height- spriteGlobal.height - spriteScore.height - spriteHeader.height;
	labelArray = [];
	var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
	for (var i = 0; i < amount; i++) {
		labelArray[i] = new cc.LabelTTF(dataArray[i], "Cousine");
		labelArray[i].setFontSize(fontSize);
		labelArray[i].setColor(cc.color(0,0,100));
		labelArray[i].setAnchorPoint(cc.p(0, 0.5));
		labelArray[i].setPosition(cc.p(10, defaultFromTop - (i * fontRoom) ));
		Layer.addChild(labelArray[i]);
	}

	var loop = setInterval(function() {
			updateScore();
		}, 34);
}

var reinitScore = function(Layer) {
	var amount = (((defaultFromTop) / fontSize - 1) < (dataArray.length))?((defaultFromTop) / fontSize - 1):dataArray.length;
	for (var i = 0; i < amount; i++) {
		labelArray[i].setString(dataArray[i]);
		labelArray[i].y = defaultFromTop - (i * fontRoom);
	}
}

var myClickContainsPoint = function(clickPoint, index) {
	var clickX = clickPoint.x;
	var clickY = clickPoint.y;
	var left = spriteArray[index].x;
	var right = spriteArray[index].x + spriteArray[index].width;
	var top = spriteArray[index].y;
	var bottom = spriteArray[index].y - spriteArray[index].height;
	
	if (clickX >= left &&
		clickX <= right &&
		clickY <= top &&
		clickY >= bottom) {
		return true;
	}
	return false;
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
				var rect = 0;
				
				cc.log(touchDown.x + ", " + touchDown.y);
				for (var i = 0; i < spriteArray.length; i++) {
					if (myClickContainsPoint(touchDown, i))
						selectButtonScore(i, Layer);
				}
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
				
				if (backScorePushed == true)
					scoreSceneBack(Layer);
            }
        }), Layer);
}

//Called when you select a button in the scoreboard scene, but have yet to click it. Used to highlight sprites selected.
var selectButtonScore = function(i, Layer) {
	var size = cc.winSize;
	
	if (i == 0) {
		Layer.removeChild(spriteBack);
		
		//Draw back button clicked
		spriteBack = new cc.Sprite.create(res.ScoreboardBackButtonP_png);
		spriteBack.setAnchorPoint(cc.p(0, 1));
		spriteBack.setPosition(cc.p(0,size.height));
		
		Layer.addChild(spriteBack, 100);
	} else if (i == 1 || i == 2) {
		Layer.removeChild(spriteLocal);
		Layer.removeChild(spriteGlobal);
			
		//Draws local button clicked
		spriteArray[1] = spriteLocal = new cc.Sprite.create((i == 1)?res.LocalP_png:res.Local_png);
		spriteLocal.setAnchorPoint(cc.p(0, 1));
		spriteLocal.setPosition(cc.p(spriteArray[0].width, size.height));
		
		//Draws global button clicked
		spriteArray[2] = spriteGlobal = new cc.Sprite.create((i == 2)?res.GlobalP_png:res.Global_png);
		spriteGlobal.setAnchorPoint(cc.p(0, 1));
		spriteGlobal.setPosition(cc.p(spriteArray[0].width + spriteArray[1].width, size.height));
		
		Layer.addChild(spriteLocal, 100);
		Layer.addChild(spriteGlobal, 100);
		
	} else if (i == 3 || i == 4 || i == 5) {
		var secondRowX = size.height - spriteArray[0].height;
		Layer.removeChild(spriteScore);
		Layer.removeChild(spriteDifficulty);
		Layer.removeChild(spriteTime);
		//Draws score button
		spriteArray[3] = spriteScore = new cc.Sprite.create((i == 3)?res.SortScoreP_png:res.SortScore_png);
		spriteScore.setAnchorPoint(cc.p(0, 1));
		spriteScore.setPosition(cc.p(0, secondRowX));
		
		//Draws difficulty button
		spriteArray[4] = spriteDifficulty = new cc.Sprite.create((i == 4)?res.SortDifficultyP_png:res.SortDifficulty_png);
		spriteDifficulty.setAnchorPoint(cc.p(0, 1));
		spriteDifficulty.setPosition(cc.p(spriteArray[3].width, secondRowX));
		
		//Draws time button
		spriteArray[5] = spriteTime = new cc.Sprite.create((i == 5)?res.SortTimeP_png:res.SortTime_png);
		spriteTime.setAnchorPoint(cc.p(0, 1));
		spriteTime.setPosition(cc.p(spriteArray[3].width + spriteArray[4].width, secondRowX));
		
		Layer.addChild(spriteScore, 100);
		Layer.addChild(spriteDifficulty, 100);
		Layer.addChild(spriteTime, 100);
	}
	
	doClickedScore(i, Layer);
}

var doClickedScore = function(i, Layer) {
	switch(i) {
		case 0:
		backScorePushed = true;
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
	
	for (var i = 0; i < dataArray.length; i++) {
		Layer.removeChild(dataArray[i], true);
		Layer.removeChild(labelArray[i], true);
	}
	
	initDataScores(Layer);
}

var scorePressGlobal = function(Layer) {
	locGlob = 1;
	
	for (var i = 0; i < dataArray.length; i++) {
		Layer.removeChild(dataArray[i], true);
		Layer.removeChild(labelArray[i], true);
	}

	initDataScores(Layer);
}

var scorePressScore = function(Layer) {
	sortBy = 0;
	reinitDataScores(Layer);
}

var scorePressDifficulty = function(Layer) {
	sortBy = 1;
	reinitDataScores(Layer);
}

var scorePressTime = function(Layer) {
	sortBy = 2;
	reinitDataScores(Layer);
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
	cc.audioEngine.playEffect(res.button);
	cc.director.popScene();
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
	result = bJSON.time - aJSON.time;
	
	if (result == 0)
		result = aJSON.score - bJSON.score;
	
	if (result == 0)
		result = aJSON.name - bJSON.name;
	
    return result;
}


//ScoresScene
//Adds a ScoresLayer to itself if the scene has not already been initialized
var ScoresScenes = cc.Scene.extend({
	onEnter:function() {
		this._super();

		if(INITIALIZED5 == false) {

			INITIALIZED5 = true;
			var layer = new ScoresLayer();
			this.addChild(layer);
		}
	}
});