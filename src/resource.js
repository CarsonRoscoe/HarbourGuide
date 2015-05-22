//folder path
var folder = "";
/**
 * Sets up the folder to look for if its not native useage (not mobile).
 */
if (!cc.sys.isNative) {
	folder = "res/mediumRes/";
}

/**
 * Large object that holds the path of all resource paths for loading reference
 * from all the other files for sprites and fonts.
 */
var res = {
    HelloWorld_png : folder + "HelloWorld.png",
    CloseNormal_png : folder + "CloseNormal.png",
    CloseSelected_png : folder + "CloseSelected.png",
    background_mp3 : "res/sound/mainbg.mp3",
    button : "res/sound/button.mp3",
    GameBackground_mp3 : "res/sound/gamebg.mp3",
    GameBackground_png : folder + "grid_colored.png",
    pauseButtonDown : folder + "buttons/pause_default_brown.png",
    pauseButtonUp : folder + "buttons/pause_pressed_brown.png",
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
	ScoreboardBackButtonP_png : folder + "buttons/back_button_small_pressed.png",
	ScoreIcon_png : folder + "achievements/achievement_score.png",
	TimeIcon_png : folder + "achievements/achievement_time.png",
	SilverIcon_png : folder + "achievements/achievement_silver.png",
	GoldIcon_png : folder + "achievements/achievement_gold.png",
	DifIcon_png : folder + "achievements/achievement_difficulty.png",
	BronzeIcon_png : folder + "achievements/achievement_bronze.png",
	MiscIcon_png : folder + "achievements/achievement_misc.png",
	PauseBG_png : "res/PauseBG.png",
	AchievementButton_png : folder + "buttons/achievement_button.png",
	AchievementLabel_png : folder + "buttons/achievement_label.png",
	AchievementButtonP_png : folder + "buttons/achievement_pressed.png",
	BackP_png : folder + "buttons/back_pressed.png",
	NextDefault_png : folder + "buttons/next_default.png",
	NextP_png : folder + "buttons/next_pressed.png",
	PlayButtonP_png : folder + "buttons/play_pressed.png",
	ScoreButtonP_png : folder + "buttons/scores_pressed.png",
	SettingButtonP_png : folder + "buttons/settings_pressed.png",
	StartButtonP_png : folder + "buttons/start_pressed.png",
	StartButton_png : folder + "buttons/start_default.png",
	Pregame_png : folder + "pregame.png",
	Postgame_png : folder + "postgame.png",
	SettingsSmall_png : folder + "buttons/settings_button_small.png",
	SettingsSmallP_png : folder + "buttons/settings_button_small_pressed.png",
	SortDifficultyP_png : folder + "buttons/difficulty_label_pressed.png",
	GlobalP_png : folder + "buttons/global_label_pressed.png",
	LocalP_png : folder + "buttons/local_label_pressed.png",
	SortScoreP_png : folder + "buttons/score_label_pressed.png",
	SortTimeP_png : folder + "buttons/time_label_pressed.png",
	SortDifficulty_png : folder + "buttons/difficulty_label.png",
	Global_png : folder + "buttons/global_label.png",
	Local_png : folder + "buttons/local_label.png",
	SortScore_png : folder + "buttons/score_label.png",
	SortTime_png : folder + "buttons/time_label.png",
	AmigaForever_ttf : "res/AmigaForever.ttf",
	warning: folder + "warning.png",
	Porkys_ttf : "res/Porkys_.ttf",
	WoodBackHUD: folder + "HudBack.png",
	TextHolderHUD: folder + "labelHolder.png",
	CurrentScoreIconHUD: folder + "cur_score.png",
	CueIconHUD: folder + "more_boats_logo.png",
	SFSlapstick_ttf : "res/SF Slapstick Comic.ttf",
	Cousin_ttf : "res/Cousine-Regular.ttf",
	ScoreHeader_png : folder + "score_header.png",
	UbuntuMono_ttf : "res/UbuntuMono-R.ttf",
	PauseBg_png : folder + "pause_bg.png",
	
	
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

/**
 * Pulling the paths and populating the data to be recognized by cocos.
 */
var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
