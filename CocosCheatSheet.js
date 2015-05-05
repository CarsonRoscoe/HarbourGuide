//////////////////////////
//Cocos2D-JS Cheat Sheet//
//////////////////////////

///////Make a sprite///////
//Set var sprite to get that sprite from the resources
var sprite = new cc.Sprite.create(res.CloseNormal_png);
//Set origin of sprite
sprite.setAnchorPoint(cc.p(0.5, 0.5)); //0-1 of width, 0-1 of height. 0.5 means center of width and height.
//Set X and Y position on the screen.
sprite.setPosition(cc.p(100, 100));
//Add it to the visual layer to be added to the screen.
this.addChild(sprite, 0);
///////////////////////////

////////Moving Shit///////
//Creating move event: Where we are -> x/y position given.
var sprite_action = cc.MoveTo.create(2, cc.p(50, 100));
//Creation move event: Where we are -> x+newX/y+newY
var sprite_action = cc.MoveBy.create(2, cc.p(50, 100));
//Creation move event: Where we are -> end position by jumping x height y times.
var sprite_action = cc.JumpTo.create(2, cc.p(100, 200), x, y);
//Creation move event: Where we are -> x+newX / y+newY as end destination.
var sprite_action = cc.JumpBy.create(2, cc.p(100, 200), x, y);
//Make an object(sprite) execute an event
sprite.runAction(sprite_action);
//////////////////////////

///////Misc Things///////
//Get the screen width and height
cc.winSize.width && cc.winSize.height
/////////////////////////