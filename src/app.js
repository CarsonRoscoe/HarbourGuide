//Program Starts Here
var GameLayer = cc.Layer.extend({
	//Instantiate variables to be used, all as null.
	sprite:null,
	cellsRow: null,
	cellsColumn: null,
	cellWidth: null,
	cellHeight: null,
	gridCells: null,
	grid: null,
	
	//Constructor for GameLayer
	ctor:function () {
		//Super init first
		this._super();
		
		//Give variables their values assuming 7x9 grid.
		cellsRow = 7;
		cellsColumn = 9;
		cellWidth = cc.winSize.width / cellsRow;
		cellHeight = cc.winSize.height / cellsColumn;
		gridCells = cellsRow * cellsColumn;
		
		//Set draw to be our surface to draw to
		var draw = cc.DrawNode.create();
		
		//Add our draw to the surface
		this.addChild(draw, 100);
		//Clear draw of old data(if any), prepare for adding stuff to draw.
		draw.clear();
		
		// Function to initiate our grid
		var initGrid = function() {
			//Calls the createGrid function
			grid = createGrid();
			//Draws each square of our grid
			for (i = 0; i < gridCells; i++) {
				draw.drawRect(cc.p(cellWidth * (i % cellsRow), Math.floor(i / cellsRow) * cellHeight), cc.p(cellWidth * (i % cellsRow) + cellWidth, (Math.floor(i / cellsRow) * cellHeight + cellHeight)), 
						cc.color(255,255,255), 4, cc.color(0,0,0));
				
			}
		}
		
		//Calls the initGrid function created above.
		initGrid();
		
		return true;
	}
});

//Skeleton of each cell object of our grid.
var cell = {
		isEmpty: true,
		containsID: 0
}

//Function which create our grid given the amount of rows
//and columns
var createGrid = function() {
	var grid = [];
	for (i = 0; i < cellsColumn; i++) {
		grid[i] = new Array(cellsRow);
		for (j = 0; j < cellsRow; j++) {
			grid[i][j] = cell;
		}
	}
	return grid;
};

//GameScene objected created by main. Creates our GameLayer() ibject above.
var GameScene = cc.Scene.extend({
	onEnter:function () {
		this._super();
		var layer = new GameLayer();
		this.addChild(layer);
	}
});