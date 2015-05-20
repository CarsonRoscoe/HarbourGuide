var getAllAchievements = function(){
	var temp = [{
		Title : "Top Score",
		Details : "Submit the top score",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 5",
		Details : "Submit a top 5 score",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 10",
		Details : "Submit a top 10 score",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 25",
		Details : "Submit a top 25 score",
		Img : res.ScoreIcon_png
	},{
		Title : "Top 50",
		Details : "Submit a top 50 score",
		Img : res.ScoreIcon_png
	},{
		Title : "Gold",
		Details : "Place in the top 5%",
		Img : res.GoldIcon_png
	},{
		Title : "Silver",
		Details : "Place in the top 10%",
		Img : res.SilverIcon_png
	},{
		Title : "Bronze",
		Details : "Place in the top 25%",
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
		Details : "I am top five percentage!",
		Img : res.DifIcon_png
	},{
		Title : "Hot Husky",
		Details : "We placed in the top 10%",
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
		var spriteB = new cc.Sprite.create(res.AchievementBack_png);
		spriteB.setAnchorPoint(cc.p(0, 1));
		spriteB.setPosition(cc.p(0, newY));
		spriteB.setScaleX(cc.winSize.width/spriteB.width);
		spriteB.setScaleY(4);

		var spriteI = new cc.Sprite.create(tempData[i].Img);
		spriteI.setAnchorPoint(cc.p(0, .5));
		spriteI.setPosition(cc.p(spriteI.width/3, spriteB.y - spriteB.height*2));
		spriteI.setScaleX(2);
		spriteI.setScaleY(2);

		achRoom = spriteB.height * 4;
		var label = new cc.LabelTTF(tempData[i].Details, "Courier");
		label.setFontSize(30);
		label.setColor(cc.color(0,0,0));
		label.setAnchorPoint(cc.p(0, 0.5));
		label.setPosition(cc.p(spriteI.width * 2 + spriteI.x + 10, newY - (spriteB.height*2.4)));

		var labelT = new cc.LabelTTF(tempData[i].Title, "Courier");
		labelT.setFontSize(50);
		labelT.setColor(cc.color(0,0,0));
		labelT.setAnchorPoint(cc.p(0, 0.5));
		labelT.setPosition(cc.p(cc.winSize.width/2 + spriteI.x, newY - (spriteB.height * 1.2)));
		Layer.addChild(spriteB);
		Layer.addChild(label);
		Layer.addChild(spriteI);
		Layer.addChild(labelT);
}
});

