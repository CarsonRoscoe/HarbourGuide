/**
 * The layer which contains all the gameplay. When a new level is created this scene is
 * referenced.
 */
var GameBoard = cc.Layer.extend({
	cellsRow: null,
	cellsColumn: null,
	cellSize: null,
	gridCells: null,
	grid: null,
	obstacleBoats: null,
	unitBoats: null,
	gridGates: null,
	boardGlobX: null,
	boardGlobY: null,
	interaction: null,
	drawLayers: null,
	gameVars: null,
	hud: null,
	paintInterval: null,

	/**
	 * Constructor that builds the game grid.
	 * @returns {Boolean} = was successful?
	 */
	ctor:function (newHudLayer) {
		// Super init first
		this._super();
		cellsRow = 7;
		cellsColumn = 9;
		cellSize = cc.winSize.width / cellsRow;
		gridCells = cellsRow * cellsColumn;
		grid = createGrid();
		obstacleBoats = [];
		unitBoats = [];
		gridGates = [];
		boardGlobX = 0;
		boardGlobY = (cc.winSize.height - cellsColumn * cellSize) / 2;
		interaction = null;
		drawLayers = [];
		gameVars = new gameVariables();
		gameVars.score = 0;
		var readPlayer = loadPlayer(50);
		gameVars.difficulty = readPlayer.difficulty;
		gameVars.difficultyOffsetUp = readPlayer.difficultyUp;
		gameVars.difficultyOffsetDown = readPlayer.difficultyDown;
		gameVars.unitSpeed = 1500 - Math.round(gameVars.difficulty * 14);
		gameVars.unitsStart = 5 + Math.round(gameVars.difficulty * .35);
		gameVars.speedCount = 0;
		gameVars.realSpeed = 0;
		gameVars.unitsLeft = gameVars.unitsStart;
		gameVars.unitsComplete = 0;
		gameVars.frameRate = 16;
		gameVars.spawnRate = 10000 - Math.round(gameVars.difficulty * 50); //how often this spawns * time
		gameVars.spawnCount = gameVars.spawnRate;
		gameVars.unitsOnBoard = 1 + Math.round(gameVars.difficulty / 20);
		gameVars.isPaused = false;
		gameVars.thisScene = this;
		hud = newHudLayer;
		hud.updateBoatsLeft(gameVars.unitsLeft);
		
		drawBackground(this);
		
		createGates();
		
		initUnitMovement(this);
		createLevel(gameVars.difficulty, this);

		initPaint(0, this);
		initPaint(1, this);
		initPaint(2, this);
		repaintLoop(false);
		
			/**
			 * Handles all the touch and swipe movements on the grid.
			 */
			cc.eventManager.addListener({
				event: cc.EventListener.TOUCH_ALL_AT_ONCE,
				mouseDown: null,
				mouseUp: null,
				clickOffset: null,
				shipSelected: null,
				shipIndexSelected: null,
				isUnitSelected: null,
				relativeX: null,
				relativeY: null,

				/**
				 * Sets up the movement variables and detects if the user clicked on a boat.
				 * WHEN MOUSE CLICKED/TAPPED.
				 */
				onTouchesBegan: function(touches, event) {
					clickOffset = null;
					mouseDown = touches[0].getLocation();
					mouseDown.y -= boardGlobY;
					mouseDown.x -= boardGlobX;
					if (mouseDown.x >= boardGlobX && mouseDown.x <= (cellSize * cellsRow)
							&& mouseDown.y >= 0 && mouseDown.y <= (cellSize * cellsColumn) && !gameVars.isPaused) {
						interaction = new dragMovement();
						interaction.pointClicked = mouseDown;
						shipSelected = grid[Math.floor(interaction.pointClicked.x / cellSize)][Math.floor(interaction.pointClicked.y / cellSize)].shipID;
						if (shipSelected == null) {
							shipIndexSelected = grid[Math.floor(interaction.pointClicked.x / cellSize)][Math.floor(interaction.pointClicked.y / cellSize)].unitID;
							if (shipIndexSelected != null) {
								for (var tt = 0; tt < unitBoats.length; tt++) {
									if (unitBoats[tt].selfID == shipIndexSelected) {
										shipSelected = tt;
										break;
									}
								}
							}
							isUnitSelected = true;
						} else {
							if (obstacleBoats[shipSelected].orientation == 0) {
								relativeX = interaction.pointClicked.x - (obstacleBoats[shipSelected].frontPoint.x + (obstacleBoats[shipSelected].length * .5)) * cellSize;
								relativeY = interaction.pointClicked.y - (obstacleBoats[shipSelected].frontPoint.y + .5) * cellSize;
							} else {
								relativeX = interaction.pointClicked.x - (obstacleBoats[shipSelected].frontPoint.x + .5) * cellSize;
								relativeY = interaction.pointClicked.y - (obstacleBoats[shipSelected].frontPoint.y + (obstacleBoats[shipSelected].length * .5)) * cellSize;
							}
							isUnitSelected = false;
						}
					}
				},

				/**
				 * Refreshes the grid movement object.
				 * WHEN MOUSE CLICK/TAP RELEASED.
				 */
				onTouchesEnded: function(touches, event) {
					interaction = null;
					clickOffset = null;
					shipIndexSelected = null;
					shipSelected = null;
					isUnitSelected = null;
				},


				/**
				 * Moves the boats and units based on the grid based off of user swiping.
				 * Updates obstacle movement immediatly, changes variables for unit movement.
				 * WHEN MOUSE CLICK/TAP IS MOVED.
				 */
				onTouchesMoved: function(touches, event) {
					if (interaction != null && !gameVars.isPaused) {
						var action = null;
						mouseUp = touches[0].getLocation();
						mouseUp.y -= boardGlobY;
						mouseUp.x -= boardGlobX;
						interaction.pointCurrent = mouseUp;
						
						var clickY = Math.floor(interaction.pointClicked.y / cellSize);
						var clickX = Math.floor(interaction.pointClicked.x / cellSize);
						var curY = Math.floor(interaction.pointCurrent.y / cellSize);
						var curX = Math.floor(interaction.pointCurrent.x / cellSize);
						if (Math.abs(interaction.pointClicked.y - interaction.pointCurrent.y) < (cellSize / 2) - 25 && Math.abs(interaction.pointClicked.x - interaction.pointCurrent.x) < (cellSize / 2) - 25) {
							return;
						}
						
						if (shipSelected != null && isUnitSelected == false) {							
							if (obstacleBoats[shipSelected].orientation == 0) {
								if (clickOffset == null) {
									clickOffset = obstacleBoats[shipSelected].backPoint.x - clickX;
								}
//								var action = cc.Place.create(cc.p(interaction.pointCurrent.x - relativeX, obstacleBoats[shipSelected].sprite.y));
//								obstacleBoats[shipSelected].sprite.runAction(action);
								
								if (clickX < curX && obstacleBoats[shipSelected].backPoint.x < cellsRow - 1
										&& curX - (obstacleBoats[shipSelected].backPoint.x - clickOffset) > 0 
										&& grid[obstacleBoats[shipSelected].backPoint.x + 1][clickY].isEmpty == true) {
									interaction.pointClicked.x = interaction.pointCurrent.x;
									
									grid[obstacleBoats[shipSelected].frontPoint.x][clickY].isEmpty = true;
									grid[obstacleBoats[shipSelected].frontPoint.x][clickY].shipID = null;

									grid[obstacleBoats[shipSelected].backPoint.x + 1][clickY].isEmpty = false;
									grid[obstacleBoats[shipSelected].backPoint.x + 1][clickY].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.x += 1;
									obstacleBoats[shipSelected].backPoint.x += 1;
									action = cc.Place.create(cc.p((obstacleBoats[shipSelected].frontPoint.x + (obstacleBoats[shipSelected].length * .5)) * cellSize, (obstacleBoats[shipSelected].frontPoint.y + .5) * cellSize));
									obstacleBoats[shipSelected].sprite.runAction(action);
									repaint(2);
									
								} else if (clickX > curX && obstacleBoats[shipSelected].frontPoint.x > 0
										&& curX - (obstacleBoats[shipSelected].frontPoint.x - (clickOffset - obstacleBoats[shipSelected].length)) < 0
										&& grid[obstacleBoats[shipSelected].frontPoint.x - 1][clickY].isEmpty == true) {
									interaction.pointClicked.x = interaction.pointCurrent.x;

									grid[obstacleBoats[shipSelected].backPoint.x][clickY].isEmpty = true;
									grid[obstacleBoats[shipSelected].backPoint.x][clickY].shipID = null;

									grid[obstacleBoats[shipSelected].frontPoint.x - 1][clickY].isEmpty = false;
									grid[obstacleBoats[shipSelected].frontPoint.x - 1][clickY].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.x -= 1;
									obstacleBoats[shipSelected].backPoint.x -= 1;
									action = cc.Place.create(cc.p((obstacleBoats[shipSelected].frontPoint.x + (obstacleBoats[shipSelected].length * .5)) * cellSize, (obstacleBoats[shipSelected].frontPoint.y + .5) * cellSize));
									obstacleBoats[shipSelected].sprite.runAction(action);
									repaint(2);

								}
							} else if (obstacleBoats[shipSelected].orientation == 1) {
								if (clickOffset == null) {
									clickOffset = obstacleBoats[shipSelected].backPoint.y - clickY;
								}
								
//								var action = cc.Place.create(cc.p(obstacleBoats[shipSelected].sprite.x, interaction.pointCurrent.y));
//								obstacleBoats[shipSelected].sprite.runAction(action);
								
								if (clickY < curY && obstacleBoats[shipSelected].backPoint.y < cellsColumn - 1
										&& curY - (obstacleBoats[shipSelected].backPoint.y - clickOffset) > 0
										&& grid[clickX][obstacleBoats[shipSelected].backPoint.y + 1].isEmpty == true) {
									interaction.pointClicked.y = interaction.pointCurrent.y;

									grid[clickX][obstacleBoats[shipSelected].frontPoint.y].isEmpty = true;
									grid[clickX][obstacleBoats[shipSelected].frontPoint.y].shipID = null;

									grid[clickX][obstacleBoats[shipSelected].backPoint.y + 1].isEmpty = false;
									grid[clickX][obstacleBoats[shipSelected].backPoint.y + 1].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.y += 1;
									obstacleBoats[shipSelected].backPoint.y += 1;
									action = cc.Place.create(cc.p((obstacleBoats[shipSelected].frontPoint.x + .5) * cellSize, (obstacleBoats[shipSelected].frontPoint.y + (obstacleBoats[shipSelected].length * .5)) * cellSize));
									obstacleBoats[shipSelected].sprite.runAction(action);
									repaint(2);

								} else if (clickY > curY && obstacleBoats[shipSelected].frontPoint.y > 0
										&& curY - (obstacleBoats[shipSelected].frontPoint.y - (clickOffset - obstacleBoats[shipSelected].length)) < 0
										&& grid[clickX][obstacleBoats[shipSelected].frontPoint.y - 1].isEmpty == true) {
									interaction.pointClicked.y = interaction.pointCurrent.y;

									grid[clickX][obstacleBoats[shipSelected].backPoint.y].isEmpty = true;
									grid[clickX][obstacleBoats[shipSelected].backPoint.y].shipID = null;

									grid[clickX][obstacleBoats[shipSelected].frontPoint.y - 1].isEmpty = false;
									grid[clickX][obstacleBoats[shipSelected].frontPoint.y - 1].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.y -= 1;
									obstacleBoats[shipSelected].backPoint.y -= 1;
									action = cc.Place.create(cc.p((obstacleBoats[shipSelected].frontPoint.x + .5) * cellSize, (obstacleBoats[shipSelected].frontPoint.y + (obstacleBoats[shipSelected].length * .5)) * cellSize));
									obstacleBoats[shipSelected].sprite.runAction(action);
									repaint(2);
								}
							}
							
						} else if (shipSelected != null && isUnitSelected == true && unitBoats[shipSelected].selfID == shipIndexSelected) {
							var clickY = interaction.pointClicked.y;
							var clickX = interaction.pointClicked.x;
							var curY = interaction.pointCurrent.y;
							var curX = interaction.pointCurrent.x;
							if (unitBoats[shipSelected].direction == 0 && unitBoats[shipSelected].point.y < cellsColumn - 1 && (grid[unitBoats[shipSelected].point.x][unitBoats[shipSelected].point.y + 1].isEmpty == true
									|| grid[unitBoats[shipSelected].point.x][unitBoats[shipSelected].point.y + 1].unitID == unitBoats[shipSelected].selfID)) {
								var spin = 360 - (unitBoats[shipSelected].sprite.rotation % 360 - unitBoats[shipSelected].direction * 90);
								unitBoats[shipSelected].sprite.runAction(cc.RotateBy.create((gameVars.unitSpeed/1000 / 360) * spin, spin));
								interaction = null;
								clickOffset = null;
								shipSelected = null;
								shipSelected = null;
								isUnitSelected = null;
								return;
							} else if (unitBoats[shipSelected].direction == 1 && unitBoats[shipSelected].point.x < cellsRow - 1 && (grid[unitBoats[shipSelected].point.x + 1][unitBoats[shipSelected].point.y].isEmpty == true
									|| grid[unitBoats[shipSelected].point.x + 1][unitBoats[shipSelected].point.y].unitID == unitBoats[shipSelected].selfID)) {
								var spin = 360 - (unitBoats[shipSelected].sprite.rotation % 360 - unitBoats[shipSelected].direction * 90);
								unitBoats[shipSelected].sprite.runAction(cc.RotateBy.create((gameVars.unitSpeed/1000 / 360) * spin, spin));
								interaction = null;
								clickOffset = null;
								shipSelected = null;
								shipSelected = null;
								isUnitSelected = null;
								return;
							} else if (unitBoats[shipSelected].direction == 2 && unitBoats[shipSelected].point.y > 0 && (grid[unitBoats[shipSelected].point.x][unitBoats[shipSelected].point.y - 1].isEmpty == true
									|| grid[unitBoats[shipSelected].point.x][unitBoats[shipSelected].point.y - 1].unitID == unitBoats[shipSelected].selfID)) {
								var spin = 360 - (unitBoats[shipSelected].sprite.rotation % 360 - unitBoats[shipSelected].direction * 90);
								unitBoats[shipSelected].sprite.runAction(cc.RotateBy.create((gameVars.unitSpeed/1000 / 360) * spin, spin));
								interaction = null;
								clickOffset = null;
								shipSelected = null;
								shipSelected = null;
								isUnitSelected = null;
								return;
							} else if (unitBoats[shipSelected].direction == 3 && unitBoats[shipSelected].point.x > 0 && (grid[unitBoats[shipSelected].point.x - 1][unitBoats[shipSelected].point.y].isEmpty == true
									|| grid[unitBoats[shipSelected].point.x - 1][unitBoats[shipSelected].point.y].unitID == unitBoats[shipSelected].selfID)) {
								var spin = 360 - (unitBoats[shipSelected].sprite.rotation % 360 - unitBoats[shipSelected].direction * 90);
								unitBoats[shipSelected].sprite.runAction(cc.RotateBy.create((gameVars.unitSpeed/1000 / 360) * spin, spin));
								interaction = null;
								clickOffset = null;
								shipSelected = null;
								shipSelected = null;
								isUnitSelected = null;
								return;
							}
							
							
							if (Math.abs(clickY - curY) > Math.abs(clickX - curX)) {
								if (clickY - curY > 0) {
									unitBoats[shipSelected].direction = 2;
								} else {
									unitBoats[shipSelected].direction = 0;
								}
							} else {
								if (clickX - curX > 0) {
									unitBoats[shipSelected].direction = 3;
								} else {
									unitBoats[shipSelected].direction = 1;
								}
							}
							unitBoats[shipSelected].dirChanged = true;
							interaction = null;
							clickOffset = null;
							shipSelected = null;
							shipIndexSelected = null;
							isUnitSelected = null;
						}
					}
				}
			}, this);
			

			this.runAction(cc.Place.create(cc.p(boardGlobX, boardGlobY)));
			

		return true;
	}
});

var checkNewLevel = function() {
	var testGrid = createGrid();
	var shipSpawn = [];
	shipSpawn = obstacleBoats;
	for (var i = 0; i < shipSpawn.length; i++) {
		for (var j = 0; j < shipSpawn[i].length; j++) {
			if (shipSpawn[i].orientation == 0) {
				testGrid[shipSpawn[i].frontPoint.x + j][shipSpawn[i].frontPoint.y].isEmpty = false;
				testGrid[shipSpawn[i].frontPoint.x + j][shipSpawn[i].frontPoint.y].unitID = 0;
				testGrid[shipSpawn[i].frontPoint.x + j][shipSpawn[i].frontPoint.y].shipID = i;
			} else if (shipSpawn[i].orientation == 1) {
				testGrid[shipSpawn[i].frontPoint.x][shipSpawn[i].frontPoint.y + j].isEmpty = false;
				testGrid[shipSpawn[i].frontPoint.x][shipSpawn[i].frontPoint.y + j].unitID = 1;
				testGrid[shipSpawn[i].frontPoint.x][shipSpawn[i].frontPoint.y + j].shipID = i;
			}
		}
	}
	for (var t = 0; t < cellsColumn; t++) {
		var count = 0;
		for (var c = 0; c < cellsRow; c++) {
			if (testGrid[c][t].isEmpty == false) {
				if (testGrid[c][t].unitID == 0) {
					count++;
				}
			}
		}
		if (count >= 7) {
			cc.log("CANT PASS BOATS");
			return false;
		}
	}
	for (var i = 0; i < shipSpawn; i++) {
		if (shipSpawn[i].length == 4 && shipSpawn[i].startPoint.y == cellsColumn - 1) {
			cc.log("4 BOAT ON TOP");
			return false;
		}
	}
	for (var i = 0; i < shipSpawn; i++) {
		if (shipSpawn[i].length == 4 && shipSpawn[i].orientation == 1 && shipSpawn[i].frontPoint.y == cellsColumn - 1 
				&& shipSpawn[testGrid[shipSpawn[i].frontPoint.x][shipSpawn[i].backPoint.y - 1].shipID].length == 4) {
			cc.log("4 BOAT TRAPPED");
			return false;
		}
	}
	return true;
}

var ShipObstacle = function() {
	length: null;
orientation: null;
frontPoint: null;
backPoint: null;
origin: null;
sprite: null;
}

/**
 * Creates the gates of where the boats should be sent. Initializes the correct
 * variables for accepting boats.
 */
var createGates = function() {
	//gridGates
	for(var i = 0; i < 9; i++) {
		gridGates[i] = new Gate();
	}
	gridGates[0].position = cc.p(0, 3);
	gridGates[1].position = cc.p(0, 5);
	gridGates[2].position = cc.p(0, 7);
	gridGates[3].position = cc.p(1, cellsColumn - 1);
	gridGates[4].position = cc.p(3, cellsColumn - 1);
	gridGates[5].position = cc.p(5, cellsColumn - 1);
	gridGates[6].position = cc.p(cellsRow - 1, 7);
	gridGates[7].position = cc.p(cellsRow - 1, 5);
	gridGates[8].position = cc.p(cellsRow - 1, 3);
	

	gridGates[0].direction = 3;
	gridGates[1].direction = 3;
	gridGates[2].direction = 3;
	gridGates[3].direction = 0;
	gridGates[4].direction = 0;
	gridGates[5].direction = 0;
	gridGates[6].direction = 1;
	gridGates[7].direction = 1;
	gridGates[8].direction = 1;
	
	gridGates[0].gateID = 0;
	gridGates[1].gateID = 1;
	gridGates[2].gateID = 2;
	gridGates[3].gateID = 3;
	gridGates[4].gateID = 4;
	gridGates[5].gateID = 5;
	gridGates[6].gateID = 6;
	gridGates[7].gateID = 7;
	gridGates[8].gateID = 8;
	
	grid[0][3].gateID = 0;
	grid[0][5].gateID = 1;
	grid[0][7].gateID = 2;
	grid[1][cellsColumn - 1].gateID = 3;
	grid[3][cellsColumn - 1].gateID = 4;
	grid[5][cellsColumn - 1].gateID = 5;
	grid[cellsRow - 1][7].gateID = 6;
	grid[cellsRow - 1][5].gateID = 7;
	grid[cellsRow - 1][3].gateID = 8;
}

/**
 * Creates the grid based off of size variables. The grid creates cells in 
 * the positions and assigns empty and their coordinates.
 */
var createGrid = function() {
	var grid = [];
	for (i = 0; i < cellsRow; i++) {
		grid[i] = new Array(cellsColumn);
		for (j = 0; j < cellsColumn; j++) {
			grid[i][j] = new Cell();
			grid[i][j].isEmpty = true;
			grid[i][j].xPos = cellSize * i + (cellSize / 2);
			grid[i][j].yPos = j * cellSize + (cellSize / 2);
		}
	}
	return grid;
};


var drawBackground = function(ref) {
	var back = new cc.Sprite.create(res.GameBackground_png);	
	back.setAnchorPoint(0,0);
	back.setScaleX(cc.winSize.width / back.width);
	back.setScaleY((cellSize * cellsColumn) / back.height);
	back.setPosition(cc.p(0,0));
	ref.addChild(back, 100);
	
	var gates = 3;
	var sgate = [];
	for (var i = 0; i < gates; i++) {
		sgate[i] = new cc.Sprite.create(res.backgroundGate);	
		sgate[i].setAnchorPoint(0,0);
		sgate[i].setScaleX(cellSize / sgate[i].width);
		sgate[i].setPosition(cc.p(cellSize + (2 * i * cellSize),0));
		sgate[i].runAction(cc.TintTo.create(0, 225, 177, 77));
		ref.addChild(sgate[i], 10000);
	}
	
	var redgate = [];
	for (var i = 0; i < gates; i++) {
		redgate[i] = new cc.Sprite.create(res.backgroundGate);	
		redgate[i].setAnchorPoint(0,0);
		redgate[i].setScaleX(cellSize / redgate[i].width);
		redgate[i].setPosition(cc.p(0 , (cellSize * 4) + (2 * i * cellSize)));
		redgate[i].runAction(cc.RotateTo.create(0, 90));
		redgate[i].runAction(cc.TintTo.create(0, 255, 0, 0));
		ref.addChild(redgate[i], 10000);
	}
	
	var greengate = [];
	for (var i = 0; i < gates; i++) {
		greengate[i] = new cc.Sprite.create(res.backgroundGate);	
		greengate[i].setAnchorPoint(0,0);
		greengate[i].setScaleX(cellSize / greengate[i].width);
		greengate[i].setPosition(cc.p(boardGlobX + (cellSize * 2) + (2 * i * cellSize), (cellsColumn) * cellSize));
		greengate[i].runAction(cc.RotateTo.create(0, 180));
		greengate[i].runAction(cc.TintTo.create(0, 0, 255, 0));
		ref.addChild(greengate[i], 10000);
	}
	
	var bluegate = [];
	for (var i = 0; i < gates; i++) {
		bluegate[i] = new cc.Sprite.create(res.backgroundGate);	
		bluegate[i].setAnchorPoint(0,0);
		bluegate[i].setScaleX(cellSize / bluegate[i].width);
		bluegate[i].setPosition(cc.p((cellsRow) * cellSize, (cellSize * 3) + (2 * i * cellSize)));
		bluegate[i].runAction(cc.RotateTo.create(0, -90));
		bluegate[i].runAction(cc.TintTo.create(0, 0, 0, 255));
		ref.addChild(bluegate[i], 10000);
	}
	
}

/**
 * Creates an obstacle boat on the grid.
 * front = (cc.p) the front point of the boat 
 * back = (cc.p) the back point of the boat 
 * orient = (int)orientation. 0 = horizontal, 1 = vertical. 
 * size = (int) the amount of spaces this boat will take up.
 */
var createBoat = function(front, back, orient, ref) {
	var ship = new ShipObstacle();
	ship.length = Math.abs((front.x - back.x) + (front.y - back.y)) + 1;
	ship.orientation = orient;
	ship.frontPoint = front;
	ship.backPoint = back;

	ship.frontReal = cc.p(front.x * cellSize, front.y * cellSize);
	ship.backReal = cc.p(back.x * cellSize, back.y * cellSize);	

	if (validateShip(ship)) {
		obstacleBoats[obstacleBoats.length] = ship;
	} else {
		return false;
	}

	if (orient == 0 && front.y == back.y) {
		for(var i = front.x; i <= back.x; i++) {
			grid[i][front.y].isEmpty = false;
			grid[i][front.y].shipID = obstacleBoats.length - 1;
		}
	} else if (orient == 1 && front.x == back.x) {
		for(var i = front.y; i <= back.y; i++) {
			grid[front.x][i].isEmpty = false;
			grid[front.x][i].shipID = obstacleBoats.length - 1;
		}
	}

	//Set var sprite to get that sprite from the resources
	switch(ship.length) {
	case 2: 
		ship.sprite = new cc.Sprite.create(res.med1x2Shipv1);
		break;
	case 3:
		ship.sprite = new cc.Sprite.create(res.med1x3Shipv1);
		break;
	case 4:
		ship.sprite = new cc.Sprite.create(res.med1x4Shipv1);
		break;
	}

	ship.sprite.setAnchorPoint(cc.p(0.5, 0.5));
	if (ship.orientation == 0) {
		ship.sprite.setRotation(90);
		ship.sprite.setPosition(cc.p((ship.frontPoint.x + (ship.length * .5)) * cellSize, (ship.frontPoint.y + .5) * cellSize));
	} else {
		ship.sprite.setPosition(cc.p((ship.frontPoint.x + .5) * cellSize, (ship.frontPoint.y + (ship.length * .5)) * cellSize));
	}

	ref.addChild(ship.sprite, 100);

	obstacleBoats[obstacleBoats.length] = ship;
	return true;
};


/**
 * Creates a unit for the player to control, on the grid. 
 * startPoint = (cc.p) The point on the grid to create the unit.
 * direction = (int) The direction the boat will move when it's created.
 * 				0 = up, 1 = right, 2 = down, 3 = left
 * ref = The surface to create the boat and it's sprite on.
 */
var createUnit = function(startPoint, direction, ref) {
	if (grid[startPoint.x][startPoint.y].isEmpty == false) {
		return false;
	}
	var unit = new ShipUnit();
	unit.selfID = gameVars.unitsLeft;
	unit.gateID = Math.floor(Math.random()*9);
	unit.direction = direction;
	unit.spawnTime = 0;
	unit.point = startPoint;
	unit.pointLast = cc.p(startPoint.x, startPoint.y);
	unit.dirChanged = false;
	switch(unit.gateID) {
		case 0:
			unit.sprite = new cc.Sprite.create(res.unit0);
			break;
		case 1:
			unit.sprite = new cc.Sprite.create(res.unit1);
			break;
		case 2:
			unit.sprite = new cc.Sprite.create(res.unit2);
			break;
		case 3:
			unit.sprite = new cc.Sprite.create(res.unit3);
			break;
		case 4:
			unit.sprite = new cc.Sprite.create(res.unit4);
			break;
		case 5:
			unit.sprite = new cc.Sprite.create(res.unit5);
			break;
		case 6:
			unit.sprite = new cc.Sprite.create(res.unit6);
			break;
		case 7:
			unit.sprite = new cc.Sprite.create(res.unit7);
			break;
		case 8:
		case 9:
			unit.sprite = new cc.Sprite.create(res.unit8);
			break;
		default:
			break;
	}
	
	unit.sprite.setAnchorPoint(.5, .5);
	unit.sprite.setPosition(cc.p((startPoint.x + .5) * cellSize, ((startPoint.y + .5) * cellSize) - (cellSize)));
	
	ref.addChild(unit.sprite, 100);
	unitBoats[unitBoats.length] = unit;
	

	unitAnimate(unit.sprite, direction, true, true);

	grid[startPoint.x][startPoint.y].isEmpty = false;
	grid[startPoint.x][startPoint.y].unitID = unit.selfID;
	return true;


};

/**
 * Checks to ensure a new obstacle object is being created in an appropriate
 * place on the grid (not overlapping or partally off the grid).
 */
var validateShip = function(ship) {
	if (ship.frontPoint.x >= 0 && ship.frontPoint.x < cellsRow
			&& ship.frontPoint.y >= 2 && ship.frontPoint.y < cellsColumn
			&& ship.backPoint.x >= 0 && ship.backPoint.x < cellsRow
			&& ship.backPoint.y >= 2 && ship.backPoint.y < cellsColumn
			&& ((ship.orientation == 0 && ship.frontPoint.y == ship.backPoint.y)
					|| (ship.orientation == 1 && ship.frontPoint.x == ship.backPoint.x))) {
		if (ship.orientation == 0 && ship.frontPoint.y == ship.backPoint.y) {
			for(var i = ship.frontPoint.x; i <= ship.backPoint.x; i++) {
				if (grid[i][ship.frontPoint.y].isEmpty == false) {
					return false;
				}
			}
		} else if (ship.orientation == 1 && ship.frontPoint.x == ship.backPoint.x) {
			for(var i = ship.frontPoint.y; i <= ship.backPoint.y; i++) {
				if (grid[ship.frontPoint.x][i].isEmpty == false) {
					return false;
				}
			}
		}
		return true;
	} else {
		return false;
	}
};

/**
 * Generates the obstacles on the level based off of a difficulty number.
 * difficulty = (int 1 - 100) The difficulty of the level.
 * ref = The surface to create the obstacles on.
 */
var createLevel = function(difficulty, ref) {
	
	cc.log(gameVars.unitsStart * (Math.round(gameVars.difficulty / (10 + (gameVars.difficulty / 20))) + (gameVars.difficulty * (.8 + (gameVars.difficulty / 500)))));
	
	var lengths = [];
	lengths[0] = 100 - (difficulty / 2);
	lengths[1] = 100 - lengths[0];
	lengths[2] = lengths[1] / 4;
	lengths[1] = lengths[2] * 3;
	lengths[0] += lengths[1] + lengths[2];
	lengths[1] += lengths[2];
	var orientation = 0;
	var spawns = 8 + Math.round(difficulty / 20);//Math.ceil((difficulty + Math.round(Math.random() * (Math.round(Math.random() * 20)))) / 10);
	while(spawns != null && spawns > 0) {
		if (orientation == 0) {
			var xx = Math.round(Math.random() * cellsColumn);
			var yy = Math.round(Math.random() * cellsRow - 2) + 2;
			var length = Math.round(Math.random() * 100);
			for(var i = lengths.length - 1; i >= 0; i--) {
				if (length <= lengths[i]) {
					length = i + 1;
					break;
				}
			}
			if (createBoat(cc.p(xx, yy), cc.p(xx + length, yy), 0, ref)) {
				spawns--;
			}
			orientation++;
		} else if (orientation == 1) {
			var xx = Math.round(Math.random() * cellsColumn);
			var yy = Math.round(Math.random() * cellsRow - 2) + 2;
			var length = Math.round(Math.random() * 100);
			for(var i = lengths.length - 1; i >= 0 ; i--) {
				if (length <= lengths[i]) {
					length = i + 1;
					break;
				}
			}
			orientation--;
			if (createBoat(cc.p(xx, yy), cc.p(xx ,yy + length), 1, ref)) {
				spawns--;
			}
		}
	}
	if (!checkNewLevel()) {
		ref.removeAllChildren();		
		drawBackground(ref);
		//might cause leak, not sure if they get removed.
		initPaint(0, ref);
		initPaint(1, ref);
		initPaint(2, ref);
		obstacleBoats = [];
		grid = createGrid();
		createLevel(difficulty, ref);
	}
};

/**
 * Initializes a paint layer to a layer. The paint layers allow the game to be updated without
 * the need to redraw the entire page, only what layer needs to be redrawn.
 * layer = (int) The index of paint layer to create and draw.
 * ref = The layer the draw will be drawn to.
 */
var initPaint = function(layer, ref) {
	// Set draw to be our surface to draw to
	drawLayers[layer] = new cc.DrawNode();

	ref.addChild(drawLayers[layer]);
	
	repaint(layer);
};

/**
 * Redraws the layer's paint based off of the paint's layers. For example, repainting just the grid
 * squares will involve redrawing over layer 0. 
 * depth = (int) The layer index to redraw.
 */
var repaint = function(depth) {
	if(this.drawLayers[depth] == null) 
		return;
	drawLayers[depth].clear();

	// Draws each square of our grid
	switch(depth) {
	case 0:
		for(i = 0; i < cellsRow; i++) {
			for (j = 0; j < cellsColumn; j++) {
				drawLayers[depth].drawRect(cc.p(i * cellSize, j * cellSize), cc.p(i * cellSize + cellSize, j * cellSize + cellSize),cc.color(255,255,255), 
						4, 
						cc.color(0,0,0));
			}
		}
		break;
	case 1:
		for(i = 0; i < cellsRow; i++) {
			for (j = 0; j < cellsColumn; j++) {
				if (grid[i][j].isEmpty == true) {
					if (grid[i][j].gateID == null) {
						//drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(255,0,0));
					} else {
						drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(255,255,0));
					}
				} else {
					if (grid[i][j].unitID != null) {
						//drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(0,0,255));
					} else if (grid[i][j].shipID != null) {
						//drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(0,255,0));
					}
				}
			}
		}
		break;
	case 2:
		for(var t = 0; t < obstacleBoats.length; t++) {
			var temp = obstacleBoats[t];
			if (temp.orientation == 0) {
				drawLayers[depth].drawDot(cc.p((temp.frontPoint.x + (temp.length * .5)) * cellSize, (temp.frontPoint.y + .5) * cellSize) , 5, cc.color(0,0,0));
			} else if (temp.orientation == 1) {
				drawLayers[depth].drawDot(cc.p((temp.frontPoint.x + .5) * cellSize, (temp.frontPoint.y + (temp.length * .5)) * cellSize) , 5, cc.color(0,0,0));
			}
		}
		break;
	default:
		break;
	}
};

/**
 * Loops the repaint method at a set frameRate.
 */
var repaintLoop = function(kill) {	
	if (kill) {
		cc.log("NICKS");
		clearInterval(paintInterval);
		return;
	}
	paintInterval = setInterval(function() {
		repaint(1);
	}
	, gameVars.frameRate);
}

/**
 * Spawns a new unit (not 100% finished, only spawns in 1 spot). Spawns based off of time since
 * last spawn and the level's spawn time.
 * ref = The layer to spawn to.
 */
var spawnUnit = function(ref) {
	var attempts = cellsRow;
	gameVars.spawnCount += gameVars.unitSpeed;
	if (gameVars.spawnCount >= gameVars.spawnRate && gameVars.unitsLeft > 0) {
		while (!createUnit(cc.p(1 + (Math.floor(Math.random() * (3 - 0.00001)) * 2),0), 0, ref) && attempts > 0) {
			attempts--;
		}
		if (attempts <= 0) {
			gameVars.spawnCount = gameVars.spawnRate;
			return;
		}
		gameVars.spawnCount = 0;
		hud.updateBoatsLeft(--gameVars.unitsLeft);
	}
}

/**
 * Initializes the functions to create the units, the spawn loop, and the repaint method, in a loop.
 * ref = The layer to spawn to.
 */
var initUnitMovement = function(ref){
	var temp = setInterval(function() {
		if (gameVars.isPaused) {
			clearInterval(temp);
			repaintLoop(true);
		}
		if (checkGameFinished()) {
			clearInterval(temp);
			repaintLoop(true);
			cc.director.popScene();
		}
		if (gameVars.score > 0) {
			gameVars.score -= .2;
			hud.updateScore();
		} else {
			gameVars.score = 0;
		}
		updateUnits(ref);
		gameVars.realSpeed = ++gameVars.speedCount * (gameVars.unitSpeed / 1000);
		//hud.updateTime(gameVars.realSpeed);
		if (unitBoats.length < gameVars.unitsOnBoard)
		spawnUnit(ref);
		repaint(1);
	}
	, gameVars.unitSpeed);
};


var checkGameFinished = function() {
	if (unitBoats.length < 1 && gameVars.unitsLeft < 1) {
		//realSpeed
		var newData = new dataPack("Guest", Math.floor(gameVars.score), gameVars.difficulty, Math.round(gameVars.realSpeed));
		new sendCommand("DATA", newData);
		saveScore(newData);
		adjustDifficulty();
		return true;
	}
}

var handlePause = function() {
	if (!gameVars.isPaused) {
		gameVars.isPaused = true;
		return true;
	} else {
		gameVars.isPaused = false;
		initUnitMovement(gameVars.thisScene);
		repaintLoop(false);
		return false;
	}
}

var adjustDifficulty = function() {
	var diff = gameVars.difficulty;
	var up = gameVars.difficultyOffsetUp;
	var down = gameVars.difficultyOffsetDown;
	var score = gameVars.score;
	var avgScore = gameVars.unitsStart * (Math.round(diff / (10 + (diff / 20))) + (diff * (.8 + (diff / 500)))) ;
	cc.log(avgScore);
	if (score >= avgScore) {
		diff += up;
		if (up < 10) {
			up++;
			down--;
		}
	} else {
		diff -= down;		
		if (down < 10) {
			up--;
			down++;
		}
	}
	if (diff > 100)
		diff = 100;
	if (diff < 1)
		diff = 1;
	savePlayerData(new playerDataObj(diff, up, down));
}

/**
 * Loops through all units on the grid and updates their move depending on the direction assigned to them.
 * ref = The surface that is attempting to be updated. Needed for paint and sprite updating.
 */
var updateUnits = function(ref) {
	for (var i = 0; i < unitBoats.length; i++) {
		unitBoats[i].spawnTime++;
		var tempDir = unitBoats[i].direction;
		//Going through a gate check
		if (grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID != null && gridGates[grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID].direction == tempDir) {
			if (grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID == unitBoats[i].selfID) {
				grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
				grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
			}
			grid[unitBoats[i].point.x][unitBoats[i].point.y].isEmpty = true;
			grid[unitBoats[i].point.x][unitBoats[i].point.y].unitID = null;
			if (gridGates[grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID].gateID == unitBoats[i].gateID) {
				gameVars.unitsComplete++;
				hud.addScore(unitBoats[i].spawnTime);
			}
			unitAnimate(unitBoats[i].sprite, tempDir, true, true);
			deleteUnit(i, 1, ref);
			--i;
		} else {
			//Move forward
			if (tempDir == 0 && unitBoats[i].point.y < cellsColumn - 1 && (grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].isEmpty == true
					|| grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].unitID == unitBoats[i].selfID)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].isEmpty = false;
				grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].unitID = unitBoats[i].selfID;
				unitBoats[i].point.y += 1;
				unitAnimate(unitBoats[i].sprite, tempDir, true, false);
			//Move right
			} else if (tempDir == 1 && unitBoats[i].point.x < cellsRow - 1 && (grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].isEmpty == true
					|| grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].unitID == unitBoats[i].selfID)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].isEmpty = false;
				grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].unitID = unitBoats[i].selfID;
				unitBoats[i].point.x += 1;
				unitAnimate(unitBoats[i].sprite, tempDir, true, false);
			//Move down
			} else if (tempDir == 2 && unitBoats[i].point.y > 0 && (grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].isEmpty == true
					|| grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].unitID == unitBoats[i].selfID)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].isEmpty = false;
				grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].unitID = unitBoats[i].selfID;
				unitBoats[i].point.y -= 1;
				unitAnimate(unitBoats[i].sprite, tempDir, true, false);
			//Move left
			} else if (tempDir == 3 && unitBoats[i].point.x > 0 && (grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].isEmpty == true
					|| grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].unitID == unitBoats[i].selfID)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].isEmpty = false;
				grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].unitID = unitBoats[i].selfID;
				unitBoats[i].point.x -= 1;
				unitAnimate(unitBoats[i].sprite, tempDir, true, false);
			} else {
			//Don't move
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
					unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				}
			}
			if (unitBoats[i].dirChanged) {
				unitAnimate(unitBoats[i].sprite, tempDir, false, true);
				unitBoats[i].dirChanged = false;
			}
		}
	}
};

/**
 * Controls the visual animations of a unit, based on their direction. This is called by
 * the updateUnits() function when a move space is registered.
 * unit = The unit to reference.
 * direction = The direction the unit is moving to, to calulate rotation and move direction.
 */
var unitAnimate = function(unit, direction, move, rotate) {
	var action = null;
	var action2 = null;
	switch(direction) {
	case 0:
		if (move)
			action = cc.MoveBy.create(gameVars.unitSpeed/1000, cc.p(0, cellSize));
		if (rotate)
			action2 = cc.RotateTo.create(gameVars.unitSpeed/4000, 0);
		break;
	case 1:
		if (move)
			action = cc.MoveBy.create(gameVars.unitSpeed/1000, cc.p(cellSize, 0));
		if (rotate)
			action2 = cc.RotateTo.create(gameVars.unitSpeed/4000, 90);
		break;
	case 2:
		if (move)
			action = cc.MoveBy.create(gameVars.unitSpeed/1000, cc.p(0, -cellSize));
		if (rotate)
			action2 = cc.RotateTo.create(gameVars.unitSpeed/4000, 180);
		break;
	case 3:
		if (move)
			action = cc.MoveBy.create(gameVars.unitSpeed/1000, cc.p(-cellSize, 0));
		if (rotate)
			action2 = cc.RotateTo.create(gameVars.unitSpeed/4000, -90);
		break;
	default:
		break;
	}
	if (action != null)
		unit.runAction(action);
	if (action2 != null)
		unit.runAction(action2);
	
}

/**
 * Deletes and removes a unit from the grid, and removes the boat from the units on the 
 * grid array.
 * unitID = The unit id to remove.
 * ref = The surface being referenced to remove the sprite.
 */
var deleteUnit = function(unitIndex, stepsWait, ref) {
	removeUnitSprite(unitBoats[unitIndex].sprite, stepsWait, ref);
	
	for (var i = unitIndex; i < unitBoats.length - 1; i++) {
		unitBoats[i] = unitBoats[i + 1];
	}
	unitBoats.splice(unitBoats.length - 1, 1);
	
//	for (var i = 0; i < unitBoats.length - 1; i++) {
//		if (unitBoats[i] == null)
//			unitBoats.splice(i, 1);
//	}
	interaction = null;
	clickOffset = null;
	shipSelected = null;
	isUnitSelected = null;
}

/**
 * Removes a unit's sprite from the game scene after one cycle of a movement. 
 * This is here to delay the removal of a sprite so it appears that the unit
 * moves off the grid.
 * unitSprite = The unit's sprite to remove from the board.
 * ref = The the surface being referenced so the sprite can be removed.
 */
var removeUnitSprite = function(unitSprite, stepsWait, ref) {
	setTimeout(function(){
		ref.removeChild(unitSprite);
	}, gameVars.unitSpeed * stepsWait);
}

/**
 * A cell on the game board. Each cell holds data on what is on it's spot, and the cells
 * location, and if the cell is empty, or is a gate.
 */
var Cell = function() {
	isEmpty: null;
	xPos: null;
	yPos: null;
	shipID: null;
	unitID: null;
	gateID: null;
}

/**
 * A gate object. The id of the gate created gets placed on a cell where a gate should be.
 * The gate holds data on what type of boat and which direction the boat should enter it to
 * be accepted.
 */
var Gate = function() {
	position: null;
	direction: null;
	gateID: null;
}

/**
 * An object that holds the data of an obstacle ship on the grid. Holds the data
 * of where the ship occupies, the orientation, the length, and the sprite of the
 * obstacle.
 */
var ShipObstacle = function() {
	length: null;
	orientation: null;
	frontPoint: null;
	backPoint: null;
	origin: null;
	sprite: null;
}

/**
 * Holds the data of a unit ship. A unit ship is a 1x1 ship that the player must control
 * to complete the game. The object holds data of the spot it is and was on, the direction,
 * color, weight (for gate detection), and sprite of the unit.
 */
var ShipUnit = function() {
	// direction of movement. 0 = up, 1 = right, 2 = down, 3 = left
	selfID: null;
	direction: null;
	point: null;
	pointLast: null;
	origin: null;
	sprite: null;
	gateID: null;
	spawnTime: null;
	dirChanged: null;
}

/**
 * An object that holds the data of a click and drag across the game board. Used to keep track
 * of a swipe.
 */
var dragMovement = function() {
	pointClicked: null;
	pointCurrent: null;
}

/**
 * Holds necessary variables for the game, which would be used outside of the game. Such as score
 * on the level, game speed, maximum frames, how many to spawn, and how quickly new boats spawn.
 */
var gameVariables = function() {
	score: null;
	unitsLeft: null;
	unitsComplete: null;
	unitsStart: null;
	unitSpeed: null;
	frameRate: null;
	spawnCount: null;
	spawnRate: null;
	difficulty: null;
	difficultyOffsetUp: null;
	difficultyOffsetDown: null;
	unitsOnBoard: null;
	isPaused: null;
	thisScene: null;
	speedCount: null;
	realSpeed: null;
}
