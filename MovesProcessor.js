class MovesProcessor{

     PickedSquare;
     SquaresToIndicate;
     IsBlackOnCheck = false;
     IsWhiteOnCheck = false;
     PiecesValue = {
        'p' : Pieces.Pawn,
        'P' : Pieces.Pawn,
        'n' : Pieces.Knight,
        'N' : Pieces.Knight,
        'b' : Pieces.Bishop,
        'B' : Pieces.Bishop,
        'r' : Pieces.Rook,
        'R' : Pieces.Rook,
        'q' : Pieces.Queen,
        'Q' : Pieces.Queen,
        'k' : Pieces.King,
        'K' : Pieces.King
    }

     reformatFEN(fen){
        let formatedFEN = "";
        for(let i=0; i<fen.length;i++){
            if(this.isDigit(fen[i])){
                for(let j = 1; j<=(+fen[i]); j++) formatedFEN += '1';
            }
            else formatedFEN += fen[i];
        }
        return formatedFEN;
    }

     decodeFEN(fen){
        let squares = [];
        let cuPosition = 57;
        for(let i = 0; i<fen.length; i++) {
            let ch = fen[i];
            if(this.isDigit(ch)){
                for(let i=cuPosition; i<cuPosition+(+ch); i++) squares[i] = Pieces.None;
                cuPosition += +ch;
            }
            else if(this.isAPiece(ch)){
                squares[cuPosition] = this.isWhiteFromFen(ch) ? this.PiecesValue[ch] | Pieces.White : this.PiecesValue[ch] | Pieces.Black;
                cuPosition++;
            }
            else if(ch === '/'){
                cuPosition -= 16;
            }
        };
        return squares;
    }
     generateAllMoves(squares){
        let moves = [];
        for(let i=1; i<=64; i++){
            moves[i] = this.generateMoves(i, squares);
        }
        return {moves: moves, isBlackOnCheck: this.IsBlackOnCheck, isWhiteOnCheck: this.IsWhiteOnCheck};
    }
     generateMoves(pos, squares){
        let moves = [], piece = squares[pos];
        if(Pieces.IsType(piece, Pieces.Pawn)){
            moves = this.generatePawnMoves(pos, squares);
        }
        else if(Pieces.IsType(piece, Pieces.Knight)){
            moves = this.generateKnightMoves(pos, squares);
        }
        else if(Pieces.IsType(piece, Pieces.King)){
            moves = this.generateKingMoves(pos, squares);
        }
        else if(Pieces.IsType(piece, Pieces.Rook)){
            moves = this.generateRookMoves(pos, squares);
        }
        else if(Pieces.IsType(piece, Pieces.Bishop)){
            moves = this.generateBishopMoves(pos, squares);
        }
        else if(Pieces.IsType(piece, Pieces.Queen)){
            moves = this.generateBishopMoves(pos, squares).concat(this.generateRookMoves(pos, squares));
        }

        return moves;
    }

     generatePawnMoves(pos, squares){
        let moves = [];
        let direction = this.getColor(squares[pos]) === Pieces.White ? 1 : -1;
        let fileRank = this.getFileRankFromPos(pos);
        
        // 1 up/down
        let move = this.VerticalFileRank(fileRank.file, fileRank.rank, 1*direction);
        if(this.isValidFileRank(move.file, move.rank) && this.isEmptySquare(move.pos, squares)) moves.push(move.pos);

        // 2 up/down
        move = this.VerticalFileRank(fileRank.file, fileRank.rank, 2*direction);
        if(this.isValidFileRank(move.file, move.rank) && this.isPawnHome(pos, squares) && this.isEmptySquare(move.pos, squares) ) moves.push(move.pos);

        move = {file: fileRank.file+direction, rank: fileRank.rank+1, pos: this.getPosFromFileRank(fileRank.file+direction, fileRank.rank+1)};
        if(this.canMove(move.file, move.rank, pos, squares) && this.isEnemyPiece(squares[move.pos])) moves.push(move.pos);
        
        move = {file: fileRank.file+direction, rank: fileRank.rank-1, pos: this.getPosFromFileRank(fileRank.file+direction, fileRank.rank-1)};
        if(this.canMove(move.file, move.rank, pos, squares) && this.isEnemyPiece(squares[move.pos])) moves.push(move.pos);

        return moves;
    }

     getFileRankFromPos(pos){ return {file: Math.ceil(pos/8), rank: pos%8 === 0 ? 8 : pos%8} }
     getPosFromFileRank(file, rank){ return (file-1)*8 + rank; }




     isValidPos(pos){ return pos>=1 && pos<=64; }


     isValidFileRank(file, rank){
        if(file>=1&&file<=8&&rank>=1&&rank<=8) return true;
        return false;
    }
     isEmptySquare(pos, squares){ return squares[pos] === Pieces.None; }
     isWhite(piece){ return  piece != Pieces.None && (piece & Pieces.White) > 0; }
     isBlack(piece){ return  piece != Pieces.None && (piece & Pieces.Black) > 0; }
     getColor(piece){return (piece & 24);}
     isWhiteFromFen(ch){ return  ch.toUpperCase() === ch; }

     isDigit(ch){ return !isNaN(ch); }
     isAPiece(ch){ return ch.toUpperCase() != ch.toLowerCase(); }

     isFriendlyPiece(piece, playerColor){ return (piece != Pieces.None && piece&playerColor) > 0; }

     isEnemyPiece(piece, playerColor){ return piece != Pieces.None &&  (piece&playerColor) === 0; }

     isPawnHome(pos, squares){
        if(this.isWhite(squares[pos])) return this.getFileRankFromPos(pos).file === 2;
        else return this.getFileRankFromPos(pos).file === 7;
    }
     generateKnightMoves(pos, squares){
        let moves = [];
        let a = [2, -2], b = [1, -1], fileRank = this.getFileRankFromPos(pos);
        let file = fileRank.file, rank = fileRank.rank;
        for(let i=0;i<2;i++){
            for(let j=0;j<2;j++){
                let toMovefile = file + a[i];
                let toMoveRank = rank + b[j];
                let toMovePos = this.getPosFromFileRank(toMovefile, toMoveRank);
                if(this.canMove(toMovefile, toMoveRank, pos, squares)) moves.push(toMovePos);
                toMovefile = file + b[j];
                toMoveRank = rank + a[i];
                toMovePos = this.getPosFromFileRank(toMovefile, toMoveRank);
                if(this.canMove(toMovefile, toMoveRank, pos, squares)) moves.push(toMovePos);
            }
        }
        return moves;
    }

     generateKingMoves(pos, squares){
        let moves = [];
        let a = [1, 0, -1], fileRank = this.getFileRankFromPos(pos);
        let file = fileRank.file, rank = fileRank.rank;
        for(let i=0;i<3;i++){
            for(let j=0;j<3;j++){
                if(a[i]===0 &&a[j]===0) continue;
                let toMovefile = file + a[i];
                let toMoveRank = rank + a[j];
                let toMovePos = this.getPosFromFileRank(toMovefile, toMoveRank);
                if(this.canMove(toMovefile, toMoveRank, pos, squares)) moves.push(toMovePos);
            }
        }
        return moves;
    }


     insertSlideMove(file, rank, fromPos, squares){
        let toPos = this.getPosFromFileRank(file, rank);
        let state = {break: false, push: false, pos: toPos};

        if(this.isEmptySquare(toPos, squares)) state.push = true;
        else{
            if(this.canMove(file, rank, fromPos, squares)) state.push = true; 
            state.break = true;
        }
        return state;
    }

     generateRookMoves(pos, squares){
        let moves = [];
        let fileRank = this.getFileRankFromPos(pos);
        let file = fileRank.file, rank = fileRank.rank;
        let increment = [{file:1, rank:0},{file:-1, rank: 0}, {file: 0, rank:1}, {file:0, rank:-1}];

        for(let a_i=0;a_i<increment.length;a_i++){
            let fileIncrement = increment[a_i].file, rankIncrement = increment[a_i].rank;
            for(let i =file+fileIncrement, j=rank+rankIncrement; this.inRange(1, 8, i) && this.inRange(1, 8, j); i+=fileIncrement, j+=rankIncrement){
                let state = this.insertSlideMove(i, j, pos, squares);
                if(state.push) moves.push(state.pos);
                if(state.break) break;
            }
        }
        return moves;
    }

     inRange(lo, hi, num){ return num>=lo&&num<=hi; }

     generateBishopMoves(pos, squares){
        let moves = [];
        let fileRank = this.getFileRankFromPos(pos);
        let file = fileRank.file, rank = fileRank.rank;
        let incrementFile = [1, -1], incrementRank = [1, -1];
        for(let a_i=0;a_i<2;a_i++){
            for(let b_i=0;b_i<2;b_i++){
                let fileIncrement = incrementFile[a_i], rankIncrement = incrementRank[b_i];
                for(let i =file+fileIncrement, j=rank+rankIncrement; this.inRange(1, 8, i) && this.inRange(1, 8, j); i+=fileIncrement, j+=rankIncrement){
                    let state = this.insertSlideMove(i, j, pos, squares);
                    if(state.push) moves.push(state.pos);
                    if(state.break) break;
                }
            }
        }
        return moves;
    }

     Vertical(pos, step, squares){ return {pos:pos+8*step, piece: squares[pos+8*step]}; }
     Horizontal(pos, step, squares){ return {pos:pos+1*step, piece: squares[pos+1*step]}; }
     VerticalFileRank(file, rank, step){ return {file: file+step, rank: rank, pos: this.getPosFromFileRank(file+step, rank)}; }
     HorizontalFileRank(file, rank, step){ return {file: filstep, rank: rank+step, pos: this.getPosFromFileRank(file, rank+step)}; }

     VerticalRight(pos, step, squares){ return {pos:pos+8*step+step, piece: squares[pos+8*step+step]}; }
     VerticalLeft(pos, step, squares){ return {pos:pos+8*step-step, piece: squares[pos+8*step-step]}; }


     isKing(pos, squares){ return Pieces.IsType(squares[pos], Pieces.King) }

     WhiteMove(player){ return player === Pieces.White}
     BlackMove(player){ return player === Pieces.Black}



     canMoveOnPos(fromPos, toPos, squares){
        let fileRank = this.getFileRankFromPos(toPos);
        let file = fileRank.file, rank = fileRank.rank, pieceColor = this.getColor(squares[fromPos]);
        let isEnemy = this.isEnemyPiece(squares[toPos], pieceColor), isFriend = this.isFriendlyPiece(squares[toPos], pieceColor);
        if(!this.isValidFileRank(file, rank) || !this.isValidPos(toPos)) return false;
        if(isFriend) return false;
        if(this.isEmptySquare(toPos, squares)) return true;
        if(isEnemy && !this.isKing(toPos, squares)) return true;
        if(isEnemy && this.isKing(toPos, squares)){
            if(this.isWhite(squares[toPos])) this.IsWhiteOnCheck = true;
            if(this.isBlack(squares[toPos])) this.IsBlackOnCheck = true;
        };
        return false;
    }

     canMove(file, rank, fromPos, squares){
        let toPos = this.getPosFromFileRank(file, rank);
        if(!this.isValidFileRank(file, rank)) return false;
        return this.canMoveOnPos(fromPos, toPos, squares);
    }

     clearIndicatedAvailableMoves(){
         let squaresToIndicate = [];
        for(let i = 1; i<=64; i++){
            squaresToIndicate[i] = 0;
        }
        return squaresToIndicate;
    }

     indicateAvailableMoves(selected, squares, moves, player){
        let squaresToIndicate = this.clearIndicatedAvailableMoves();
        if(selected === null) return squaresToIndicate;
        let availableMoves = this.isFriendlyPiece(squares[selected], player)? moves[selected] : [];
        debugger
        for(let i=0; i<availableMoves.length; i++) {
            squaresToIndicate[availableMoves[i]] = 1;
        }
        return squaresToIndicate;
    }
    
     isAvailableToMove(pos){ return this.SquaresToIndicate && this.SquaresToIndicate[pos] !== 0; }

     fenIndex(pos){
        let fileRank = this.getFileRankFromPos(pos);
        return (8-fileRank.file)*8 + (8-fileRank.file) + fileRank.rank-1;
    }

     replaceInFen(index, ch, fen){ return fen.substring(0, index) + ch + fen.substring(index+1); }



     handlePawnPromotion(from, to, fen, squares){
        if(Pieces.IsType(squares[from], Pieces.Pawn)){
            if(this.isWhite(squares[from]) && this.getFileRankFromPos(to).file === 8) {
                fen = this.replaceInFen(this.fenIndex(to), 'Q', fen);
                fen = this.replaceInFen(this.fenIndex(from), '1', fen);
                return fen;
            }
            if(this.isBlack(squares[from]) && this.getFileRankFromPos(to).file === 1) {
                fen = this.replaceInFen(this.fenIndex(to), 'q', fen);
                fen = this.replaceInFen(this.fenIndex(from), '1', fen);
                return fen;
            }
        }
        return false;
    }

     makeMove(from, to, fen, squares){
        let updatedFen = this.handlePawnPromotion(from, to, fen, squares);
        if(updatedFen === false){
            updatedFen = this.replaceInFen(this.fenIndex(to), fen[this.fenIndex(from)], fen);
            updatedFen = this.replaceInFen(this.fenIndex(from), '1', updatedFen);
        }
        return updatedFen;
    }

     clickedOnSquare(selectedSquare, fen, squares, moves, player){
        let state = {moveMade: false, fen: fen, movesToIndicate: []}
        if(this.isAvailableToMove(selectedSquare)){
            fen = this.makeMove(this.PickedSquare, selectedSquare, fen, squares);
            this.PickedSquare = null;
            state.moveMade = true;
            state.fen = fen;
        }
        else{
            this.PickedSquare = selectedSquare;
        }
        this.SquaresToIndicate = this.indicateAvailableMoves(this.PickedSquare, squares, moves, player);
        state.movesToIndicate = this.SquaresToIndicate;
        return state;
        
    }
}