/**
 * Saves the score and adjusts the arrays to be in order by highest score for easy
 * loading and whether or not the scores should be registered.
 * @param data = The data object being saved.
 */
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

/**
 * Saves the player data, first converting it to a string.
 * @param data = The data object being saved.
 */
var savePlayerData = function(data) {
	saveData("playerData", buildPlayerString(data));
}

/**
 * Saves the key for achivements, accepts the indexes to save.
 * @param indexes = The index(s) to save to the localStorage.
 */
var saveAchievements = function(indexes) {
	var string = "";
	for (var i = 0; i < indexes.length; i++) {
		string += indexes[i];
		if (i < indexes.length - 1)
			string += ";";
	}
	saveData("achData", string);
}

/**
 * Saves the settings of the game, such as volume and if colorblind mode is on.
 * @param setObj = The settings object to pass in.
 */
var saveSettings = function(setObj) {
	var string = setObj.volume + ";" + setObj.effects;
	localStorage.setItem("settings", string);
}

/**
 * Loads the achivements array from localstorage, parsing the string to break it up into 
 * an array of values, then finally sending an array of ints of achievements.
 * @return indexes = The indexes to return.
 */
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

/**
 * Builds a string based off of a player data object.
 * @param data = The data object to build.
 * @returns {String} = The string converted, to be returned.
 */
function buildPlayerString(data) {
	return data.difficulty + ";" + data.difficultyUp + ";" + data.difficultyDown;
}

/**
 * Builds a string based off of a score data object.
 * @param data = The data object to build.
 * @returns {String} = The string converted, to be returned.
 */
function buildScoreString(data) {
	return data.name + ";" + data.score + ";" + data.difficulty + ";" + data.time;
}

/**
 * Saves a tag and it's data string to local Storage.
 * @param index = The key to save the data to.
 * @param data = The data string to save.
 */
function saveData(index, data) {
	localStorage.setItem(index, data);
}

/**
 * A scoreData object, allows easy parameter passing for new score saving and returning.
 * @param name = the name of the score placer.
 * @param score = The score the player earned.
 * @param difficulty = The difficulty the player was playing at
 * @param time = the time it took the player to finish the game.
 */
var scoreData = function(name, score, difficulty, time) {
	this.name = name;
	this.score = score;
	this.difficulty = difficulty;
	this.time = time;
}

/**
 * A playerDataObjject, allows easy parameter passing for saving and loading difficulty settings.
 * @param d = the difficulty.
 * @param u = The offset to increase the difficulty at.
 * @param down = the offset to decrease the difficulty at.
 */
var playerDataObj = function(d, u, down) {
	this.difficulty = d;
	this.difficultyUp = u;
	this.difficultyDown = down;
}

/**
 * A settings object, allows easy parameter passing of the saved settings.
 * @param v = The saved volume.
 * @param e = The save effect volume.
 */
var SettingsObj = function(v, e) {
	this.volume = v;
	this.effects = e;
}

/**
 * Loads the settings from local Storage.
 * @return = a settings object with the data saved into it.
 */
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

/**
 * Loads the players diffiulty settings from local Storage.
 * @param defDifficulty = The defualt difficulty to save at.
 * @return = a player object with the data saved into it.
 */
var loadPlayer = function(defDifficulty) {
	if (localStorage.getItem("playerData") == null) {
		savePlayerData(new playerDataObj(defDifficulty, 1, 1));
	}
	var r = localStorage.getItem("playerData").split(";");
	if (r[0] == null) {
		savePlayerData(new playerDataObj(defDifficulty, 1, 1));
	}
	return new playerDataObj(parseInt(r[0]), parseInt(r[1]), parseInt(r[2]));	
}

/**
 * loads a single index of a score.
 * @param index = The index of the score to read, easy for "for" loops.
 * @returns {scoreData} = A score data object with the data saved into it.
 */
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