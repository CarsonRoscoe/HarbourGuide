var GameBoard = cc.Layer.extend({
	cellsRow: null,
	cellsColumn: null,
	cellSize: null,
	gridCells: null,
	grid: null,
	obstacleBoats: null,
	boardGlobX: null,
	boardGlobY: null,

	// Function which create our grid given the amount of rows
	// and columns
	createGrid: function() {
		var grid = [];
		for (i = 0; i < cellsColumn; i++) {
			grid[i] = new Array(cellsRow);
			for (j = 0; j < cellsRow; j++) {
				grid[i][j] = new Cell();
				grid[i][j].xPos = cellSize * j + (cellSize / 2);
				grid[i][j].yPos = i * cellSize + (cellSize / 2);
			}
		}
		return grid;
	},
	
	/*
	 * front = (cc.p) the front point of the boat
	 * back = (cc.p) the back point of the boat
	 * orient = (int)orientation. 0 = horizontal, 1 = vertical.
	 * size = (int) the amount of spaces this boat will take up.
	 */
	createBoat: function(front, back, orient, size) {
		var ship = new ShipObstacle();
		ship.length = size;
		ship.orientation = orient;
		ship.frontPoint = front;
		ship.backPoint = back;
		
		
		obstacleBoats[obstacleBoats.length] = ship;
		
		
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
		
		cellsRow = 7;
		cellsColumn = 9;
		cellSize = cc.winSize.width / cellsRow;
		alert(cellSize);
		gridCells = cellsRow * cellsColumn;
		grid = this.createGrid();
		obstacleBoats = [];
		boardGlobX = 0;
		boardGlobY = (cc.winSize.height - cellsColumn * cellSize) / 2;

		// Set draw to be our surface to draw to
		var draw = new cc.DrawNode();

		this.addChild(draw);

		// Clear draw of old data(if any), prepare for adding stuff to draw.
		draw.clear();

			// Draws each square of our grid
			for (j = 0; j < cellsColumn; j++) {
				for(i = 0; i < cellsRow; i++) {
					draw.drawRect(cc.p(i * cellSize, j * cellSize), cc.p(i * cellSize + cellSize, j * cellSize + cellSize),cc.color(255,255,255), 
							4, 
							cc.color(0,0,0));
					draw.drawDot(cc.p(grid[j][i].xPos, grid[j][i].yPos), 5, cc.color(255,0,0))

				}
			}
			
			this.runAction(cc.Place.create(cc.p(boardGlobX, boardGlobY)));

		return true;
	}
});

var Cell = function() {
		isEmpty: true;
		xPos: null;
		yPos: null;
}

var ShipObstacle = function() {
	length: null;
	orientation: null;
	frontPoint: null;
	backPoint: null;
}
