var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");
var scoreDisplayer = document.getElementById("scoreDisplay");
var sizeDisplayer = document.getElementById("sizeDisplay");
var speedDisplayer = document.getElementById("speedDisplay");

var size = 20;
var rightPressed = false;
var leftPressed = false;
var upPressed = false;
var downPressed = false;
var keyChangeAllowed = true;
var score = 0;
var drawFrequency = 5;
var drawCounter = 0;
var gameStart = false;


// INITIALIZE 2D GRID
var gridLength = parseInt(canvas.width / size);
var gridHeight = parseInt(canvas.height / size);
var grid = new Array(gridLength);
initGrid();


//INITIALIZE SNAKE
var snakeX = parseInt(gridLength/2);   // snake current head x
var snakeY = parseInt(gridHeight/2);   // snake current head y
var snakeTail = [];  					  // snake's current tail [x, y] list
var growSnake = false;					  // used for when to add +1 length to snake
var snakeStartLength = 6;				  // how long the snake starts out
initSnake();


// EVENT LISTENER
document.addEventListener("keydown", keyDownHandler, false);


function initGrid() {
	
	for (var i=0; i < grid.length; i++) {
	
		var gridYarray = new Array(gridHeight);
		grid[i] = gridYarray;

		for (var j=0; j < gridYarray.length; j++) {
			
			setGrid(i, j, "empty", "#FFFFFF", null, null);
		}
	}
}


function initSnake() {
	
	for (var i=0; i < snakeStartLength; i++) {

		if (i != 0)
			// no need to set prevSnake initially
			setGrid(snakeX-i, snakeY, "snake", "#0095DD", null, [snakeX - i + 1, snakeY]);
		else
			setGrid(snakeX-i, snakeY, "snake", "#0095DD", null, null);
	}
	snakeTail = [snakeX - snakeStartLength + 1, snakeY];
}


// Sets single grid point
function setGrid(xVal, yVal, typeVal, colorVal, prevSnakeVal, nextSnakeVal) {
	
	grid[xVal][yVal] = {
							  type:typeVal, 
							  color:colorVal, 
							  prevSnake:prevSnakeVal, 
							  nextSnake:nextSnakeVal 
							};
}


function keyDownHandler(e) {

	// prevent default behavior of arrow/space keys
	if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1)
		e.preventDefault();
	
	if (keyChangeAllowed) {
	
		keyChangeAllowed = false;
		
		if (e.keyCode == 39 && rightPressed == false && leftPressed == false) {
			rightPressed = true;
			upPressed = false;
			downPressed = false;
		}
		else if (e.keyCode == 37 && leftPressed == false && rightPressed == false && gameStart == true) {
			leftPressed = true;
			upPressed = false;
			downPressed = false;
		}
		else if (e.keyCode == 38 && upPressed == false && downPressed == false) {
			upPressed = true;
			rightPressed = false;
			leftPressed = false;
		}
		else if (e.keyCode == 40 && downPressed == false && upPressed == false) {
			downPressed = true;
			rightPressed = false;
			leftPressed = false;
		}
		else if (e.keyCode == 32)
			alert("Game Paused");
		else
			keyChangeAllowed = true;
		
		if (!gameStart && e.keyCode != 37)
			gameStart = true;
	}
}


function collisionDetection() {
	
	var ateSpecial = false;
	
	if (snakeX == -1 ||
		  snakeX == gridLength ||
		  snakeY == -1 ||
		  snakeY == gridHeight ||
		  grid[snakeX][snakeY].type == "snake") 
	 {
		endGame();
	 }
	else if (grid[snakeX][snakeY].type == "food") {
		score += 1;
		growSnake = true;
	}
	else if (grid[snakeX][snakeY].type == "special food") {
		ateSpecial = true;
		score += 1;
	}
	else if (grid[snakeX][snakeY].type == "edible snake") {
		var prevSnakeXY = grid[snakeX][snakeY].prevSnake;
		var nextSnakeXY = grid[snakeX][snakeY].nextSnake;
		
		grid[prevSnakeXY[0]][prevSnakeXY[1]].nextSnake = nextSnakeXY;
		score += 5;	
	}
	return ateSpecial;
}


function displayScore() {
	scoreDisplayer.innerHTML = "Score: " + score;	
}


function toggleSize() {
	size += 5;
	if (size > 40)
		size = 5;
	
	sizeDisplayer.innerHTML = size;
	
	gridLength = parseInt(canvas.width / size);
	gridHeight = parseInt(canvas.height / size);
	grid = new Array(gridLength);
	initGrid();
	snakeX = parseInt(gridLength/2);
	snakeY = parseInt(gridHeight/2);
	initSnake();
	dropFood();
	drawAll();
}


function toggleSpeed() {
	drawFrequency += 1;
	if (drawFrequency > 10)
		drawFrequency = 1;
	speedDisplayer.innerHTML = drawFrequency;
}


function endGame() {
	alert("GAME OVER\n  SCORE:"+score);
	document.location.reload();
}


function dropFood() {
	
	var success = false;
	var counter = 0;
	var x;
	var y;
	var special = Math.floor((Math.random() * 12 + 1));
	
	while (!success && counter < 20) {
		
		x = Math.floor((Math.random() * gridLength));
		y = Math.floor((Math.random() * gridHeight));
		
		if (grid[x][y].type == "empty") {
			
			if (special == 1) {
				setGrid(x, y, "special food", "#F400A1", null, null);
			}
			else {
				setGrid(x, y, "food", "#7FFF00", null, null);
			}
			
			drawGridpoint(x, y);
			
			success = true;
		}
		else
			counter += 1;
	}
}


function drawAll() {
	
	sizeDisplayer.innerHTML = size;
	speedDisplayer.innerHTML = drawFrequency;
	
	ctx.clearRect(0, 0, canvas.width, canvas.height);
	
	for (var i = 0; i < gridLength; i ++) {
		for (var j = 0; j < gridHeight; j ++) {
			if (grid[i][j].type != "empty") {
				drawGridpoint(i, j);
			}
		}
	}
}


function drawSnake() {
	// tail
	drawGridpoint(snakeTail[0], snakeTail[1]);
	// head
	drawGridpoint(snakeX, snakeY);
}


function updateSnakePosition() {
	
	if(rightPressed) {
		snakeX += 1;
	}
	else if(leftPressed) {
		snakeX -= 1;
	}
	else if(upPressed) {
		snakeY -= 1;
	}
	else if(downPressed) {
		snakeY += 1;
	}
}


function drawGridpoint(xVal, yVal) {
	ctx.beginPath();
	ctx.rect(size * xVal, size * yVal, size - 2, size - 2);
	ctx.fillStyle = grid[xVal][yVal].color;
	ctx.fill();
	ctx.closePath();
}


function draw() {
	
	if (drawCounter == drawFrequency) {
		
		var oldHeadX = snakeX;
		var oldHeadY = snakeY;
		var newTail = [];
		
		updateSnakePosition();  // check if keyboard keys pressed, move in that direction
		

		if (oldHeadX != snakeX || oldHeadY != snakeY) {
			
			// set previous snake head's nextSnake property
			grid[oldHeadX][oldHeadY].nextSnake = [snakeX, snakeY];
			// test for collisions with self, food, or walls
			var makeEdible = collisionDetection();
			
			// make head edible snake type if tail is that type or just ate special food
			if (makeEdible == false && grid[snakeTail[0]][snakeTail[1]].type == "edible snake")
				makeEdible = true;
			
			if (!growSnake) {  // If snake didn't just eat (non special) food
				
				// temp variable to hold current snake tails nextSnake property
				newTail = grid[snakeTail[0]][snakeTail[1]].nextSnake;
				
				// set current snake tail to empty grid space
				setGrid(snakeTail[0], snakeTail[1], "empty", "#FFFFFF", null, null);

				// clear old tail tile
				ctx.clearRect(size * snakeTail[0], size * snakeTail[1], size, size);
				
				snakeTail = newTail;  // set new current snake tale
			}
			else  // snakes tail not cleared, allowing it's length to grow by +1
				growSnake = false;
				
			
			// set grid to snake type at new snake head's location
			if (makeEdible)
				setGrid(snakeX, snakeY, "edible snake", "#ADD8E6", [oldHeadX, oldHeadY], null);
			else
				setGrid(snakeX, snakeY, "snake", "#0095DD", [oldHeadX, oldHeadY], null);

			drawSnake();  // update head and tail of snake
			
			if (0.96 < Math.random())
				dropFood();
		}
		
		keyChangeAllowed = true;
		
		displayScore();
	}
	
	// controls speed of snake (basically divides up the fps that are drawn)
	drawCounter += 1;
	if (drawCounter > drawFrequency)
		drawCounter = 0;
	
	// calls draw at up to 60fps, handles other brower animation details
	requestAnimationFrame(draw);
}


// RUN
drawAll();
dropFood();
displayScore();
draw();