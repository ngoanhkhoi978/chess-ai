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

    getMoves(options) {
        return this.game.moves(options);
    }

    turn() {
        return this.game.turn();
    }

    inCheck() {
        return this.game.in_check();
    }

    getPhase() {
        const board = this.getBoard();
        let pieceCount = 0;
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col]) pieceCount++;
            }
        }

        // Lấy số nước đi từ FEN (phần thứ 6 sau khi split)
        const fenParts = this.getFen().split(' ');
        const moveCount = parseInt(fenParts[5]) || 0;

        if (moveCount < 10 || pieceCount > 24) return 'opening';
        if (moveCount > 30 || pieceCount < 10) return 'endgame';
        return 'middlegame';
    }
}
