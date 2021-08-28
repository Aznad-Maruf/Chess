class Pieces{
    static None = 0;
    static Pawn = 1;
    static Knight = 2;
    static Bishop = 3;
    static Rook = 4;
    static Queen = 5;
    static King = 6;

    static White = 8;
    static Black = 16;

    static IsType(piece, type){
        return (piece&7) === type;
    }
}