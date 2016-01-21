# Harbour Guide

A web based mobile puzzle game written in JavaScript. The aim of the game is simple. Boats come in from the bottom with a colour and a number of crates on their back. Your goal is to navigate these boats around the obstacles in the harbour to get your boats to go out the correct gates.

To move your boats, you simply tap on them with your phones touch screen and swipe in the direction you want them to go (Up/Left/Right/Down). To move an obstacle, you swipe the obstacle left/right or up/down (depending on whether the obstacle is facing horizontally or vertically).

Getting the boat to go through the correct gate gives you points. Getting them through the wrong gate loses points. Points are also lost passively as the game goes on, pushing the user to make faster decisions.

The game is fully dynamic, scaling the puzzles difficulty to match how the player performed in the preceeding puzzles. It uses an elo system we refer to as "Difficulty". Performing well raises your difficulty, performing poorly lowers it. The entire game is auto-generated around this stat.

Features of the game include:
* Fully dynamic level/puzzle generation.
* Elo system
* Online highscore board
* Achievement System
* 
# Tools Used

The game is written with JavaScript as the primary language. The server application is written in C#.

Within JavaScript:
* Cocos2D-JS is the JavaScript game library used to help with the UI, screen transitions and touch commands.
* Jquery is the JavaScript library used for communicating with the server application.
* 
# How To Play

Redirect your phones browser to http://harbourguide.royalwebhosting.net/.

A few important notes:
* Until we get proper hosting, that site will do. For whatever reason, the hosting site blocks sound files from being loaded.
* The hosting is slow, so it takes a while to load.
* Until we get proper hosting, the server application is temporarily disabled. You can still fully play, however you cannot submit your high scores.

These issues will all be addressed in the near future.

# How To Compile/Run Locally

Download and setup Cocos2D-js: http://cocos2d-x.org/filecenter/jsbuilder/

Setup apache (or some type of XAMP stack) to host the game locally.

Move the game files over to the apache folder.

Run index.html
