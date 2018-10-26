/** 
	Coded by Sean Murren May 2016.
	Backtracking + explore cell with least possible valid values first

	Based on pseudocode referenced below.  The one major modification
	to the algorithm is instead of finding the next empty cell, my
	code checks all cells and tests which cell has the least possible
	valid values remaining.  This speeds up the backtracking runtime
	tremendously!  (prunes search space a lot)
	
------------------------------------------------------------------------------
http://stackoverflow.com/questions/18168503/recursively-solving-a-sudoku-puzzle-using-backtracking-theoretically

solve(game):
    if (game board is full)
        return SUCCESS
    else
        next_square = getNextEmptySquare()
        for each value that can legally be put in next_square
            put value in next_square (i.e. modify game state)
            if (solve(game)) return SUCCESS
            remove value from next_square (i.e. backtrack to a previous state)
    return FAILURE
------------------------------------------------------------------------------
*/


(function(){
	var app = angular.module('sudokuSolverApp', []);		

	app.controller('SudokuController', function() {
		
		this.status = "";
		
		this.Ssol = [null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null,
						  null,null,null,null,null,null,null,null,null];

		
		this.solve = function() {
			
			var next_empty_square;
			var next_square_legal_vals;
			var next_empty_squares_list = [];
			
			next_empty_squares_list = this.getNextEmptySquare();
			
			if (next_empty_squares_list == []) {
				return true;
			}
			
			else {
				
				next_square_legal_vals = this.getNextEmptySquareVals(next_empty_squares_list);
				next_empty_square = next_square_legal_vals.bestSquareCell;
				
				for (var i = 0; i < next_square_legal_vals.bestSquareVals.length; i++) {
					 
					this.Ssol[next_empty_square] = next_square_legal_vals.bestSquareVals[i];
					
					if (this.solve()) {
						return true;
					}
					
					this.Ssol[next_empty_square] = null;
				}
				
			}
			return false;
		}
		
		
		this.getNextEmptySquare = function() {
			
			var emptySquares = [];
			
			for (var i = 0; i < 81; i++) {
				if (this.Ssol[i] == null)
					emptySquares.push(i);
			}
			return emptySquares;
		}
		
		
		this.getNextEmptySquareVals = function(next_empty_squares_list) {
			
			var bestSquareCell = null;
			var bestSquareVals = null;
			var validNums;
			var valid;
			var row;
			var column;
			
			for (var k = 0; k < next_empty_squares_list.length; k++) {
				
				row = (next_empty_squares_list[k] / 9) >>> 0;
				if (row != 0)
					column = ((next_empty_squares_list[k] - 9*row)) >>> 0;
				else
					column = next_empty_squares_list[k];
				
				validNums = [];
				
				for (var N = 1; N <= 9; N++) {

					valid = true;

					for (var i = 0; i<9; i++) {
						if (valid == true && i != column) {
							if (this.Ssol[row*9 + i] == N)
								valid = false;	

						}
						if (valid == true && i != row) {	
							if (this.Ssol[i*9 + column] == N)
								valid = false;

						}
					}
					if (valid == true) {

						for (var i = 0; i<3; i++) {
							for (var j = 0; j<3; j++) {
								
								if (this.Ssol[((row/3 >> 0)*3+i)*9 + ((column/3 >> 0)*3+j)] == N)
									valid = false;
							}
						}
					}
					if (valid == true)
						validNums.push(N);
				}
				
				if (bestSquareVals == null) {
					bestSquareCell = next_empty_squares_list[k];
					bestSquareVals = validNums;
				}
				else {
					if (validNums.length < bestSquareVals.length) {
						bestSquareCell = next_empty_squares_list[k];
						bestSquareVals = validNums;
					}
				}
			}
			return {bestSquareCell:bestSquareCell, bestSquareVals:bestSquareVals};
		}
		
		
		this.validateInput = function() {
			
			var tempVal;
			var validInput = true;
			
			for (var i = 0; i < 81; i++) {
				if (isNaN(this.Ssol[i])) {
					validInput = false;
					break;
				}
			}
			
			if (validInput == true) {
				for (var i = 0; i < 9; i++) {
					tempVal = null;
					for (var j = 0; j < 9; j++) {
						if (this.Ssol[i*9 + j] != null) {
							if (tempVal == null)
								tempVal = this.Ssol[i*9 + j];
							else {
								if (this.Ssol[i*9 + j] == tempVal)
									validInput = false;
							}
						}
					}
				}

				for (var i = 0; i < 9; i++) {
					tempVal = null;
					for (var j = 0; j < 9; j++) {
						if (this.Ssol[j*9 + i] != null) {
							if (tempVal == null)
								tempVal = this.Ssol[j*9 + i];
							else {
								if (this.Ssol[j*9 + i] == tempVal)
									validInput = false;
							}
						}
					}
				}

				for (var block = 0; block < 9; block++) {
					tempVal = null;
					for (var i = 0; i<3; i++) {
						for (var j = 0; j<3; j++) {
							if (tempVal == null)
								tempVal = this.Ssol[(block+i)*9 + j];
							else {
								if (this.Ssol[(block+i)*9 + j] == tempVal)
									validInput = false;
							}
						}
					}
				}
			}
			if (validInput)
				this.solve();
			else
				this.status = "Invalid Input!";
		}
		
		
		this.resetSudoku = function() {
			this.Ssol = [null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null,
							null,null,null,null,null,null,null,null,null];
		}
		
		
	});
	
	app.filter('range', function() {
		
		return function(input, total) {
			
			total = parseInt(total);

			for (var i=0; i<total; i++) {
				input.push(i*9);
			}
			return input;
		};
	});
	
	
})();
