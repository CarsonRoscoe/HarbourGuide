var saveScore = function(data) {
	for(var i = 0; i < localStorage.length - 1; i++) {
		if (data.score > loadData(i).score) {
			for (var j = localStorage.length - 1; j > i; j--) {
				saveData(j, buildScoreString(loadData(j - 1)));
			}
			saveData(i, buildScoreString(data));
			return;
		}
	}
	saveData(localStorage.length - 1, buildDataString(data));
}

var savePlayerData = function(data) {
	saveData("playerData", buildScoreString(data));
}

function buildPlayerString(data) {
	return data.difficulty;
}

function buildScoreString(data) {
	return data.name + ";" + data.score + ";" + data.difficulty + ";" + data.time;
}

function saveData(index, data) {
	localStorage.setItem(index, data);
}

var scoreData = function(name, score, difficulty, time) {
	this.name = name;
	this.score = score;
	this.difficulty = difficulty;
	this.time = time;
}

var playerData = function(d) {
	this.difficulty = d;
}

function loadPlayer(defDifficulty) {
	if (localStorage.key("playerData") == null) {
		savePlayerData(new playerData(defDifficulty));
	}
	var r = localStorage.getItem("playerData").split(";");
	return new scoreData(parseInt(r[0]));	
}

function loadScore(index) {
	var r = localStorage.getItem(index).split(";");
	return new scoreData(r[0], parseInt(r[1]), parseInt(r[2]), parseInt(r[3]));
}