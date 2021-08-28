

class Processor{
    static BoardSize = 8;

    static PiecesImages = [];
    static Squares = [];
    static Moves = [];
    static SquaresToIndicate = [];
    static Player = Pieces.White;
    static Fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR";
    static PickedSquare;
    static indicationColor;
    static IsKingOnCheck = false;
    static movesProcessor;
    PiecesImages = [];


    static LoadPieces(){
        this.PiecesImages[Pieces.White | Pieces.Pawn] = loadImage('Assets/Pieces/wp.png');
        this.PiecesImages[Pieces.White | Pieces.Knight] = loadImage('Assets/Pieces/wn.png');
        this.PiecesImages[Pieces.White | Pieces.Bishop] = loadImage('Assets/Pieces/wb.png');
        this.PiecesImages[Pieces.White | Pieces.Rook] = loadImage('Assets/Pieces/wr.png');
        this.PiecesImages[Pieces.White | Pieces.Queen] = loadImage('Assets/Pieces/wq.png');
        this.PiecesImages[Pieces.White | Pieces.King] = loadImage('Assets/Pieces/wk.png');

        this.PiecesImages[Pieces.Black | Pieces.Pawn] = loadImage('Assets/Pieces/bp.png');
        this.PiecesImages[Pieces.Black | Pieces.Knight] = loadImage('Assets/Pieces/bn.png');
        this.PiecesImages[Pieces.Black | Pieces.Bishop] = loadImage('Assets/Pieces/bb.png');
        this.PiecesImages[Pieces.Black | Pieces.Rook] = loadImage('Assets/Pieces/br.png');
        this.PiecesImages[Pieces.Black | Pieces.Queen] = loadImage('Assets/Pieces/bq.png');
        this.PiecesImages[Pieces.Black | Pieces.King] = loadImage('Assets/Pieces/bk.png');
    }

    static startGame(){

        this.indicationColor = color(50, 50, 50, 100);
        this.movesProcessor = new MovesProcessor();
        this.Fen = this.movesProcessor.reformatFEN(this.Fen);
        this.Squares = this.movesProcessor.decodeFEN(this.Fen);
        this.placePieces(this.Squares);
        this.Moves = this.movesProcessor.generateAllMoves(this.Squares).moves;
    }

    static placePiece(pos, piece){
        if(piece === Pieces.None) return;
        let coOrdinate = this.getPosCoOrdinate(pos);
        let pieceImage = this.PiecesImages[piece];
        let imageHeight = Board.cellSize*.85;
        imageMode(CENTER);
        image(pieceImage, coOrdinate.x, coOrdinate.y, imageHeight, imageHeight);
    }

    static placePieces(squares){
        for(let i =1; i<squares.length; i++){
            this.placePiece(i, squares[i]);
        }
    }

    static drawAvailableMoves(squaresToIndicate){
        for(let i =1; i<squaresToIndicate.length; i++){
            if(squaresToIndicate[i] != 0)
                this.indicate(i);
        }
    }
    static indicateEmptySquare(center){
        noStroke();
        fill(this.indicationColor);
        circle(center.x, center.y, Board.cellSize*.3);
    }

    static indicateCapture(center){
        stroke(this.indicationColor);
        noFill();
        circle(center.x, center.y, Board.cellSize*.9);
    }

    static indicate(pos){
        let coOrdinate = this.getPosCoOrdinate(pos);
        if(this.movesProcessor.isEmptySquare(pos, this.Squares)) this.indicateEmptySquare(coOrdinate);
        else this.indicateCapture(coOrdinate);
        
    }
    static getPosCoOrdinate(pos){
        let placement = this.movesProcessor.getFileRankFromPos(pos);
        return {x:Board.startX + (placement.rank-1)*Board.cellSize+Board.cellSize/2, y: Board.startY + (this.BoardSize - placement.file)*Board.cellSize + Board.cellSize/2}
    }
    static clickedOutsideBoard(){
        let x = mouseX, y = mouseY;
        let hiX = 8*Board.cellSize;
        return !(x>Board.startX && x<hiX+Board.startX && y>Board.startY && y<hiX+Board.startY);
    }
    static getPosFromCoOrdinate(x, y){
        x -= Board.startX; y-=Board.startY;
        let file = 9-Math.ceil(y/Board.cellSize);
        let rank = Math.ceil(x/Board.cellSize);
        return this.movesProcessor.getPosFromFileRank(file, rank);
    }

    static clickedOn(){
        return this.getPosFromCoOrdinate(mouseX, mouseY);
    }

    static removesCheck(from, to, player){
        let tempMovesProcessor = new MovesProcessor();
        let fen = tempMovesProcessor.makeMove(from, to, this.Fen, this.Squares);
        let squares = tempMovesProcessor.decodeFEN(fen);
        let movesState = tempMovesProcessor.generateAllMoves(squares);
        if(player === Pieces.White && !movesState.isWhiteOnCheck) return true;
        if(player === Pieces.Black && !movesState.isBlackOnCheck) return true;
        return false;
    }

    static filterMoves(player){
        
        for(let i=1; i<this.Moves.length; i++){
            if(this.movesProcessor.getColor(this.Squares[i])===player){
                let moves = [];
                for(let j=0;j<this.Moves[i].length; j++){
                    if(this.removesCheck(i, this.Moves[i][j], player)){ moves.push(this.Moves[i][j]); }
                }
                this.Moves[i] = moves;
            }
            debugger
        }
    }




    static changePlayer(){ this.Player = this.Player === Pieces.White ? Pieces.Black : Pieces.White; }
    static filterMovesIfOnCheck(state){
        if(this.Player===Pieces.White){
            this.filterMoves(Pieces.White);
        }
        if(this.Player===Pieces.Black){
            this.filterMoves(Pieces.Black);
        }
    }
    static clicked(){
        debugger
        if(this.clickedOutsideBoard()) return;
        let selectedSquare = this.clickedOn();


        let state = this.movesProcessor.clickedOnSquare(selectedSquare, this.Fen, this.Squares, this.Moves, this.Player);
        this.SquaresToIndicate = state.movesToIndicate;
        if(state.moveMade){
            this.changePlayer();
            this.Fen = state.fen;
            this.Squares = this.movesProcessor.decodeFEN(this.Fen);
            let movesState = this.movesProcessor.generateAllMoves(this.Squares);
            this.Moves = movesState.moves;
            this.filterMovesIfOnCheck(movesState);
        }
        debugger
        
        
    }

    static updateGameState(){
        this.placePieces(this.Squares);
        this.drawAvailableMoves(this.SquaresToIndicate);
        
    }

}