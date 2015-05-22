var getAllAchievements = function(){
	var temp = [{
		//0
		Title : "Top Score",
		Details : "Submit the top score",
		Img : res.ScoreIcon_png
	},{
		//1
		Title : "Top 5",
		Details : "Submit a top 5 score",
		Img : res.ScoreIcon_png
	},{
		//2
		Title : "Top 10",
		Details : "Submit a top 10 score",
		Img : res.ScoreIcon_png
	},{
		//3
		Title : "Top 25",
		Details : "Submit a top 25 score",
		Img : res.ScoreIcon_png
	},{
		//4
		Title : "Top 50",
		Details : "Submit a top 50 score",
		Img : res.ScoreIcon_png
	},{
		//5
		Title : "Gold",
		Details : "Place in the top 5%",
		Img : res.GoldIcon_png
	},{
		//6
		Title : "Silver",
		Details : "Place in the top 10%",
		Img : res.SilverIcon_png
	},{
		//7
		Title : "Bronze",
		Details : "Place in the top 25%",
		Img : res.BronzeIcon_png
	},{
		//8
		Title : "Top dog",
		Details : "Submit a top 10 difficulty score",
		Img : res.DifIcon_png
	},{
		//9
		Title : "Hot Dog",
		Details : "Submit a top 25 difficulty score",
		Img : res.DifIcon_png
	},{
		//10
		Title : "Play Hard",
		Details : "Submit a top 50 difficulty score",
		Img : res.DifIcon_png
	},{
		//11
		Title : "Bulldog",
		Details : "I am top five percentage!",
		Img : res.DifIcon_png
	},{
		//12
		Title : "Hot Husky",
		Details : "We placed in the top 10%",
		Img : res.DifIcon_png
	},{
		//13
		Title : "Poodle",
		Details : "We placed really really high, \ntop 25% high!",
		Img : res.DifIcon_png
	},{
		//14
		Title : "Speed Racer",
		Details : "Finish a 70+ dif. in recordtime",
		Img : res.TimeIcon_png
	},{
		//15
		Title : "Play a Game!",
		Details : "Start your very first game",
		Img : res.MiscIcon_png
	},{
		//16
		Title : "Yikes!",
		Details : "You spun that boat",
		Img : res.MiscIcon_png
	},{
		//17
		Title : "Done!",
		Details : "Completed a level",
		Img : res.MiscIcon_png
	},{
		//18
		Title : "Right On!",
		Details : "Your boat made it",
		Img : res.MiscIcon_png
	}];
	return temp;
}

var getMyAchievements = function(List) {
	var achArray = getAllAchievements();
	var endArray = [];
	var index = 0;
	for (var i = 0; i < achArray.length; i++) {
		if (List.indexOf(i) != -1) {
			endArray[index] = achArray[i];
			index++;
		}
	}
	return endArray;
}

var getAchievements = function(indexes) {
	var temp = setTimeout(function() {
		if (indexes == null || indexes == undefined || indexes == [])
			return;
		
		var newAch = indexes;

		var oldAch = loadAchievements();
			
		if (oldAch == null || oldAch == undefined || oldAch == "NaN")
			oldAch = [];
		
		for(var i = 0; i < newAch.length && newAch.length > 0; i++) {
			if (oldAch.indexOf(newAch[i]) != -1) {
				newAch.splice(i, 1);
				i--;
			}
		}
		
		var temp = cc.director.getRunningScene();
		cc.log(temp);
		newAch.sort(function cmp(a, b) { return a - b;});
		cc.log("Constructing");
		constructAchievement(temp, newAch);
		cc.log("Constructed");
		newAch = newAch.concat(oldAch);
		newAch.sort(function cmp(a, b) { return a - b;});
		saveAchievements(newAch);
	}, 17);
}

var constructAchievement = function(Layer, ind) {
	if (ind.length == 0)
		return;
	var animationLen = 4;
	var height = (new cc.Sprite.create(res.AchievementBack_png)).height * 4;
	var achLayer = new AchLayer();
	var i = 0;
	
	var freeLayer = function(target, Layer){
			if (i != 0) {
				Layer.removeChild(achLayer, true);
			}
			cc.log(ind.length);
			if (i < ind.length) {
				achLayer = new AchLayer();
				achLayer.init(achLayer, ind[i]);
				achLayer.setAnchorPoint(cc.p(0.5,0.3));
				cc.log(i + "Here");
				var growAction = cc.MoveBy.create(animationLen/8, cc.p(0, height));
				var growAction2 = cc.MoveBy.create(animationLen/8*6, cc.p(0, 0));
				var growAction3 = cc.MoveBy.create(animationLen/8, cc.p(0, -height));
				achLayer.runAction(cc.Sequence.create( growAction, growAction2, growAction3, freeLayerFunc));
				Layer.addChild(achLayer);
			}
			i++
		}
		
	var freeLayerFunc = cc.CallFunc.create(freeLayer, this, Layer);
	
	freeLayer(Layer, Layer);	
}

var AchLayer = cc.Layer.extend({
	ctor:function() {
		this._super();
	},

	init:function(Layer, i){
		var fontSize = 46;
		var tempData = getAllAchievements();
		var newY = 0;
		var sprite = new cc.Sprite.create(tempData[i].Img);
		sprite.setAnchorPoint(cc.p(0, 1));
		sprite.setPosition(cc.p(0, newY));
		sprite.setScaleX(cc.winSize.width/sprite.width);
		sprite.setScaleY(cc.winSize.width/sprite.width);
		
		achRoom = sprite.height;
		var label = new cc.LabelTTF(tempData[i].Details, "Courier");
		label.setFontSize(30);
		label.setColor(cc.color(0,0,0));
		label.setAnchorPoint(cc.p(0.5, 0));
		label.setPosition(cc.p(sprite.width / 2 + sprite.width / 10, sprite.y - fontSize * 3.3));
		
		var labelT = new cc.LabelTTF(tempData[i].Title, "Courier");
		labelT.setFontSize(44);
		labelT.setColor(cc.color(0,0,0));
		labelT.setAnchorPoint(cc.p(0.5, 0.5));
		labelT.setPosition(cc.p(sprite.width / 2 + sprite.width / 10, sprite.y - fontSize * 1.1));
		Layer.addChild(sprite);
		Layer.addChild(label);
		Layer.addChild(labelT);
		cc.log((sprite.width / 2 + sprite.width / 10) + " , " + (sprite.y - fontSize * 1.1));
}
});

