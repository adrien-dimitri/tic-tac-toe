/**
 * GameBoard module manages the state and operations of the tic-tac-toe game board.
 * @module GameBoard
 */
const GameBoard = (function () {
  let board = [
    " ", " ", " ",
    " ", " ", " ",
    " ", " ", " "
  ];

  /**
   * Gets the current state of the game board.
   * @returns {string[]} The current game board, represented as an array of strings.
   */
  const getBoard = () => board;

  /**
   * Prints the current state of the game board to the console.
   */
  const printBoard = () => {
    console.log(board.slice(0, 3));
    console.log(board.slice(3, 6));
    console.log(board.slice(6, 9));
  };

  /**
   * Checks if a cell at the specified position is empty.
   * @param {number} pos - The position of the cell to check (0 to 8).
   * @returns {boolean} True if the cell is empty, false otherwise.
   */
  const checkCell = (pos) => {
    return board[pos] === " ";
  };

  /**
   * Updates the game board at a specific position with the player's mark.
   * @param {number} pos - The position to update (0 to 8).
   * @param {string} player - The player's mark ("X" or "O").
   */
  const updateBoard = (pos, player) => {
    board[pos] = player;
    DisplayController.updateBoard(getBoard());
  };

  /**
   * Resets the game board to its initial state with all cells empty.
   */
  const resetBoard = () => {
    board = [
      " ", " ", " ",
      " ", " ", " ",
      " ", " ", " "
    ];
  }

  return {
    getBoard,
    printBoard,
    checkCell,
    updateBoard,
    resetBoard
  };
})();

/**
 * Creates a player object.
 * @param {string} name - The name of the player.
 * @param {string} mark - The mark of the player ("X" or "O").
 * @returns {object} The player object, which includes methods to increment the score and get the current score.
 */
function createPlayer(name, mark) {
  let score = 0;

  /**
   * Increments the player's score by 1.
   */
  const winGame = () => score++;

  /**
   * Gets the player's current score.
   * @returns {number} The player's score.
   */
  const getScore = () => score;
  
  return { name, mark, winGame, getScore };
}

/**
 * GameController module manages the game logic and player interactions.
 * @param {string} [player1="p1"] - The name of the first player (default is "p1").
 * @param {string} [player2="p2"] - The name of the second player (default is "p2").
 * @returns {object} The game controller object with methods to play rounds, start a new game, and check the game state.
 */
function GameController(player1="p1", player2="p2") {
  const board = GameBoard;
  const display = DisplayController;

  const p1 = createPlayer(player1, "X");
  const p2 = createPlayer(player2, "O");

  display.updateScore(p1, p2);

  let activePlayer = Math.random() < 0.5 ? p1 : p2;
  let gameEnded = false;

  /**
   * Switches the active player turn.
   */
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === p1 ? p2 : p1;
    display.highlightTurn(getActivePlayer().name);
  };

  /**
   * Gets the currently active player.
   * @returns {object} The active player object.
   */
  const getActivePlayer = () => activePlayer;

  /**
   * Prints the current state of the game and updates the display.
   */
  const printNewRound = () => {
    board.printBoard();
    display.updateBoard(board.getBoard());
    if (!gameEnded) {
      // console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  /**
   * Starts a new game by resetting the board and setting up the initial game state.
   */
  const startNewGame = () => {
    board.resetBoard();
    gameEnded = false;
    activePlayer = Math.random() < 0.5 ? p1 : p2;
    display.highlightTurn(getActivePlayer().name);

    printNewRound();
  };

  /**
   * Plays a round by updating the board and checking for a winner or a tie.
   * @param {number} pos - The position to play (0 to 8).
   * @returns {boolean} True if the game has ended, false otherwise.
   */
  const playRound = (pos) => {
    if (gameEnded) {
      // console.log("Game has already ended.");
      return true;
    }

    //console.log(`${getActivePlayer().name} played in cell ${pos}`);
    if (board.checkCell(pos)) {
      board.updateBoard(pos, getActivePlayer().mark);

      if (checkWinner()) {
        endGame();
        printNewRound();
        return;
      }

      if (checkTie()) {
        endGame(true);
        printNewRound();
        return;
      }

      switchPlayerTurn();
    }
    else {
      // console.log(`Invalid move for ${activePlayer.mark}. Try again.`);
    }
    
    printNewRound();
  };

  /**
   * Checks if there is a winner on the board.
   * @returns {boolean} True if there is a winner, false otherwise.
   */
  const checkWinner = () => {
    const b = board.getBoard();
    // Check diagonals
    if ((b[0] === b[4] && b[4] === b[8] && b[0] !== " ") || 
    (b[2] === b[4] && b[4] === b[6] && b[2] !== " ")) {
      return true;
    }

    // Check rows and columns
    for (let i = 0; i < 3; i++) {
      if ((b[3 * i] === b[3 * i + 1] && b[3 * i + 1] === b[3 * i + 2] && b[3 * i] !== " ") || 
          (b[i] === b[i + 3] && b[i + 3] === b[i + 6] && b[i] !== " ")) {
        return true;
      }
    }
    return false;
  };

  /**
   * Checks if the game has ended in a tie.
   * @returns {boolean} True if the game is a tie, false otherwise.
   */
  const checkTie = () => {
    const b = board.getBoard();
    return b.every(cell => cell !== " ");
  };

  /**
   * Ends the game by updating the score and showing a message.
   * @param {boolean} [isTie=false] - Indicates if the game ended in a tie.
   */
  const endGame = (isTie = false) => {
    if (!isTie) {
      getActivePlayer().winGame();
      display.updateScore(p1, p2);
      display.startNextGame(`${getActivePlayer().name} won the game!`);
      switchPlayerTurn();
    } else {
      display.startNextGame("It's a tie!");
    }
    gameEnded = true;
  };

  /**
   * Checks if the game has ended.
   * @returns {boolean} True if the game has ended, false otherwise.
   */
  const isGameEnded = () => gameEnded;

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    endGame,
    isGameEnded,
    startNewGame
  };
}

/**
 * DisplayController module handles the display and user interaction of the tic-tac-toe game.
 * @module DisplayController
 */
const DisplayController = (() => {
  let game = null;
  let isClickedArray = [];

  /**
   * Initializes the game session by setting up event listeners for the start and reset buttons,
   * and managing the display of player names and scores.
   */
  const startSession = () => {
    const startButton = document.querySelector(".start-button");
    const resetButton = document.querySelector(".reset-button");
    const p1Input = document.querySelector(".p1-name-input");
    const p2Input = document.querySelector(".p2-name-input");
    const p1Div = document.querySelector(".p1-name");
    const p2Div = document.querySelector(".p2-name");
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");

    startButton.addEventListener("click", () => {
      p1Div.textContent = p1Input.value === "" ? "Player X" : p1Input.value + " [X]";
      p2Div.textContent = p2Input.value === "" ? "Player O" : p2Input.value + " [O]";
      
      p1Input.style.display = "none";
      p2Input.style.display = "none"; 
      p1Div.style.display = "block";
      p2Div.style.display = "block";
      p1Score.style.display = "block";
      p2Score.style.display = "block";

      game = GameController(p1Div.textContent, p2Div.textContent);

      highlightTurn(game.getActivePlayer().name);

      startButton.style.display = "none";
      resetButton.style.display = "block";
    });
  };

  const overlay = document.querySelector(".overlay");

  /**
   * Displays an overlay announcing the outcome of the game and sets up an event listener
   * to start a new game when the overlay is clicked.
   * @param {string} msg - The message to display on the overlay (e.g., winner announcement or tie).
   */
  const startNextGame = (msg) => {
    const overlayText = document.querySelector(".overlay-text");
    overlay.style.display = "flex";
    overlayText.textContent = `${msg}`;
    overlay.addEventListener("click", () => {
      overlay.style.display = "none";
      overlayText.textContent = "";
      resetIsClicked();
      game.startNewGame();
    });
  };
  
  const cells = document.querySelectorAll(".cell");

  /**
   * Resets the `isClickedArray` to all `false` values, indicating that no cells have been clicked.
   */
  const resetIsClicked = () => {
    isClickedArray = isClickedArray.map(() => false);  // Reset all to false
  };
  
  /**
   * Updates the displayed scores for both players.
   * @param {object} p1 - The first player object, which should have a `getScore` method.
   * @param {object} p2 - The second player object, which should have a `getScore` method.
   */
  const updateScore = (p1, p2) => {
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");

    p1Score.textContent = p1.getScore();
    p2Score.textContent = p2.getScore();
  }

  /**
   * Updates the game board display based on the current state of the board.
   * @param {string[]} board - An array representing the current state of the game board.
   */
  const updateBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  cells.forEach((cell, index) => {
    let originalContent = "";
    isClickedArray[index] = false; 

    cell.addEventListener("click", () => {
      if (!game || game.isGameEnded()) return;
      cell.style.color = "rgba(0, 0, 0, 1.0)";
      if (!isClickedArray[index]) {
        game.playRound(index);
        isClickedArray[index] = true;
      }
    });

    cell.addEventListener("mouseenter", () => {
      if (!game || game.isGameEnded()) return;
      originalContent = cell.textContent; 
      if (!isClickedArray[index] && cell.textContent === " ") {
        cell.textContent = game.getActivePlayer().mark;
        cell.style.color = "rgba(0, 0, 0, 0.5)";
      }
    });

    cell.addEventListener("mouseleave", () => {
      if (!game || game.isGameEnded()) return;
      if (!isClickedArray[index] && originalContent === " ") {
        cell.textContent = " ";  // Revert to the original content if not clicked
      }
      cell.style.color = "rgba(0, 0, 0, 1.0)";
    });
  });

  const resetButton = document.querySelector(".reset-button");
  resetButton.addEventListener("click", () => {
    resetSession();
  });

  /**
   * Resets the game session, including the display of player names and scores, and reinitializes the session.
   */
  const resetSession = () => {
    game = null;
    resetIsClicked();
    const startButton = document.querySelector(".start-button");
    const p1Input = document.querySelector(".p1-name-input");
    const p2Input = document.querySelector(".p2-name-input");
    const p1Div = document.querySelector(".p1-name");
    const p2Div = document.querySelector(".p2-name");
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");

    p1Input.style.display = "block";
    p2Input.style.display = "block"; 
    p1Div.style.display = "none";
    p2Div.style.display = "none";
    p1Div.style.fontWeight = "normal";
    p2Div.style.fontWeight = "normal";
    p1Score.style.display = "none";
    p2Score.style.display = "none";

    startButton.style.display = "block";
    resetButton.style.display = "none";

    cells.forEach(cell => {
      cell.textContent = " ";
      cell.style.color = "rgba(0, 0, 0, 1.0)";
    });

    GameBoard.resetBoard();

    startSession();
  }

  /**
   * Highlights the name of the player whose turn it is.
   * @param {string} player - The name of the player whose turn it is.
   */
  const highlightTurn = (player) => {
    const p1Div = document.querySelector(".p1-name");
    const p2Div = document.querySelector(".p2-name");

    if (player === p1Div.textContent) {
      p1Div.style.fontWeight = "bold";
      p2Div.style.fontWeight = "normal"
    } else {
      p2Div.style.fontWeight =  "bold";
      p1Div.style.fontWeight = "normal";
    }
  }
      
  return {
    updateBoard,
    startSession,
    updateScore,
    startNextGame,
    highlightTurn
  };
})();

DisplayController.startSession();
