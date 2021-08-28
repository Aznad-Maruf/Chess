class Board{

    static startX; static startY; static cellSize; static lightColor; static darkColor;
    static initiate(startX, startY, boardSize, lightColor, darkColor){
        this.startX = startX; this.startY = startY; this.cellSize = Math.floor(boardSize/8); 
        this.lightColor = lightColor; this.darkColor = darkColor;
    }
    static Squares = [64];
    
    static drawCell(x, y, color){
        noStroke();
        fill(color);
        square(x, y, this.cellSize);
    }
    
    static drawBoard(){
        for(let file=0; file<8; file++){
            for(let rank=0; rank<8; rank++){
                let fillColor;
                if((file+rank)%2 === 0) fillColor = this.lightColor;
                else fillColor = this.darkColor;
                this.drawCell(this.startX+rank*this.cellSize, this.startY+file*this.cellSize, fillColor);
            }
        }
    }
}