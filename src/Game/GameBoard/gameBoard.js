var GameBoard = cc.Layer.extend({
	cellsRow: null,
	cellsColumn: null,
	cellWidth: null,
	cellHeight: null,
	gridCells: null,
	grid: null,
	cell: null,

// Function which create our grid given the amount of rows
// and columns
	createGrid: function() {
		var grid = [];
		for (i = 0; i < cellsColumn; i++) {
			grid[i] = new Array(cellsRow);
			for (j = 0; j < cellsRow; j++) {
				grid[i][j] = cell;
			}
		}
		return grid;
	},
	
	
	// Constructor for GameLayer
	ctor:function () {
		// Super init first
		this._super();
		
		
		cellsRow = 7;
		cellsColumn = 9;
		cellWidth = cc.winSize.width / cellsRow;
		cellHeight = cc.winSize.height / cellsColumn;
		gridCells = cellsRow * cellsColumn;
		cell = {
				isEmpty: true,
				containsID: 0
		};
		grid = this.createGrid();

		// Set draw to be our surface to draw to
		var draw = new cc.DrawNode();

		this.addChild(draw);

		// Clear draw of old data(if any), prepare for adding stuff to draw.
		draw.clear();

			// Draws each square of our grid
			for (i = 0; i < gridCells; i++) {
				draw.drawRect(cc.p(cellWidth * (i % cellsRow), Math.floor(i / cellsRow) * cellHeight), cc.p(cellWidth * (i % cellsRow) + cellWidth, (Math.floor(i / cellsRow) * cellHeight + cellHeight)), 
						cc.color(255,255,255), 4, cc.color(0,0,0));

		}

		return true;
	}
});
