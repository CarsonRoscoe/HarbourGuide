var dataPackOnline = null;

var test = function() {
	var data = new dataPack("niceTRY", 234, 654, 123);
	new sendCommand("DATA", data);
};

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

var getDataPackArray = function() {
	return dataPackOnline;
}

var getScore = function(json) {
	dataPackOnline = [];
	for(var i = 0; i < json.ScoreboardStats.length; i++) {
		dataPackOnline[i] = new dataPack(json.ScoreboardStats[i].Name, json.ScoreboardStats[i].Score, json.ScoreboardStats[i].Difficulty, json.ScoreboardStats[i].Time);
	}
};

var sendStatus = function(json) {
	cc.log(json.Status);
};

var buildData = function(dP) {
	cc.log(dP.name + ", " + dP.score + ", " + dP.difficulty + ", " + dP.time);
	return "DATA;" + dP.name + ";" + dP.score + ";" + dP.difficulty + ";" + dP.time;
};

var dataPack = function(n, s, d, t) {
	this.name = n;
	this.score = s;
	this.difficulty = d;
	this.time = t;
};