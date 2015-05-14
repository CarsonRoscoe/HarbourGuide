var folder = "";

if (!cc.sys.isNative) {
	folder = "res/mediumRes/";
}

var res = {
    HelloWorld_png : folder + "HelloWorld.png",
    CloseNormal_png : folder + "CloseNormal.png",
    CloseSelected_png : folder + "CloseSelected.png",
    UnitSprite_png : folder + "1x1_sprite/1container_red.png",
    ObstacleSmall_png : folder + "1x2_sprite/v1.png",
    ObstacleMedium_png : folder + "1x3_sprite/v1.png",
    ObstacleLarge_png : folder + "1x4_sprite/v1.png"/*,
    background_mp3 : "res/sound/mainbg.mp3",
    button : "res/sound/button.mp3",
    GameBackground_mp3 : "res/sound/gamebg.mp3"*/
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
