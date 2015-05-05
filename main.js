/**
 * A brief explanation for "project.json":
 * Here is the content of project.json file, this is the global configuration for your game, you can modify it to customize some behavior.
 * The detail of each field is under it.
 {
    "project_type": "javascript",
    // "project_type" indicate the program language of your project, you can ignore this field

    "debugMode"     : 1,
    // "debugMode" possible values :
    //      0 - No message will be printed.
    //      1 - cc.error, cc.assert, cc.warn, cc.log will print in console.
    //      2 - cc.error, cc.assert, cc.warn will print in console.
    //      3 - cc.error, cc.assert will print in console.
    //      4 - cc.error, cc.assert, cc.warn, cc.log will print on canvas, available only on web.
    //      5 - cc.error, cc.assert, cc.warn will print on canvas, available only on web.
    //      6 - cc.error, cc.assert will print on canvas, available only on web.

    "showFPS"       : true,
    // Left bottom corner fps information will show when "showFPS" equals true, otherwise it will be hide.

    "frameRate"     : 60,
    // "frameRate" set the wanted frame rate for your game, but the real fps depends on your game implementation and the running environment.

    "id"            : "gameCanvas",
    // "gameCanvas" sets the id of your canvas element on the web page, it's useful only on web.

    "renderMode"    : 0,
    // "renderMode" sets the renderer type, only useful on web :
    //      0 - Automatically chosen by engine
    //      1 - Forced to use canvas renderer
    //      2 - Forced to use WebGL renderer, but this will be ignored on mobile browsers

    "engineDir"     : "frameworks/cocos2d-html5/",
    // In debug mode, if you use the whole engine to develop your game, you should specify its relative path with "engineDir",
    // but if you are using a single engine file, you can ignore it.

    "modules"       : ["cocos2d"],
    // "modules" defines which modules you will need in your game, it's useful only on web,
    // using this can greatly reduce your game's resource size, and the cocos console tool can package your game with only the modules you set.
    // For details about modules definitions, you can refer to "../../frameworks/cocos2d-html5/modulesConfig.json".

    "jsList"        : [
    ]
    // "jsList" sets the list of js files in your game.
 }
 *
 */

cc.game.onStart = function(){
    if(!cc.sys.isNative && document.getElementById("cocosLoading")) //If referenced loading.js, please remove it
        document.body.removeChild(document.getElementById("cocosLoading"));

    var isLandscape = false;
    if (cc.sys.isNative) {
    	var searchPaths = jsb.fileUtils.getSearchPaths();
    	
    	// ipad retina
    	if (cc.view.getFrameSize().width >= 1536 && cc.view.getFrameSize().height >= 1536) {
    		if (isLandscape) {
    			cc.view.setDesignResolutionSize(2048, 1536, cc.ResolutionPolicy.SHOW_ALL);
    		} else {
    			cc.view.setDesignResolutionSize(1536, 2048, cc.ResolutionPolicy.SHOW_ALL);
    		}
    		searchPaths.push("res/largeRes");
    		searchPaths.push("src");
    	} else if (cc.view.getFrameSize().width >= 640 && cc.view.getFrameSize().height >= 640) { //iphone hd and android high res
    		var size;
    		if (cc.view.getFrameSize.width >= 1136 || cc.view.getFrameSize.height >= 1136) {
    			size = 1136;
    		} else {
    			size = 960;
    		}
    		
    		if (isLandscape) {
    			cc.view.setDesignResolutionSize(size, 640, cc.ResolutionPolicy.SHOW_ALL);
    		} else {
    			cc.view.setDesignResolutionSize(640, size, cc.ResolutionPolicy.SHOW_ALL);
    		}
    		searchPaths.push("res/mediumRes");
    		searchPaths.push("src");
    	} else {
    		if (isLandscape) {
    			cc.view.setDesignResolutionSize(480, 320, cc.ResolutionPolicy.SHOW_ALL);
    		} else {
    			cc.view.setDesignResolutionSize(320, 480, cc.ResolutionPolicy.SHOW_ALL);
    		}

    		searchPaths.push("res/lowRes");
    		searchPaths.push("src");
    	}
    	jsb.fileUtils.setSearchPaths(searchPaths);
    } else {
    	if (isLandscape) {
    		cc.view.setDesignResolutionSize(1280, 720, cc.ResolutionPolicy.SHOW_ALL);
    	} else {
    		cc.view.setDesignResolutionSize(720, 1280, cc.ResolutionPolicy.SHOW_ALL);
    	}
    	cc.view.resizeWithBrowserSize(true);
    }
    
    
    // Pass true to enable retina display, disabled by default to improve performance
    cc.view.enableRetina(false);
    // Adjust viewport meta
    cc.view.adjustViewPort(true);
    // Setup the resolution policy and design resolution size

    //load resources
    cc.LoaderScene.preload(g_resources, function () {
        cc.director.runScene(new GameScene());
    }, this);
};
cc.game.run();