const GameBoard = (function () {
  board = [
    " ", " ", " ",
    " ", " ", " ",
    " ", " ", " "
  ]

  // reference
  // board = [
  //   "0", "1", "2",
  //   "3", "4", "5",
  //   "6", "7", "8"
  // ]

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3))
    console.log(board.slice(3, 6))
    console.log(board.slice(6, 9))
  };

  const checkCell = (pos) => {
    return board[pos] === " " ? true : false
  }

  const updateBoard = (pos, player) => {
    board[pos] = player
    DisplayController.updateBoard(getBoard());
  };

  return {
    getBoard,
    printBoard,
    checkCell,
    updateBoard
  };
})();

function createPlayer (name, mark) {
  return { name, mark }
}

function GameController (player1="player1-X", player2="player2-O") {
  const board = GameBoard
  const display = DisplayController

  const p1 = createPlayer(player1, "X")
  const p2 = createPlayer(player2, "O")

  let activePlayer = p1
  let gameEnded = false

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
      console.log(`Invalid move for ${activePlayer.mark}. Try again.`)
    }
    
    printNewRound();
  };

  const checkWinner = () => {
    const b = board.getBoard();
    // check diagonals 
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
  }

    const endGame = () => {
      gameEnded = true;
      console.log(`${getActivePlayer().name} won the game!`)

    }

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
      if (game.isGameEnded()) return;
      cell.style.color = "rgba(0, 0, 0, 1.0)"
      if (!isClicked) {
        game.playRound(index);
        isClicked = true; 
      }
    });

    cell.addEventListener("mouseenter", () => {
      if (game.isGameEnded()) return;
      originalContent = cell.textContent; 
      if (!isClicked && cell.textContent === " ") {
        cell.textContent = game.getActivePlayer().mark;
      }
      cell.style.color = "rgba(0, 0, 0, 0.5)";
    });

    cell.addEventListener("mouseleave", () => {
      if (game.isGameEnded()) return;
      if (!isClicked && originalContent === " ") {
        cell.textContent = " ";  // Revert to the original content if not clicked
      }
      cell.style.color = "rgba(0, 0, 0, 1.0)";
    });
  });

  return {
    updateBoard,
  };
})();


const game = GameController()