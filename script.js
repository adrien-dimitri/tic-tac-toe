const GameBoard = (function () {
  let board = [
    " ", " ", " ",
    " ", " ", " ",
    " ", " ", " "
  ];

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3));
    console.log(board.slice(3, 6));
    console.log(board.slice(6, 9));
  };

  const checkCell = (pos) => {
    return board[pos] === " " ? true : false;
  };

  const updateBoard = (pos, player) => {
    board[pos] = player;
    DisplayController.updateBoard(getBoard());
  };

  return {
    getBoard,
    printBoard,
    checkCell,
    updateBoard
  };
})();

function createPlayer(name, mark) {
  let score = 0;
  const winGame = () => score++;
  const getScore = () => score;
  
  return { name, mark, winGame, getScore };
}

function GameController(player1="p1", player2="p2") {
  const board = GameBoard;
  const display = DisplayController;

  const p1 = createPlayer(player1, "X");
  const p2 = createPlayer(player2, "O");

  let activePlayer = p1;
  let gameEnded = false;

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === p1 ? p2 : p1;
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    display.updateBoard(board.getBoard());
    if (!gameEnded) {
      console.log(`${getActivePlayer().name}'s turn.`);
    }
  };

  const playRound = (pos) => {
    if (gameEnded) {
      console.log("Game has already ended.");
      return true;
    }

    console.log(`${getActivePlayer().name} played in cell ${pos}`);
    if (board.checkCell(pos)) {
      board.updateBoard(pos, getActivePlayer().mark);

      if (checkWinner()) {
        endGame();
        printNewRound();
        return;
      }

      switchPlayerTurn();
    }
    else {
      console.log(`Invalid move for ${activePlayer.mark}. Try again.`);
    }
    
    printNewRound();
  };

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

  const endGame = () => {
    gameEnded = true;
    getActivePlayer().winGame();
    display.UpdateScore(p1, p2);
    console.log(`${getActivePlayer().name} won the game!`);
  };

  const isGameEnded = () => gameEnded;

  printNewRound();

  return {
    playRound,
    getActivePlayer,
    endGame,
    isGameEnded
  };
}

const DisplayController = (() => {
  let game = null;

  const startGame = () => {
    const startButton = document.querySelector(".start-button");
    const p1Input = document.querySelector(".p1-name-input");
    const p2Input = document.querySelector(".p2-name-input");
    const p1Div = document.querySelector(".p1-name");
    const p2Div = document.querySelector(".p2-name");
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");

    startButton.addEventListener("click", () => {
      console.log(p1Input.value, p2Input.value);

      p1Div.textContent = p1Input.value === "" ? "Player X" : p1Input.value + " [X]";
      p2Div.textContent = p2Input.value === "" ? "Player O" : p2Input.value + " [O]";
      
      p1Input.style.display = "none";
      p2Input.style.display = "none"; 
      p1Div.style.display = "block";
      p2Div.style.display = "block";
      p1Score.style.display = "block";
      p2Score.style.display = "block";

      game = GameController(p1Div.textContent, p2Div.textContent);
      console.log(game);
    });
  };
  
  const UpdateScore = (p1, p2) => {
    const p1Score = document.querySelector(".p1-score");
    const p2Score = document.querySelector(".p2-score");

    p1Score.textContent = p1.getScore();
    p2Score.textContent = p2.getScore();
  }

  const cells = document.querySelectorAll(".cell");

  const updateBoard = (board) => {
    cells.forEach((cell, index) => {
      cell.textContent = board[index];
    });
  };

  cells.forEach((cell, index) => {
    let originalContent = "";
    let isClicked = false; 

    cell.addEventListener("click", () => {
      if (!game || game.isGameEnded()) return;
      cell.style.color = "rgba(0, 0, 0, 1.0)";
      if (!isClicked) {
        game.playRound(index);
        isClicked = true;
      }
    });

    cell.addEventListener("mouseenter", () => {
      if (!game || game.isGameEnded()) return;
      originalContent = cell.textContent; 
      if (!isClicked && cell.textContent === " ") {
        cell.textContent = game.getActivePlayer().mark;
      }
      cell.style.color = "rgba(0, 0, 0, 0.5)";
    });

    cell.addEventListener("mouseleave", () => {
      if (!game || game.isGameEnded()) return;
      if (!isClicked && originalContent === " ") {
        cell.textContent = " ";  // Revert to the original content if not clicked
      }
      cell.style.color = "rgba(0, 0, 0, 1.0)";
    });
  });

  return {
    updateBoard,
    startGame,
    UpdateScore
  };
})();

DisplayController.startGame();


// TODO - start new game after win
// TODO - work on Reset button