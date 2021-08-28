function preload(){
  Processor.LoadPieces();
}

function initiateBoard(){
  let boardWidthPercentage = .80;
  let boardWidth = Math.min(boardWidthPercentage * width, 600) ;
  Board.initiate((width-boardWidth)/2, 50, boardWidth, color("#eeeed2"), color("#769656"));
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  initiateBoard();
  Board.drawBoard();
  Processor.startGame();
}
function mousePressed(){
  Processor.clicked();
}

function draw() {
  background(61);
  Board.drawBoard();
  Processor.updateGameState();
}
