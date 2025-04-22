import { Chess } from 'chess.js';

export class ChessGame {
    constructor() {
        this.game = new Chess();
    }

    move(move) {
        return this.game.move(move);
    }

    undo() {
        this.game.undo();
    }

    moves() {
        return this.game.moves();
    }

    getFen() {
        return this.game.fen();
    }

    isGameOver() {
        return this.game.game_over();
    }

    inCheckmate() {
        return this.game.in_checkmate();
    }

    inDraw() {
        return this.game.in_draw();
    }

    getBoard() {
        return this.game.board();
    }
}
