var getAllAchievements = function(){
	var temp = [{
		Title : "Top Score",
		Details : "Submit the top score\n",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 5",
		Details : "Submit a top 5 score\n",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 10",
		Details : "Submit a top 10 score\n",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 25",
		Details : "Submit a top 25 score\n",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 50",
		Details : "Submit a top 50 score\n",
		Img : res.ScoreIcon_png
	},{
		Title : "Gold",
		Details : "Place in the top 5%\n",
		Img : res.GoldIcon_png
	},{
		Title : "Silver",
		Details : "Place in the top 10%\n",
		Img : res.SilverIcon_png
	},{
		Title : "Bronze",
		Details : "Place in the top 25%\n",
		Img : res.BronzeIcon_png
	},{
		Title : "Top dog",
		Details : "Submit a top 10 difficulty \nscore",
		Img : res.DifIcon_png
	},{
		Title : "Hot Dog",
		Details : "Submit a top 25 difficulty \nscore",
		Img : res.DifIcon_png
	},{
		Title : "Play Hard",
		Details : "Submit a top 50 difficulty \nscore",
		Img : res.DifIcon_png
	},{
		Title : "Bulldog",
		Details : "I am top five percentage!\n",
		Img : res.DifIcon_png
	},{
		Title : "Hot Husky",
		Details : "We placed in the top 10%\n",
		Img : res.DifIcon_png
	},{
		Title : "Poodle",
		Details : "We placed really really high,\ntop 25% high!",
		Img : res.DifIcon_png
	},{
		Title : "Speed Racer",
		Details : "Finish a 70+ dif. in record\ntime",
		Img : res.TimeIcon_png
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
	newAch.sort(function cmp(a, b) { return a - b;});
	constructAchievement(temp, newAch);
	newAch = newAch.concat(oldAch);
	newAch.sort(function cmp(a, b) { return a - b;});
	saveAchievements(newAch);
	
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
			
			if (i < ind.length) {
				achLayer = new AchLayer();
				achLayer.init(achLayer, ind[i]);
				achLayer.setAnchorPoint(cc.p(0.5,0.3));
				
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
		var tempData = getAllAchievements();
		var newY = 0;
		sprite = new cc.Sprite.create(tempData[i].Img);
		sprite.setAnchorPoint(cc.p(0, 1));
		sprite.setPosition(cc.p(0, newY));
		sprite.setScaleX(cc.winSize.width/sprite.width);
		sprite.setScaleY(cc.winSize.width/sprite.width);
		
		achRoom = sprite.height;
		label = new cc.LabelTTF(tempData[i].Details, "Courier");
		label.setFontSize(30);
		label.setColor(cc.color(0,0,0));
		label.setAnchorPoint(cc.p(0.5, 0));
		label.setPosition(cc.p(sprite.width / 2 + sprite.width / 10, sprite.y - fontSize * 3.7));
		
		labelT = new cc.LabelTTF(tempData[i].Title, "Courier");
		labelT.setFontSize(44);
		labelT.setColor(cc.color(0,0,0));
		labelT.setAnchorPoint(cc.p(0.5, 0.5));
		labelT.setPosition(cc.p(sprite.width / 2 + sprite.width / 10, sprite.y - fontSize * 1.2));
		Layer.addChild(sprite);
		Layer.addChild(label);
		Layer.addChild(labelT);
}
});

