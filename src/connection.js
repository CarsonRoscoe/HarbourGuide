
var test = function() {
	var data = new dataPack("niceTRY", 234, 654, 123);
	alert(new sendCommand("GETSCORE", data)[0].Name);
};

var sendCommand = function(command, dP) {
	var formatted = "";
	switch(command) {
	case "GETSCORE":
		formatted = command + ";";
		break;
	case "DATA":
		formatted = buildData(dP);
		break;
	default:
		return false;
	break;
	}
	$.ajax({
		type:"GET",
		url: "http://52.11.0.80:8080/" + formatted,
		crossDomain: true,
		dataType: 'jsonp'
	});
};

function getScore(json) {
	var dataPackArray = [];
	for(var i = 0; i < json.ScoreboardStats.length; i++) {
		dataPackArray[i] = new dataPack(json.ScoreboardStats[i].Name, json.ScoreboardStats[i].Score, json.ScoreboardStats[i].Difficulty, json.ScoreboardStats[i].Time);
	}
	return dataPackArray;
};

var sendStatus = function(json) {
	alert(json.Status);
};

var buildData = function(dP) {
	return "DATA;" + dP.name + ";" + dP.score + ";" + dP.difficulty + ";" + dP.time + ";";
};

var dataPack = function(n, s, d, t) {
	this.name = n;
	this.score = s;
	this.difficulty = d;
	this.time = t;
};