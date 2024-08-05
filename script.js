const GameBoard = (function () {
  board = [
    "", "", "",
    "", "", "",
    "", "", ""
  ]

  const getBoard = () => {
    console.log(board.slice(0, 3))
    console.log(board.slice(3, 6))
    console.log(board.slice(6, 9))
  };

  return {
    getBoard
  };
})();
