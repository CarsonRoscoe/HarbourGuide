var saveScore = function(data) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerData(null));
	}
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
	saveData("playerData", buildPlayerString(data));
}

function buildPlayerString(data) {
	return data.difficulty + ";" + data.difficultyUp + ";" + data.difficultyDown;
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

var playerDataObj = function(d, u, down) {
	this.difficulty = d;
	this.difficultyUp = u;
	this.difficultyDown = down;
}

var loadPlayer = function(defDifficulty) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerDataObj(defDifficulty, 5, 5));
	}
	var r = localStorage.getItem("playerData").split(";");
	if (r[0] == null) {
		savePlayerData(new playerDataObj(defDifficulty, 5, 5));
	}
	return new playerDataObj(parseInt(r[0]), parseInt(r[1]), parseInt(r[2]));	
}

function loadScore(index) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerData(null));
	}
	var r = localStorage.getItem(index).split(";");
	return new scoreData(r[0], parseInt(r[1]), parseInt(r[2]), parseInt(r[3]));
}