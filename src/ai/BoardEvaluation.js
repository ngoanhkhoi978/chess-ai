export const evaluateBoard = (game) => {
    const board = game.getBoard();
    let score = 0;

    const pieceValues = {
        p: 1,
        n: 3,
        b: 3,
        r: 5,
        q: 9,
        k: 0,
    };

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const value = pieceValues[piece.type];
                score += piece.color === 'w' ? value : -value;
            }
        }
    }

    return score;
};
