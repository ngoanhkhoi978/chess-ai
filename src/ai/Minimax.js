import { evaluateBoard } from './BoardEvaluation.js';

export const minimax = (depth, game, isMaximizingPlayer, alpha, beta) => {
    if (depth === 0 || game.isGameOver()) {
        return evaluateBoard(game);
    }

    const moves = game.moves();
    if (isMaximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(depth - 1, game, false, alpha, beta);
            game.undo();
            maxEval = Math.max(maxEval, evalScore);
            alpha = Math.max(alpha, evalScore);
            if (beta <= alpha) break; // Cắt tỉa Alpha-Beta
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of moves) {
            game.move(move);
            const evalScore = minimax(depth - 1, game, true, alpha, beta);
            game.undo();
            minEval = Math.min(minEval, evalScore);
            beta = Math.min(beta, evalScore);
            if (beta <= alpha) break; // Cắt tỉa Alpha-Beta
        }
        return minEval;
    }
};

export const getBestMove = (game, depth = 3) => {
    const moves = game.moves();
    let bestMove = null;
    let bestValue = Infinity; // AI là bên tối thiểu hóa

    for (const move of moves) {
        game.move(move);
        const value = minimax(depth - 1, game, true, -Infinity, Infinity);
        game.undo();
        if (value < bestValue) {
            bestValue = value;
            bestMove = move;
        }
    }

    return bestMove;
};
