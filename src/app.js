/*used to dynamically calculate the grid sizes.*/
var window = cc.winSize;

/*The amount of cells in row */
var cellsRow = 7;

/*The amount of cells in a column */
var cellsColumn = 9;

/* the pixel width of a cell*/
var cellWidth = window.width / cellsRow;

/* the pixel height of a cell */
var cellHeight = window.height / cellsColumn;

/*The amount of cells in the entire grid */
var gridCells = cellsRow * cellsColumn;

/*The object, cell. Contains data for a cell.
		Used as a spot in the grid. */
var cell= {
		isEmpty: true,
		containsID: 0
};

/* Creates a grid of cells based off of varaibles above. */
function createGrid() {
	var grid = [];
	for (i = 0; i < cellsColumn; i++) {
		grid[i] = new Array(cellsRow);
		for (j = 0; j < cellsRow; j++) {
			grid[i][j] = cell;
		}
	}
	return grid;
};

/* Gets the canvas to draw to. */
function getCanvas() {
	var c = document.getElementById("gameCanvas");
	var ctx = c.getContext("2d");
	return ctx;
};




var GameLayer = cc.Layer.extend({
	grid:null,
	
	
	initGrid:function() {
		grid = createGrid();
		var draw = cc.DrawNode.create();
		this.addChild(this.draw, 100);
		for (i = 0; i < gridCells; i++) {
			this.draw.drawRect(cc.p(i % cellsRow, Math.floor(i / cellsColumn)), cc.p(i % cellsRow + cellWidth, Math.floor(i / cellsColumn) + cellHeight), cc.Color(255,255,255,1), 4, cc.Color(255,255,255,1));
		}
	},
	ctor:function () {
		this._super();
		this.initGrid();

		return true;
	}


});

var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
	}
});

