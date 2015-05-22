var saveScore = function(data) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerData(null));
	}
	if (localStorage.getItem("achData") == null) {
		saveAchievements([]);
	}
	if (localStorage.getItem("settings") == null) {
		saveSettings(new SettingsObj(100, 100));
	}
	for(var i = 0; i < localStorage.length - 3 && i < 50; i++) {
		if (data.score > loadScore(i).score) {
			for (var j = localStorage.length - 3; j > i; j--) {
				saveData(j, buildScoreString(loadScore(j - 1)));
			}
			saveData(i, buildScoreString(data));
			return;
		}
	}
	if (localStorage.length - 3 < 50)
		saveData(localStorage.length - 3, buildScoreString(data));
}

var savePlayerData = function(data) {
	saveData("playerData", buildPlayerString(data));
}

var saveAchievements = function(indexes) {
	var string = "";
	for (var i = 0; i < indexes.length; i++) {
		string += indexes[i];
		if (i < indexes.length - 1)
			string += ";";
	}
	saveData("achData", string);
}

var saveSettings = function(setObj) {
	var string = setObj.volume + ";" + setObj.effects;
	localStorage.setItem("settings", string);
}

var loadAchievements = function() {
	var indexes = [];
	var data = localStorage.getItem("achData");
	if (data != null) {
		var r = data.split(";");
		for (var i = 0; i < r.length; i++)
			indexes[i] = parseInt(r[i]);
	}
	return indexes;	
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

var SettingsObj = function(v, e) {
	this.volume = v;
	this.effects = e;
}

var loadSettings = function() {
	if (localStorage.getItem("settings") == null) {
		saveSettings(new SettingsObj(100, 100));
	}
	var r = localStorage.getItem("settings").split(";");
	if (r[0] == null) {
		saveSettings(new SettingsObj(100, 100));
	}
	return new SettingsObj(parseInt(r[0]), parseInt(r[1]));	
}

var loadPlayer = function(defDifficulty) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerDataObj(defDifficulty, 1, 1, 1, 1));
	}
	var r = localStorage.getItem("playerData").split(";");
	if (r[0] == null) {
		savePlayerData(new playerDataObj(defDifficulty, 1, 1, 1, 1));
	}
	return new playerDataObj(parseInt(r[0]), parseInt(r[1]), parseInt(r[2]), parseInt(r[3]), parseInt(r[4]));	
}

function loadScore(index) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerData(null));
	}
	if (localStorage.getItem("achData") == null) {
		saveAchievements([]);
	}
	if (localStorage.getItem("settings") == null) {
		saveSettings(new SettingsObj(100, 100));
	}
	cc.log(index);
	var r = localStorage.getItem(index).split(";");
	return new scoreData(r[0], parseInt(r[1]), parseInt(r[2]), parseInt(r[3]));
}