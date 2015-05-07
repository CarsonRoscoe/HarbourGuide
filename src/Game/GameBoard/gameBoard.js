var GameBoard = cc.Layer.extend({
	cellsRow: null,
	cellsColumn: null,
	cellSize: null,
	gridCells: null,
	grid: null,
	obstacleBoats: null,
	boardGlobX: null,
	boardGlobY: null,
	interaction: null,
	drawObject: null,
	unitBoats: null,

	// Function which create our grid given the amount of rows
	// and columns
	createGrid: function() {
		var grid = [];
		for (i = 0; i < cellsColumn; i++) {
			grid[i] = new Array(cellsRow);
			for (j = 0; j < cellsRow; j++) {
				grid[i][j] = new Cell();
				grid[i][j].isEmpty = true;
				grid[i][j].xPos = cellSize * j + (cellSize / 2);
				grid[i][j].yPos = i * cellSize + (cellSize / 2);
			}
		}
		return grid;
	},
	
	/*
	 * front = (cc.p) the front point of the boat back = (cc.p) the back point
	 * of the boat orient = (int)orientation. 0 = horizontal, 1 = vertical. size =
	 * (int) the amount of spaces this boat will take up.
	 */
	createBoat: function(front, back, orient) {
		var ship = new ShipObstacle();
		ship.length = Math.abs((front.x - back.x) + (front.y - back.y));
		ship.orientation = orient;
		ship.frontPoint = front;
		ship.backPoint = back;	
		if (this.validateShip(ship)) {
			obstacleBoats[obstacleBoats.length] = ship;
		} else {
			return false;
		}

		if (orient == 0 && front.y == back.y) {
			for(var i = front.x; i <= back.x; i++) {
				if (i == front.x) {
					grid[front.y][i].origin = front;
				}
				grid[front.y][i].isEmpty = false;
				grid[front.y][i].shipID = obstacleBoats.length - 1;
			}
		} else if (orient == 1 && front.x == back.x) {
			for(var i = front.y; i <= back.y; i++) {
				if (i == front.y) {
					grid[i][front.x].origin = front;
				}
				grid[i][front.x].isEmpty = false;
				grid[i][front.x].shipID = obstacleBoats.length - 1;
			}
		}
		
		
		obstacleBoats[obstacleBoats.length] = ship;
		
	},
	
	moveUnit: function() {
		var i = 0;
		for (i = 0; i < unitBoats.length; i++) {
			switch(unitBoats[i].oriengatation) {
			case "Up": 
				unitBoats[i].point = cc.p(unitBoats[i].point.x, unitBoats[i].point.y);
				break;
			}
		}
	},
	
	createUnit: function(startPoint) {
		var unit = new ShipUnit();
		unit.length = 1;
		unit.orientation = "Up";
		unit.point = startPoint;
		
		grid[startPoint.y][startPoint.x].isEmpty = false;
		grid[startPoint.y][startPoint.x].shipID = unitBoats.length - 1;

		unitBoats[unitBoats.length] = unit;
	},
	
	
	validateShip: function(ship) {
		if (ship.frontPoint.x >= 0 && ship.frontPoint.x <= cellsRow
				&& ship.frontPoint.y >= 0 && ship.frontPoint.y <= cellsColumn
				&& ship.backPoint.x >= 0 && ship.backPoint.x <= cellsRow
				&& ship.backPoint.y >= 0 && ship.backPoint.y <= cellsColumn
				&& ((ship.orientation == 0 && ship.frontPoint.y == ship.backPoint.y)
				|| (ship.orientation == 1 && ship.frontPoint.x == ship.backPoint.x))) {
			return true;
		} else {
			return false;
		}
	},
	
	
	// Constructor for GameLayer
	ctor:function () {
		// Super init first
		this._super();
		
		clicking = false;
		
		cc.eventManager.addListener({
			event: cc.EventListener.MOUSE,
			clicking: false,
			
			onMouseDown: function(event) {
				if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
					clicking = true;
				}
			},
		
			onMouseUp: function(event) {
				if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
					clicking = false;
				}
			},
				
			onMouseMove: function(event) {
				if (clicking)
					cc.log(event.getLocation().x);
			}
		}, this);
		
		//origin/master
		cellsRow = 7;
		cellsColumn = 9;
		cellSize = cc.winSize.width / cellsRow;
		alert(cellSize);
		gridCells = cellsRow * cellsColumn;
		grid = this.createGrid();
		obstacleBoats = [];
		unitBoats = [];
		boardGlobX = 0;
		boardGlobY = (cc.winSize.height - cellsColumn * cellSize) / 2;
		interaction = null;

		this.createBoat(cc.p(0,0), cc.p(2,0), 0);
		this.createBoat(cc.p(4,3), cc.p(4,4), 1);
		this.createBoat(cc.p(3,6), cc.p(4,6), 0);
		this.createUnit(cc.p(3,0));

		var temp = setInterval(function(){
			var i = 0;
			for (i = 0; i < unitBoats.length; i++) {
				switch(unitBoats[i].orientation) {
				case "Up": 
					unitBoats[i].point = cc.p(unitBoats[i].point.x, unitBoats[i].point.y);
					break;
				}
			}
		}, 1000);
		
		// Set draw to be our surface to draw to
		drawObject = new cc.DrawNode();

		this.addChild(drawObject);

		// Clear draw of old data(if any), prepare for adding stuff to draw.
		drawObject.clear();

			// Draws each square of our grid
			for (j = 0; j < cellsColumn; j++) {
				for(i = 0; i < cellsRow; i++) {
					drawObject.drawRect(cc.p(i * cellSize, j * cellSize), cc.p(i * cellSize + cellSize, j * cellSize + cellSize),cc.color(255,255,255), 
							4, 
							cc.color(0,0,0));
					if (grid[j][i].isEmpty == true) {
						drawObject.drawDot(cc.p(grid[j][i].xPos, grid[j][i].yPos), 25, cc.color(255,0,0))
					} else {
						drawObject.drawDot(cc.p(grid[j][i].xPos, grid[j][i].yPos), 25, cc.color(0,0,255))
					}

				}
			}
			
			
			cc.eventManager.addListener({
				event: cc.EventListener.MOUSE,
				mouseDown: null,
				mouseUp: null,
				clickOffset: null,
				shipSelected: null,

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
							shipSelected = grid[Math.floor(interaction.pointClicked.y / cellSize)][Math.floor(interaction.pointClicked.x / cellSize)].shipID;
						}
					}
				},

				onMouseUp: function(event) {
					if (event.getButton() == cc.EventMouse.BUTTON_LEFT) {
						interaction = null;
						clickOffset = null;
						shipSelected = null;
					}
				},
				
				onMouseMove: function(event) {
					if (interaction != null) {
						mouseUp = event.getLocation();
						mouseUp.y -= boardGlobY;
						mouseUp.x -= boardGlobX;
						interaction.pointCurrent = mouseUp;
						if (shipSelected != null) {
							var clickY = Math.floor(interaction.pointClicked.y / cellSize);
							var clickX = Math.floor(interaction.pointClicked.x / cellSize);
							var curY = Math.floor(interaction.pointCurrent.y / cellSize);
							var curX = Math.floor(interaction.pointCurrent.x / cellSize);
							if (obstacleBoats[shipSelected].orientation == 0) {
								if (clickOffset == null) {
									clickOffset = obstacleBoats[shipSelected].backPoint.x - clickX;
								}
								if (clickX < curX && obstacleBoats[shipSelected].backPoint.x < cellsRow - 1
										&& curX - (obstacleBoats[shipSelected].backPoint.x - clickOffset) > 0 
										&& grid[clickY][obstacleBoats[shipSelected].backPoint.x + 1].isEmpty == true) {
									interaction.pointClicked.x = interaction.pointCurrent.x;
									
									grid[clickY][obstacleBoats[shipSelected].frontPoint.x].isEmpty = true;
									grid[clickY][obstacleBoats[shipSelected].frontPoint.x].shipID = null;

									grid[clickY][obstacleBoats[shipSelected].backPoint.x + 1].isEmpty = false;
									grid[clickY][obstacleBoats[shipSelected].backPoint.x + 1].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.x += 1;
									obstacleBoats[shipSelected].backPoint.x += 1;
									
								} else if (clickX > curX && obstacleBoats[shipSelected].frontPoint.x > 0
										&& curX - (obstacleBoats[shipSelected].frontPoint.x - (clickOffset - obstacleBoats[shipSelected].length)) < 0
										&& grid[clickY][obstacleBoats[shipSelected].frontPoint.x - 1].isEmpty == true) {
									interaction.pointClicked.x = interaction.pointCurrent.x;

									grid[clickY][obstacleBoats[shipSelected].backPoint.x].isEmpty = true;
									grid[clickY][obstacleBoats[shipSelected].backPoint.x].shipID = null;

									grid[clickY][obstacleBoats[shipSelected].frontPoint.x - 1].isEmpty = false;
									grid[clickY][obstacleBoats[shipSelected].frontPoint.x - 1].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.x -= 1;
									obstacleBoats[shipSelected].backPoint.x -= 1;

								}
							} else if (obstacleBoats[shipSelected].orientation == 1) {
								if (clickOffset == null) {
									clickOffset = obstacleBoats[shipSelected].backPoint.y - clickY;
								}
								if (clickY < curY && obstacleBoats[shipSelected].backPoint.y < cellsColumn - 1
										&& curY - (obstacleBoats[shipSelected].backPoint.y - clickOffset) > 0
										&& grid[obstacleBoats[shipSelected].backPoint.y + 1][clickX].isEmpty == true) {
									interaction.pointClicked.y = interaction.pointCurrent.y;

									grid[obstacleBoats[shipSelected].frontPoint.y][clickX].isEmpty = true;
									grid[obstacleBoats[shipSelected].frontPoint.y][clickX].shipID = null;

									grid[obstacleBoats[shipSelected].backPoint.y + 1][clickX].isEmpty = false;
									grid[obstacleBoats[shipSelected].backPoint.y + 1][clickX].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.y += 1;
									obstacleBoats[shipSelected].backPoint.y += 1;

								} else if (clickY > curY && obstacleBoats[shipSelected].frontPoint.y > 0
										&& curY - (obstacleBoats[shipSelected].frontPoint.y - (clickOffset - obstacleBoats[shipSelected].length)) < 0
										&& grid[obstacleBoats[shipSelected].frontPoint.y - 1][clickX].isEmpty == true) {
									interaction.pointClicked.y = interaction.pointCurrent.y;

									grid[obstacleBoats[shipSelected].backPoint.y][clickX].isEmpty = true;
									grid[obstacleBoats[shipSelected].backPoint.y][clickX].shipID = null;

									grid[obstacleBoats[shipSelected].frontPoint.y - 1][clickX].isEmpty = false;
									grid[obstacleBoats[shipSelected].frontPoint.y - 1][clickX].shipID = shipSelected;
									obstacleBoats[shipSelected].frontPoint.y -= 1;
									obstacleBoats[shipSelected].backPoint.y -= 1;

								}
							}
							
						}
					}
					drawObject.clear();

					// Draws each square of our grid
					for (j = 0; j < cellsColumn; j++) {
						for(i = 0; i < cellsRow; i++) {
							drawObject.drawRect(cc.p(i * cellSize, j * cellSize), cc.p(i * cellSize + cellSize, j * cellSize + cellSize),cc.color(255,255,255), 
									4, 
									cc.color(0,0,0));
							if (grid[j][i].isEmpty == true) {
								drawObject.drawDot(cc.p(grid[j][i].xPos, grid[j][i].yPos), 25, cc.color(255,0,0))
							} else {
								drawObject.drawDot(cc.p(grid[j][i].xPos, grid[j][i].yPos), 25, cc.color(0,0,255))
							}

						}
					}
				}
			}, this);

			this.runAction(cc.Place.create(cc.p(boardGlobX, boardGlobY)));
			

		return true;
	}
});

var Cell = function() {
		isEmpty: null;
		xPos: null;
		yPos: null;
		shipID: null;
}

var ShipObstacle = function() {
	length: null;
	orientation: null;
	frontPoint: null;
	backPoint: null;
	origin: null;
}

var ShipUnit = function() {
	length: null;
	oriengation: null;
	point: null;
	origin: null;
}

var dragMovement = function() {
	pointClicked: null;
	pointCurrent: null;
}
