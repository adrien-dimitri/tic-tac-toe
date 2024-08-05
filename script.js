const GameBoard = (function () {
  board = [
    "", "", "",
    "", "", "",
    "", "", ""
  ]

  const getBoard = () => board;

  const printBoard = () => {
    console.log(board.slice(0, 3))
    console.log(board.slice(3, 6))
    console.log(board.slice(6, 9))
  };

  const checkCell = (pos) => {
    return board[pos] === "" ? true : false
  }

  const updateBoard = (pos, player) => {
    board[pos] = player
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

function GameController (player1="p1", player2="p2") {
  const board = GameBoard

  const p1 = createPlayer(player1, "X")
  const p2 = createPlayer(player2, "O")

  let activePlayer = p1

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === p1 ? p2 : p1;
  };

  const getActivePlayer = () => activePlayer;

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
  };

  const playRound = (pos) => {
    console.log(
      `${getActivePlayer().name} played in cell ${pos}`
    );
    if (board.checkCell(pos)) {
      board.updateBoard(pos, getActivePlayer().mark);
      /*  This is where we would check for a winner and handle that logic,
        such as a win message. */

      // Switch player turn
      switchPlayerTurn();
    }
    else {
      console.log(`Invalid move for ${activePlayer.mark}. Try again.`)
    }
    
    printNewRound();
  };

  printNewRound();

  return {
    playRound,
    getActivePlayer
  };
}

const game = GameController();