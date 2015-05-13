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
    Button_png : "res/pause.png",

   /* med1x2Shipv1: folder + "1x2_ships/1x2_v1.png",
    med1x2Shipv2: folder + "1x2_ships/1x2_v2.png",
    med1x3Shipv1: folder + "1x3_ships/1x3_v1.png",
    med1x3Shipv2: folder + "1x3_ships/1x3_v2.png",
    med1x4Shipv1: folder + "ObstacleLarge.png",
    med1x4Shipv2: folder + "ObstacleLarge.png",

    unit1red: folder + "unit1/1x1_1_container_red.png",
    unit1green: folder + "unit1/1x1_1_container_green.png",
    unit1blue: folder + "unit1/1x1_1_container_blue.png"*/
    
    med1x2Shipv1: folder + "ObstacleSmall.png",
    med1x3Shipv1: folder + "ObstacleMedium.png",
    med1x4Shipv1: folder + "ObstacleLarge.png",

    unit1red: folder + "UnitSprite.png",
    unit1green: folder + "UnitSprite.png",
    unit1blue: folder + "UnitSprite.png"
};

var g_resources = [];
for (var i in res) {
    g_resources.push(res[i]);
}
