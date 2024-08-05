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

