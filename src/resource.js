var folder = "";

if (!cc.sys.isNative) {
	folder = "res/mediumRes/";
}

var res = {
    HelloWorld_png : folder + "HelloWorld.png",
    CloseNormal_png : folder + "CloseNormal.png",
    CloseSelected_png : folder + "CloseSelected.png",
    UnitSprite_png : folder + "UnitSprite.png",
    ObstacleSmall_png : folder + "ObstacleSmall.png",
    ObstacleMedium_png : folder + "ObstacleMedium.png",
    ObstacleLarge_png : folder + "ObstacleLarge.png",
    background_mp3 : "res/sound/mainbg.mp3",
    button : "res/sound/button.mp3",
    GameBackground_mp3 : "res/sound/gamebg.mp3",
    Button_png : "res/pause.png",
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
