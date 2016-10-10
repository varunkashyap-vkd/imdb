var game2048 = (function()
{
	var restart, score, tile, gameOver, backButton, message, keepGoing, gameWonDialog;
	var board, playerScore = 0, bestScore, bestTile;
	var win = false;
	var prevBoard;

	function keepGoingFun()
	{
		document.addEventListener('keydown', swipe);
		gameWonDialog.style.display = 'none';
	}

	function noValidMovesLeft()
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 3; j++)
			{
				if(board[i][j] == board[i][j + 1] || board[i][j] == 0 || board[i][j + 1] == 0)
				{
					return false;
				}
			}
		}

		for(var j = 0; j < 4; j++)
		{
			for(var i = 0; i < 3; i++)
			{
				if(board[i][j] == board[i + 1][j] || board[i][j] == 0)
				{
					return false;
				}
			}
		}

		return true;
	}

	function isComplete()
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				if(board[i][j] == 2048 && win == false)
				{
					win = true;
					return true;
				}
			}
		}		
		return false;
	}

	function rotateBoardClockWise()
	{
		var newBoard = board;
		board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				board[j][3 - i] = newBoard[i][j];
			}
		}
	}

	function print()
	{
		for(var i = 0; i < 4; i++)
		{
			var s = '';

			for(var j = 0; j < 4; j++)
			{
				s += board[i][j] + ' ';
			}
		}
	}

	function leftSwipe()
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				var k = j;

				while(k < 3 && board[i][k] == 0)
				{
					k++;
				}

				if(k != j)
				{
					board[i][j] = board[i][k];
					board[i][k] = 0;
				}

				if(k == 3)
				{
					break;
				}
			}
		}

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				var k = j;

				if(k < 3 && board[i][k] == board[i][k + 1] && board[i][k] != 0)
				{
					playerScore += (2*board[i][k]);
					board[i][k] *= 2;

					var l = k + 1;

					while(l < 3)
					{
						board[i][l] = board[i][l + 1];
						l++;
					}

					board[i][l] = 0;
				}				
			}
		}
	}

	function isLeftSwipePossible()
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 3; j++)
			{
				if(board[i][j] == board[i][j + 1] && board[i][j] != 0)
				{
					return true;
				}
			}
		}

		for(var i = 0; i < 4; i++)
		{
			var zeroIndex = 0;
			var nonZeroIndex = 3;

			while(zeroIndex <= 3 && board[i][zeroIndex] != 0)
			{
				zeroIndex++;
			}

			while(nonZeroIndex >= 0 && board[i][nonZeroIndex] == 0)
			{
				nonZeroIndex--;
			}

			if(nonZeroIndex > zeroIndex)
			{
				return true;
			}			
		}

		return false;
	}

	function rightSwipe()
	{
		rotateBoardClockWise();
		rotateBoardClockWise();

		leftSwipe();

		rotateBoardClockWise();
		rotateBoardClockWise();
	}

	function isRightSwipePossible()
	{
		rotateBoardClockWise();
		rotateBoardClockWise();

		var x = isLeftSwipePossible();

		rotateBoardClockWise();
		rotateBoardClockWise();

		return x;
	}

	function upSwipe()
	{
		rotateBoardClockWise();
		rotateBoardClockWise();
		rotateBoardClockWise();

		leftSwipe();

		rotateBoardClockWise();
	}

	function isUpSwipePossible()
	{
		rotateBoardClockWise();
		rotateBoardClockWise();
		rotateBoardClockWise();

		var x = isLeftSwipePossible();

		rotateBoardClockWise();

		return x;
	}

	function downSwipe()
	{
		rotateBoardClockWise();

		leftSwipe();

		rotateBoardClockWise();
		rotateBoardClockWise();
		rotateBoardClockWise();
	}

	function isDownSwipePossible()
	{
		rotateBoardClockWise();

		var x = isLeftSwipePossible();

		rotateBoardClockWise();
		rotateBoardClockWise();
		rotateBoardClockWise();

		return x;
	}

	function restartGame()
	{
		gameWonDialog.style.display = 'none';
		gameOver.style.display = 'none';
		win = false;

		board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; 

		playerScore = 0;
		score.innerHTML = 'Score : ' + playerScore;

		gameOver.style.display = 'none';
		assignRandomly();
		assignRandomly();
		reDrawBoard();

		localStorage.setItem('boardStatus', JSON.stringify(board));
		localStorage.setItem('playerScore', JSON.stringify(playerScore));
		document.addEventListener('keydown', swipe);
	}

	function storeCopy()
	{
		prevBoard = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				prevBoard[i][j] = board[i][j];
			}
		}
	}

	function swipe(event)
	{
		var y = false;
		var x = false;

		storeCopy();

		if(event.keyCode == 82)
		{
			restartGame();
			return;
		}

		if(event.keyCode == 37)
		{
			y = true;

			if(isLeftSwipePossible())
			{
				leftSwipe();
				x = true;
			}
		}

		else if(event.keyCode == 38)
		{
			y = true;

			if(isUpSwipePossible())
			{
				upSwipe();
				x = true;
			}
		}

		else if(event.keyCode == 39)
		{
			y = true;

			if(isRightSwipePossible())
			{
				rightSwipe();
				x = true;
			}
		}

		else if(event.keyCode == 40)
		{
			y = true;

			if(isDownSwipePossible())
			{
				downSwipe();
				x = true;
			}
		}

		if(x)
		{
			assignRandomly();
			localStorage.setItem('boardStatus', JSON.stringify(board));
			localStorage.setItem('playerScore', JSON.stringify(playerScore));
		}

		if(y)
		{
			if(playerScore > JSON.parse(localStorage.getItem('biggestScore')))
			{
				localStorage.setItem('biggestScore', JSON.stringify(playerScore));
			}

			if(biggestTile() > JSON.parse(localStorage.getItem('biggestTile')))
			{
				localStorage.setItem('biggestTile', JSON.stringify(biggestTile()));
			}

			if(noValidMovesLeft())
			{
				var x = 'Game Over, Well Tried !!! <br> Your Score : ' + playerScore + '<br> Biggest Tile : ' + biggestTile();
				message.innerHTML = x;
				gameOver.style.display = 'block';
				document.removeEventListener('keydown', swipe);
			}

			if(isComplete())
			{
				gameWonDialog.style.display = 'block';
				document.removeEventListener('keydown', swipe);
			}
		}
		reDrawBoard();
	}

	function biggestTile()
	{
		var big = 0;

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				if(board[i][j] > big)
				{
					big = board[i][j];
				}
			}
		}
		return big;
	}

	function assignRandomly()
	{
		var vacant = [];
		var values = [2, 4];

		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				if(board[i][j] == 0)
				{
					var x = values[Math.floor(Math.random()*100 + 1)%2];

					var obj = {
						row : i,
						col : j,
						value : x,
					};

					vacant.push(obj);
				}
			}
		}

		if(vacant.length == 0)
		{
			return;
		}

		var y = vacant[Math.floor(Math.random()*100 + 1)%vacant.length]
		board[y.row][y.col] = y.value;
	}

	function reDrawBoard()
	{
		for(var i = 0; i < 4; i++)
		{
			for(var j = 0; j < 4; j++)
			{
				if(board[i][j] !== 0)
				{
					var desiredClass = 'tile tile_' + board[i][j];

					tile[(4*i) + j].setAttribute('class', desiredClass);
				}

				else
				{
					tile[(4*i) + j].setAttribute('class', 'tile');	
				}
			}
		}

		score.innerHTML = 'Score : ' + playerScore;
		bestScore.innerHTML = 'Best Score : ' + JSON.parse(localStorage.getItem('biggestScore'));
		bestTile.innerHTML = 'Best Tile : ' + JSON.parse(localStorage.getItem('biggestTile'));
	}

	function backFunction()
	{
		document.addEventListener('keydown', swipe);
		gameOver.style.display = 'none';
	}

	function init(obj)
	{
		restart 		= document.getElementsByClassName(obj.restart);
		score 			= document.getElementById(obj.score);
		tile 			= document.getElementsByClassName(obj.tileClass);
		gameOver 		= document.getElementById(obj.gameOver);
		backButton 		= document.getElementById(obj.back);
		message 		= document.getElementById(obj.message);
		keepGoing 		= document.getElementById(obj.keepGoing);
		gameWonDialog 	= document.getElementById(obj.gameWon);
		bestScore 		= document.getElementById(obj.bestScore);
		bestTile 		= document.getElementById(obj.bestTile);

		if(localStorage.getItem('boardStatus') !== null)
		{
			board = JSON.parse(localStorage.getItem('boardStatus'));
		}

		else
		{
			board = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]; 
			assignRandomly();
			assignRandomly();
		}


		if(localStorage.getItem('playerScore') !== null)
		{
			playerScore = JSON.parse(localStorage.getItem('playerScore'));
		}

		else
		{
			playerScore = 0;
		}


		if(localStorage.getItem('biggestScore') !== null)
		{
			bestScore.innerHTML = 'Best Score : ' + JSON.parse(localStorage.getItem('biggestScore'));
		}

		else
		{
			bestScore.innerHTML = 'Best Score : 0';
		}


		if(localStorage.getItem('biggestTile') !== null)
		{
			bestTile.innerHTML = 'Best Tile : ' + JSON.parse(localStorage.getItem('biggestTile'));
		}

		else
		{
			bestTile.innerHTML = 'Best Tile : 2';
		}


		for(var i = 0; i < restart.length; i++)
		{
			restart[i].addEventListener('click', restartGame);
		}	

		var left = document.getElementById(obj.buttons.left);
		var right = document.getElementById(obj.buttons.right);
		var up = document.getElementById(obj.buttons.up);
		var down = document.getElementById(obj.buttons.down);

		left.addEventListener('click', swipe.bind(this, {keyCode : 37}));
		right.addEventListener('click', swipe.bind(this, {keyCode : 39}));
		up.addEventListener('click', swipe.bind(this, {keyCode : 38}));
		down.addEventListener('click', swipe.bind(this, {keyCode : 40}));

		document.addEventListener('keydown', swipe);
		backButton.addEventListener('click', backFunction);
		keepGoing.addEventListener('click', keepGoingFun);
		reDrawBoard();
	}

	return {
		init : init,
	}

})();
