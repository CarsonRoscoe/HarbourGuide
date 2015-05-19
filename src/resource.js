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
    PlayButton_png : folder + "buttons/play_default.png",
    BackButton_png : folder + "buttons/back_default.png",
    ScoreButton_png : folder + "buttons/scores_default.png",
    SettingButton_png : folder + "buttons/settings_default.png",
	MenuBg_png : folder + "main_bg.png",
	MenuLogo_png : folder + "main_logo.png",
	ScoreboardBack_png : folder + "scoreboardbg.png",
	ScoreboardBackButton_png : folder + "buttons/back_button_small.png",
	ScoreIcon_png : folder + "achievements/scoreIco.png",
	TimeIcon_png : folder + "achievements/timeIco.png",
	SilverIcon_png : folder + "achievements/silverIco.png",
	GoldIcon_png : folder + "achievements/goldIcoIco.png",
	MiscIcon_png : folder + "achievements/miscIco.png",
	GoldIcon_png : folder + "achievements/goldIco.png",
	DifIcon_png : folder + "achievements/difIco.png",
	BronzeIcon_png : folder + "achievements/bronzeIco.png",
	
   /* med1x2Shipv1: folder + "1x2_ships/1x2_v1.png",
    med1x2Shipv2: folder + "1x2_ships/1x2_v2.png",
    med1x3Shipv1: folder + "1x3_ships/1x3_v1.png",
    med1x3Shipv2: folder + "1x3_ships/1x3_v2.png",
    med1x4Shipv1: folder + "ObstacleLarge.png",
    med1x4Shipv2: folder + "ObstacleLarge.png",
*/
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

    /*unit1red: folder + "UnitSprite.png",
    unit1green: folder + "UnitSprite.png",
    unit1blue: folder + "UnitSprite.png"*/
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
