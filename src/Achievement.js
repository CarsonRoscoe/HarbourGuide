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