export const evaluateBoard = (game) => {
    const board = game.getBoard();
    let score = 0;

    // Giá trị vật chất
    const pieceValues = {
        p: 100, // Tốt
        n: 320, // Mã
        b: 330, // Tượng
        r: 500, // Xe
        q: 900, // Hậu
        k: 20000, // Vua
    };

    // Bảng điểm vị trí (piece-square tables)
    const pawnTable = [
        0,  0,  0,  0,  0,  0,  0,  0,
        50, 50, 50, 50, 50, 50, 50, 50,
        10, 10, 20, 30, 30, 20, 10, 10,
        5,  5, 10, 25, 25, 10,  5,  5,
        0,  0,  0, 20, 20,  0,  0,  0,
        5, -5,-10,  0,  0,-10, -5,  5,
        5, 10, 10,-20,-20, 10, 10,  5,
        0,  0,  0,  0,  0,  0,  0,  0
    ];
    const knightTable = [
        -50,-40,-30,-30,-30,-30,-40,-50,
        -40,-20,  0,  0,  0,  0,-20,-40,
        -30,  0, 10, 15, 15, 10,  0,-30,
        -30,  5, 15, 20, 20, 15,  5,-30,
        -30,  0, 15, 20, 20, 15,  0,-30,
        -30,  5, 10, 15, 15, 10,  5,-30,
        -40,-20,  0,  5,  5,  0,-20,-40,
        -50,-40,-30,-30,-30,-30,-40,-50
    ];
    const bishopTable = [
        -20,-10,-10,-10,-10,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5, 10, 10,  5,  0,-10,
        -10,  5,  5, 10, 10,  5,  5,-10,
        -10,  0, 10, 10, 10, 10,  0,-10,
        -10, 10, 10, 10, 10, 10, 10,-10,
        -10,  5,  0,  0,  0,  0,  5,-10,
        -20,-10,-10,-10,-10,-10,-10,-20
    ];
    const rookTable = [
        0,  0,  0,  0,  0,  0,  0,  0,
        5, 10, 10, 10, 10, 10, 10,  5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        -5,  0,  0,  0,  0,  0,  0, -5,
        0,  0,  0,  5,  5,  0,  0,  0
    ];
    const queenTable = [
        -20,-10,-10, -5, -5,-10,-10,-20,
        -10,  0,  0,  0,  0,  0,  0,-10,
        -10,  0,  5,  5,  5,  5,  0,-10,
        -5,  0,  5,  5,  5,  5,  0, -5,
        0,  0,  5,  5,  5,  5,  0, -5,
        -10,  5,  5,  5,  5,  5,  0,-10,
        -10,  0,  5,  0,  0,  0,  0,-10,
        -20,-10,-10, -5, -5,-10,-10,-20
    ];
    const kingTable = [
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -30,-40,-40,-50,-50,-40,-40,-30,
        -20,-30,-30,-40,-40,-30,-30,-20,
        -10,-20,-20,-20,-20,-20,-20,-10,
        20, 20,  0,  0,  0,  0, 20, 20,
        20, 30, 10,  0,  0, 10, 30, 20
    ];

    // Kiểm soát trung tâm
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    const nearCenterSquares = ['c3', 'c4', 'c5', 'c6', 'd3', 'd6', 'e3', 'e6', 'f3', 'f4', 'f5', 'f6'];

    // Đánh giá an toàn vua
    const evaluateKingSafety = (kingSquare, color, board) => {
        let safetyScore = 0;
        const row = Math.floor(kingSquare / 8);
        const col = kingSquare % 8;
        const directions = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1],  [1, 0],  [1, 1]
        ];
        for (const [dr, dc] of directions) {
            const r = row + dr;
            const c = col + dc;
            if (r >= 0 && r < 8 && c >= 0 && c < 8) {
                const piece = board[r][c];
                if (piece && piece.color !== color) {
                    safetyScore -= 10; // Điểm phạt nếu quân địch ở gần vua
                }
            }
        }
        return safetyScore;
    };

    // Kiểm tra chiếu hết và hòa
    if (game.inCheckmate()) {
        return game.turn() === 'w' ? -10000 : 10000; // Trắng thua hoặc đen thua
    }
    if (game.inDraw()) {
        return 0; // Hòa
    }

    // Đánh giá vật chất, vị trí, trung tâm, an toàn vua
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            const piece = board[i][j];
            if (piece) {
                const squareIndex = i * 8 + j;
                const isWhite = piece.color === 'w';
                let positionScore = 0;

                // Giá trị vật chất
                const value = pieceValues[piece.type];
                score += isWhite ? value : -value;

                // Điểm vị trí theo bảng
                switch (piece.type) {
                    case 'p':
                        positionScore = pawnTable[isWhite ? 63 - squareIndex : squareIndex];
                        break;
                    case 'n':
                        positionScore = knightTable[isWhite ? 63 - squareIndex : squareIndex];
                        break;
                    case 'b':
                        positionScore = bishopTable[isWhite ? 63 - squareIndex : squareIndex];
                        break;
                    case 'r':
                        positionScore = rookTable[isWhite ? 63 - squareIndex : squareIndex];
                        break;
                    case 'q':
                        positionScore = queenTable[isWhite ? 63 - squareIndex : squareIndex];
                        break;
                    case 'k':
                        positionScore = kingTable[isWhite ? 63 - squareIndex : squareIndex];
                        // An toàn vua
                        positionScore += evaluateKingSafety(squareIndex, piece.color, board);
                        break;
                }
                score += isWhite ? positionScore : -positionScore;

                // Kiểm soát trung tâm
                const squareName = String.fromCharCode(97 + j) + (8 - i);
                if (centerSquares.includes(squareName)) {
                    score += isWhite ? 20 : -20;
                } else if (nearCenterSquares.includes(squareName)) {
                    score += isWhite ? 10 : -10;
                }
            }
        }
    }

    // Khả năng di động
    const moves = game.moves();
    const mobilityScore = moves.length * 2; // 2 điểm cho mỗi nước đi hợp lệ
    score += game.turn() === 'w' ? mobilityScore : -mobilityScore;

    return score;
};