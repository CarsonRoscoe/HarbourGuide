//The layer which holds the core gameplay.
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

	// Constructor for GameLayer
	ctor:function () {
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
		gameVars = new gameVars();
		gameVars.score = 0;
		gameVars.unitSpeed = 1000;
		gameVars.frameRate = 16;
		gameVars.spawnCount = 0;
		gameVars.spawnRate = 12;
		
		createGates();

		initUnitMovement(this);
		createLevel(50, this);
		
		createUnit(cc.p(4,0), 0, this);

		initPaint(this);
		initPaint(this);
		initPaint(this);
		repaintLoop();
		
			
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				mouseDown: null,
				mouseUp: null,
				clickOffset: null,
				shipSelected: null,
				isUnitSelected: null,
				relativeX: null,
				relativeY: null,

				//When the mouse(or touch screen) is clicked/tapped.
				onMouseDown: function(event) {
					if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
						clickOffset = null;
						mouseDown = event.getLocation();
						mouseDown.y -= boardGlobY;
						mouseDown.x -= boardGlobX;
						if (mouseDown.x >= boardGlobX && mouseDown.x <= (cellSize * cellsRow)
								&& mouseDown.y >= 0 && mouseDown.y <= (cellSize * cellsColumn)) {
							interaction = new dragMovement();
							interaction.pointClicked = mouseDown;
							shipSelected = grid[Math.floor(interaction.pointClicked.x / cellSize)][Math.floor(interaction.pointClicked.y / cellSize)].shipID;
							if (shipSelected == null) {
								shipSelected = grid[Math.floor(interaction.pointClicked.x / cellSize)][Math.floor(interaction.pointClicked.y / cellSize)].unitID;
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
					}
				},

				//When the mouse(or touch screen) is released.
				onMouseUp: function(event) {
					if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
						interaction = null;
						clickOffset = null;
						shipSelected = null;
						isUnitSelected = null;
					}
				},
				
				//When the mouse(or touch screen) is moving/dragging.
				onMouseMove: function(event) {
					if (interaction != null) {
						var action = null;
						mouseUp = event.getLocation();
						mouseUp.y -= boardGlobY;
						mouseUp.x -= boardGlobX;
						interaction.pointCurrent = mouseUp;
						if (shipSelected != null && isUnitSelected == false) {
							var clickY = Math.floor(interaction.pointClicked.y / cellSize);
							var clickX = Math.floor(interaction.pointClicked.x / cellSize);
							var curY = Math.floor(interaction.pointCurrent.y / cellSize);
							var curX = Math.floor(interaction.pointCurrent.x / cellSize);
							
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
							
						} else if (shipSelected != null && isUnitSelected == true) {
							var clickY = interaction.pointClicked.y;
							var clickX = interaction.pointClicked.x;
							var curY = interaction.pointCurrent.y;
							var curX = interaction.pointCurrent.x;
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
						}
					}
				}
			}, this);

			this.runAction(cc.Place.create(cc.p(boardGlobX, boardGlobY)));
			

		return true;
	}
});

//Creation function of the games which check if the user is sending boats
//to the appropriate places.
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
	
	gridGates[0].color = 0;
	gridGates[1].color = 0;
	gridGates[2].color = 0;
	gridGates[3].color = 1;
	gridGates[4].color = 1;
	gridGates[5].color = 1;
	gridGates[6].color = 2;
	gridGates[7].color = 2;
	gridGates[8].color = 2;
	
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


var realignBoats = function() {	
	
	for (var i = 0; i < obstacleBoats.length; i++) {
		if (obstacleBoats[i].orientation == 0) {
			var action = cc.Place.create(.5, cc.p((obstacleBoats[i].frontPoint.x + (obstacleBoats[i].length * .5)) * cellSize, (obstacleBoats[i].frontPoint.y + .5) * cellSize));
		} else {
			var action = cc.Place.create(.5, cc.p((obstacleBoats[i].frontPoint.x + .5) * cellSize, (obstacleBoats[i].frontPoint.y + (obstacleBoats[i].length * .5)) * cellSize));
		}
		obstacleBoats[i].sprite.runAction(action);
	}
};

// Function which create our grid given the amount of rows
// and columns
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

/*
 * front = (cc.p) the front point of the boat back = (cc.p) the back point of
 * the boat orient = (int)orientation. 0 = horizontal, 1 = vertical. size =
 * (int) the amount of spaces this boat will take up.
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
		ship.sprite = new cc.Sprite.create(res.ObstacleSmall_png);
		break;
	case 3:
		ship.sprite = new cc.Sprite.create(res.ObstacleMedium_png);
		break;
	case 4:
		ship.sprite = new cc.Sprite.create(res.ObstacleLarge_png);
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

//Function called when creating a unit to send to the gates.
var createUnit = function(startPoint, direction, ref) {
	if (grid[startPoint.x][startPoint.y].isEmpty == false) {
		return false;
	}
	var unit = new ShipUnit();
	unit.color = Math.floor(Math.random()*3);
	unit.direction = direction;
	unit.point = startPoint;
	unit.pointLast = cc.p(startPoint.x, startPoint.y);
	unit.sprite = new cc.Sprite.create(res.UnitSprite_png);
	unit.sprite.setAnchorPoint(.5, .5);
	unit.sprite.setPosition(cc.p((startPoint.x + .5) * cellSize, (startPoint.y + .5) * cellSize));
	switch(unit.color) {
		case 0:
		unit.sprite.color = cc.color(255, 0, 0);
		break;
		case 1:
		unit.sprite.color = cc.color(0, 255, 0);
		break;
		case 2:
		unit.sprite.color = cc.color(0, 0, 255);
		break;
		default:
		unit.sprite.color = cc.colour(255, 0, 255);
		unit.color = 0;
		cc.log("Error: White boat");
	}
	
	ref.addChild(unit.sprite, 100);
	unitBoats[unitBoats.length] = unit;

	grid[startPoint.x][startPoint.y].isEmpty = false;
	grid[startPoint.x][startPoint.y].unitID = unitBoats.length - 1;


};

//Checks that the ship being created is in a valid position on the grid.
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

//Generates the obstacles on the grid given a set difficulty.
var createLevel = function(difficulty, ref) {
	var lengths = [];
	lengths[0] = 100 - (difficulty / 2);
	lengths[1] = 100 - lengths[0];
	lengths[2] = lengths[1] / 4;
	lengths[1] = lengths[2] * 3;
	lengths[0] += lengths[1] + lengths[2];
	lengths[1] += lengths[2];
	var spawns = Math.ceil((difficulty + Math.round(Math.random() * (Math.round(Math.random() * 20)))) / 10);
	while(spawns != null && spawns > 0) {
		var orientation = Math.round(Math.random());
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
			if (createBoat(cc.p(xx, yy), cc.p(xx ,yy + length), 1, ref)) {
				spawns--;
			}
		}
	}
};

//Initial paint function which sets up everything for repainting.
var initPaint = function(ref) {
	// Set draw to be our surface to draw to
	drawLayers[drawLayers.length] = new cc.DrawNode();

	ref.addChild(drawLayers[drawLayers.length - 1]);

	repaint(drawLayers.length - 1);
};

//Repaints the screen. There are 3 depths to seperate what is being repainted,
//as to not waste power repainting stuff that should not need to be repainted.
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
						drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(255,0,0));
					} else {
						drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(255,255,0));
					}
				} else {
					if (grid[i][j].unitID != null) {
						drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(0,0,255));
					} else if (grid[i][j].shipID != null) {
						drawLayers[depth].drawDot(cc.p(grid[i][j].xPos, grid[i][j].yPos), 45, cc.color(0,255,0));
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

//Loops the repainting method at the given framefrate.
var repaintLoop = function() {
	var temp = setInterval(function() {
		repaint(1);
	}
	, gameVars.frameRate);
}

//Checks if enough turns have passed to spawn a unit, and if it has, spawns it.
var spawnUnit = function(ref) {
	if (++gameVars.spawnCount == gameVars.spawnRate) {
		createUnit(cc.p(4,0), 0, ref);
		gameVars.spawnCount = 0;
	}
}

//Controls when we update units movements, repaint units and call the spawn
//methods.
var initUnitMovement = function(ref){
	var temp = setInterval(function() {
			updateUnits(ref);
			spawnUnit(ref);
			repaint(1);
		}
	, gameVars.unitSpeed);
};

//Updates the units position on the grid.
var updateUnits = function(ref) {
	for (var i = 0; i < unitBoats.length; i++) {
		var tempDir = unitBoats[i].direction;
		if (grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID != null && gridGates[grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID].direction == tempDir) {
			grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
			grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
			grid[unitBoats[i].point.x][unitBoats[i].point.y].isEmpty = true;
			grid[unitBoats[i].point.x][unitBoats[i].point.y].unitID = null;
			if (gridGates[grid[unitBoats[i].point.x][unitBoats[i].point.y].gateID].color == unitBoats[i].color)
				cc.log(++gameVars.score);
			unitAnimate(unitBoats[i].sprite, tempDir);
			deleteUnit(unitBoats[i], ref);
		} else {
			if (tempDir == 0 && unitBoats[i].point.y < cellsColumn - 1 && (grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].isEmpty == true
					|| grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].unitID == i)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].isEmpty = false;
				grid[unitBoats[i].point.x][unitBoats[i].point.y + 1].unitID = i;
				unitBoats[i].point.y += 1;
				unitAnimate(unitBoats[i].sprite, tempDir);
			} else if (tempDir == 1 && unitBoats[i].point.x < cellsRow - 1 && (grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].isEmpty == true
					|| grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].unitID == i)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].isEmpty = false;
				grid[unitBoats[i].point.x + 1][unitBoats[i].point.y].unitID = i;
				unitBoats[i].point.x += 1;
				unitAnimate(unitBoats[i].sprite, tempDir);
			} else if (tempDir == 2 && unitBoats[i].point.y > 0 && (grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].isEmpty == true
					|| grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].unitID == i)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].isEmpty = false;
				grid[unitBoats[i].point.x][unitBoats[i].point.y - 1].unitID = i;
				unitBoats[i].point.y -= 1;
				unitAnimate(unitBoats[i].sprite, tempDir);
			} else if (tempDir == 3 && unitBoats[i].point.x > 0 && (grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].isEmpty == true
					|| grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].unitID == i)) {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
				unitBoats[i].pointLast = cc.p(unitBoats[i].point.x,unitBoats[i].point.y);
				grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].isEmpty = false;
				grid[unitBoats[i].point.x - 1][unitBoats[i].point.y].unitID = i;
				unitBoats[i].point.x -= 1;
				unitAnimate(unitBoats[i].sprite, tempDir);
			} else {
				if (unitBoats[i].pointLast.x != unitBoats[i].point.x || unitBoats[i].pointLast.y != unitBoats[i].point.y) {
					cc.log("HERE");
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].isEmpty = true;
					grid[unitBoats[i].pointLast.x][unitBoats[i].pointLast.y].unitID = null;
				}
			}
		}
	}
};

//Controls the visual animations of the units on the grid.
var unitAnimate = function(unit, direction) {
	var action = null;
	var action2 = null;
	switch(direction) {
	case 0:
		action = cc.MoveBy.create(1, cc.p(0, cellSize));
		action2 = cc.RotateTo.create(.25, 0);
		break;
	case 1:
		action = cc.MoveBy.create(1, cc.p(cellSize, 0));
		action2 = cc.RotateTo.create(.25, 90);
		break;
	case 2:
		action = cc.MoveBy.create(1, cc.p(0, -cellSize));
		action2 = cc.RotateTo.create(.25, 180);
		break;
	case 3:
		action = cc.MoveBy.create(1, cc.p(-cellSize, 0));
		action2 = cc.RotateTo.create(.25, -90);
		break;
	default:
		break;
	}
	if (action != null)
		unit.runAction(action);
	if (action2 != null)
		unit.runAction(action2);
	
}

//Deletes the unit once it has gone off the scree.
var deleteUnit = function(unitID, ref) {
	var index = 0;
	for (var i = 0; i < unitBoats.length; i++) {
		if (unitBoats[i] == unitID) {
			index = i;
			removeUnitSprite(unitBoats[i].sprite, ref);
			break;
		}
	}
	//for (var i = index; i < unitBoats.length - 1; i++) {
	//	unitBoats[i + 1] = unitBoats[i];
	//}
	//unitBoats.splice(unitBoats.length - 1, 1);
	for (var i = 0; i < unitBoats.length - 1; i++) {
		if (unitBoats[i] == null)
			unitBoats.splice(i, 1);
	}
	interaction = null;
	clickOffset = null;
	shipSelected = null;
	isUnitSelected = null;
}

//Removes the sprite of units once the unit is destroyed.
var removeUnitSprite = function(unitSprite, ref) {
	setTimeout(function(){
		ref.removeChild(unitSprite);
	}, gameVars.unitSpeed);
}

//Holds the data for each cell on the grid.
var Cell = function() {
	isEmpty: null;
	xPos: null;
	yPos: null;
	shipID: null;
	unitID: null;
	gateID: null;
}

//Holds the data for each gate on the grid.
var Gate = function() {
	position: null;
	direction: null;
	color: null;
	weight: null;
}

//Holds the data for each obstacle on the grid.
var ShipObstacle = function() {
	length: null;
	orientation: null;
	frontPoint: null;
	backPoint: null;
	origin: null;
	sprite: null;
}

//Holds the data for each ship unit on the grid.
var ShipUnit = function() {
	// direction of movement. 0 = up, 1 = right, 2 = down, 3 = left
	direction: null;
	point: null;
	pointLast: null;
	origin: null;
	sprite: null;
	color: null;
	weight: null;
}

//Allows us to easily keep track of which points have been clicked and are
//currently being clicked for user input.
var dragMovement = function() {
	pointClicked: null;
	pointCurrent: null;
}

//Controls the pseudo-global variables of our game.
var gameVars = function() {
	score: null;
	unitSpeed: null;
	frameRate: null;
	spawnCount: null;
	spawnRate: null;
}
