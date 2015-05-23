var dataPackOnline = null;

/**
* Called when we need to test sending data
*/
var test = function() {
	var data = new dataPack("niceTRY", 234, 654, 123);
	new sendCommand("DATA", data);
};

/**
* Sends data via JQuery to server and calls encryption methods
*/
var sendCommand = function(command, dP) {
	var key = CryptoJS.enc.Utf8.parse('8080808080808080');
	var iv = CryptoJS.enc.Utf8.parse('8080808080808080');
	var formatted = "";
	switch(command) {
	case "GETSCORE;":
		formatted = command;
		break;
	case "DATA":
		formatted = buildData(dP);
		break;
	default:
		return false;
	break;
	}
	var enc = encryptData(formatted, key, iv);
	$.ajax({
		type:"GET",
		url: "http://52.11.0.80:8080/" + enc,
		crossDomain: true,
		dataType: 'jsonp'
	});
};

/**
* Encrypts data
*/
var encryptData = function(formatted, key, iv) {
	var str = formatted;
	var encryptedString = CryptoJS.AES.encrypt(CryptoJS.enc.Utf8.parse(str), key, {
		keySize: 128/8,
		iv: iv,
		mode: CryptoJS.mode.CBC,
		padding: CryptoJS.pad.Pkcs7
	});
	return encryptedString;
}

/**
* Gets online data from server, returns null if not ready
*/
var getDataPackArray = function() {
	return dataPackOnline;
}

/**
* Gets the score
*/
var getScore = function(json) {
	dataPackOnline = [];
	for(var i = 0; i < json.ScoreboardStats.length; i++) {
		dataPackOnline[i] = new dataPack(json.ScoreboardStats[i].Name, json.ScoreboardStats[i].Score, json.ScoreboardStats[i].Difficulty, json.ScoreboardStats[i].Time);
	}
};

/**
* Sends the status to log
*/
var sendStatus = function(json) {
	cc.log(json.Status);
};

/**
* Builds the data
*/
var buildData = function(dP) {
	cc.log(dP.name + ", " + dP.score + ", " + dP.difficulty + ", " + dP.time);
	return "DATA;" + dP.name + ";" + dP.score + ";" + dP.difficulty + ";" + dP.time;
};

/**
* Datapack data
*/
var dataPack = function(n, s, d, t) {
	this.name = n;
	this.score = s;
	this.difficulty = d;
	this.time = t;
};