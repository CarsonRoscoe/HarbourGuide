//////////////////////////
//Cocos2D-JS Cheat Sheet////Notes at the bottom//
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

////Events with Sprites///Actions cannot be reused on different nodes. Unique per node.
//Move event: Where we are -> x/y position given.
var action = cc.MoveTo.create(/*seconds*/, cc.p(50, 100));

//Move event: Where we are -> x+newX/y+newY
var action = cc.MoveBy.create(/*seconds*/, cc.p(50, 100));

//Move event: Where we are -> end position by jumping x height y times.
var action = cc.JumpTo.create(/*seconds*/, cc.p(100, 200), x, y);

//Move event: Where we are -> x+newX / y+newY as end destination.
var action = cc.JumpBy.create(/*seconds*/, cc.p(100, 200), x, y);

//Move event: Points to curve to (basically 3 points it moves to curved wise)
var bezier = [cc.p(0, size.height/2), cc.p(100, -size.height / 4), cc.p(100, 100)];
var action = cc.BezierTo.create(/*seconds*/, bezier);

//Move event: Points relative to you to curve around
var bezier = [cc.p(0, 100), cc.p(100, -50), cc.p(100, 100)];
var action = cc.BezierBy.create(/*seconds*/, bezier);

//Move event: No animation - place it at a new point.
var action = cc.Place.create(cc.(200, 150));

//Scale sprite (wider, taller, shrink...). Based on xScale and YScale of 1.
var action = cc.ScaleTo.create(/*seconds*/, xScale, yScale);

//Scale sprite (wider, taller, shrink...). Based on current xScale and YScale.
var action = cc.ScaleBy.create(/*seconds*/, xScale, yScale);

//Tints current coloured sprite to RGB value over x seconds. 
//Based on default RGB of sprite.
var action = cc.TintTo.create(/*seconds*/, 255, 255, 255);

//Tints current coloured sprite to RGB value over x seconds. 
//Based on current RGB of sprite.
var action = cc.TintBy.create(/*seconds*/, 255, 255, 255);

//Fades sprite to new opacity based on default. 0 is transparent, 255 is solid.
var action = cc.FadeTo.create(/*seconds*/, /*Opacity/255*/);

//Fades sprite in to solid opacity from current. If solid before, set
//To be transparent before using this to utilize the effect(see setOpacity in misc.)
var action = cc.FadeIn.create(/*seconds*/);

//Fades sprite out to transparent opacity from current. If transparent before, set
//To be solid before using this to utilize the effect(see setOpacity in misc.)
var action = cc.FadeOut.create(/*seconds*/);

//Screws in pixels to sprites default: https://goo.gl/RiczNC <-example
var action = cc.SkewTo.create(/*seconds*/, /*x axis screw*/, /*y axis skew*/);

//Screws in pixels to sprites current skew: https://goo.gl/RiczNC <- example
var action = cc.SkewBy.create(/*seconds*/, /*x axis screw*/, /*y axis skew*/);

//Rotates sprites based on sprites default angle.
var action = cc.RotateTo.create(/*seconds*/, /*degree*/);

//Rotates sprites based on sprites current angle.
var action = cc.RotateBy.create(/*seconds*/, /*degree*/);

//Sequence of actions(Starts 2 once 1 has finished, NOT at the same time. Asynchronous)
var action = cc.Sequence.create(action1, action2);

//Repeat actions above a set amount of times
var action = cc.Repeat.create(/*different action like above*/, /*times*/);

//Repeat actions above forever
var action = cc.RepeatForever.create(/*different action like above*/);

//Make an object(sprite) execute an event
sprite.runAction(action);
////////////////////////////

//////Setting Up Touch//////
cc.eventManager.addListener{
		event: cc.EventListener.MOUSE,
		onMouseDown: function(event) {
			if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
				cc.log("Left mouse button pressed at " + event.getLocation());
			}
		}
}
////////////////////////////


///////Misc Things///////
//Get the screen width and height
cc.winSize.width && cc.winSize.height
//Dictate a point on the screen
cc.p(xPos, yPos);
//Set invisible(or set alpha channel, 0 is transparent, 255 is solid)
spriteName.setOpacity(0);
//Creating a node to draw with
var thing = new cc.drawNode();
//Adding JavaScript source files
Done in the JSON file
/////////////////////////

/*Personal Notes
bezierBy will be perfect for animating our boat turning left or right.
moveBy will be perfect for animating our boats and obstacles moving across grid
Sequence would be good for crashing (IE. drive halfway to grid then shrink+fade*/