var folder = "";

if (!cc.sys.isNative) {
	folder = "res/mediumRes/";
}

var res = {
    HelloWorld_png : folder + "HelloWorld.png",
    CloseNormal_png : folder + "CloseNormal.png",
    CloseSelected_png : folder + "CloseSelected.png",
    background_mp3 : "res/sound/mainbg.mp3",
    button : "res/sound/button.mp3",
    GameBackground_mp3 : "res/sound/gamebg.mp3",
	GameBackground_png : folder + "grid_colored.png",
    Button_png : "res/pause.png",
	UnclickedRect_png : folder + "UnclickedRect.png",
	AchievementBack_png : folder + "AchievementBack.png",
    PlayButton_png : folder + "buttons/play_default.png",
    BackButton_png : folder + "buttons/back_default.png",
    ScoreButton_png : folder + "buttons/scores_default.png",
    SettingButton_png : folder + "buttons/settings_default.png",
	MenuBg_png : folder + "main_bg.png",
	MenuLogo_png : folder + "main_logo.png",
	ScoreboardBack_png : folder + "scoreboardbg.png",
	ScoreboardBackButton_png : folder + "buttons/back_button_small.png",
	ScoreIcon_png : folder + "achievements/achievement_score.png",
	TimeIcon_png : folder + "achievements/achievement_time.png",
	SilverIcon_png : folder + "achievements/achievement_silver.png",
	GoldIcon_png : folder + "achievements/achievement_gold.png",
	MiscIcon_png : folder + "achievements/miscIco.png",
	DifIcon_png : folder + "achievements/achievement_difficulty.png",
	BronzeIcon_png : folder + "achievements/achievement_bronze.png",
	PauseBG_png : "res/PauseBG.png",
	AchievementP_png : "buttons/achievement_pressed.png",
	BackP_png : "buttons/back_pressed.png",
	NextDefault_png : "buttons/next_default.png",
	NextP_png : "buttons/next_pressed.png",
	PlayP_png : "buttons/play_pressed.png",
	ScoresP_png : "buttons/scores_pressed.png",
	SettingsP_png : "buttons/settings_pressed.png",
	StartP_png : "buttons/start_pressed.png",
	warning: folder + "warning.png",
	
    unit0: folder + "units/unit_0.png",
	unit1: folder + "units/unit_1.png",
	unit2: folder + "units/unit_2.png",
	unit3: folder + "units/unit_3.png",
	unit4: folder + "units/unit_4.png",
	unit5: folder + "units/unit_5.png",
	unit6: folder + "units/unit_6.png",
	unit7: folder + "units/unit_7.png",
	unit8: folder + "units/unit_8.png",
	
	backgroundGate: folder + "spawnGate.png",
	
    med1x2Shipv1: folder + "ObstacleSmall.png",
    med1x3Shipv1: folder + "ObstacleMedium.png",
    med1x4Shipv1: folder + "ObstacleLarge.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
