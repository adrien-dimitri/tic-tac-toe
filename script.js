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

  const updateBoard = (pos, player) => {
    if (board[pos] === "") {
      board[pos] = player
    }
  };

  return {
    getBoard,
    printBoard,
    updateBoard
  };
})();

