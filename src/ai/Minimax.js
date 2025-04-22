import { evaluateBoard } from './BoardEvaluation.js';

// Bảng chuyển vị
const transpositionTable = new Map();

// Hàm sắp xếp nước đi
const sortMoves = (game, moves) => {
    const centerSquares = ['d4', 'd5', 'e4', 'e5'];
    const sortedMoves = moves.map(move => {
        let priority = 0;
        const moveObj = game.move(move);
        const toSquare = move.to;

        // Ưu tiên bắt quân
        if (moveObj.captured) {
            priority += 100;
        }

        // Ưu tiên chiếu
        if (game.inCheck()) {
            priority += 50;
        }

        // Ưu tiên di chuyển đến trung tâm
        if (centerSquares.includes(toSquare)) {
            priority += 20;
        }

        game.undo();
        return { move, priority };
    });

    sortedMoves.sort((a, b) => b.priority - a.priority);
    return sortedMoves.map(item => item.move);
};

// Hàm Minimax với cắt tỉa Alpha-Beta
export const minimax = (depth, game, isMaximizingPlayer, alpha, beta) => {
    // Kiểm tra bảng chuyển vị
    const fen = game.getFen();
    const ttKey = `${fen}_${depth}_${isMaximizingPlayer}`;
    if (transpositionTable.has(ttKey)) {
        return transpositionTable.get(ttKey);
    }

    if (depth === 0 || game.isGameOver()) {
        const score = evaluateBoard(game);
        transpositionTable.set(ttKey, score);
        return score;
    }

    const moves = sortMoves(game, game.moves());
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(depth - 1, game, false, alpha, beta);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break;
        }
        transpositionTable.set(ttKey, maxEval);
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(depth - 1, game, true, alpha, beta);
            game.undo();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break;
        }
        transpositionTable.set(ttKey, minEval);
        return minEval;
    }
};

// Hàm Iterative Deepening
export const getBestMove = (game, maxDepth = 3, maxTime = 3000) => {
    const startTime = performance.now();
    let bestMove = null;
    let bestValue = Infinity; // AI là bên tối thiểu hóa

    for (let depth = 1; depth <= maxDepth; depth++) {
        if (performance.now() - startTime > maxTime) {
            break; // Dừng nếu vượt quá thời gian
        }

        const moves = sortMoves(game, game.moves());
        let currentBestMove = null;
        let currentBestValue = Infinity;

        for (const move of moves) {
            game.move(move);
            const value = minimax(depth - 1, game, true, -Infinity, Infinity);
            game.undo();
            if (value < currentBestValue) {
                currentBestValue = value;
                currentBestMove = move;
            }
        }

        // Cập nhật nước đi tốt nhất nếu tìm thấy
        if (currentBestMove) {
            bestMove = currentBestMove;
            bestValue = currentBestValue;
        }
    }

    // Xóa bảng chuyển vị để tránh tràn bộ nhớ
    if (transpositionTable.size > 100000) {
        transpositionTable.clear();
    }

    return bestMove;
};