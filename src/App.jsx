import { useState } from 'react';
import { ChessGame } from './game/ChessGame';
import { getBestMove } from './ai/Minimax';
import { Chessboard } from 'react-chessboard';
import botThinking from './assets/bot_thinking.gif';
import bot from './assets/bot.png';

const App = () => {
    const [game, setGame] = useState(new ChessGame());
    const [fen, setFen] = useState('start');
    const [status, setStatus] = useState('Your move!');
    const [depth, setDepth] = useState(3);
    const [moveSquares, setMoveSquares] = useState({});
    const [highlightSquare, setHighlightSquare] = useState(null);

    const updateBoard = () => {
        setFen(game.getFen());
        highlightCheckSquare();
    };

    const onDrop = (sourceSquare, targetSquare) => {
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        if (move === null) return false;

        updateBoard();
        setStatus('Thinking...');
        setMoveSquares({});

        setTimeout(() => {
            makeAIMove();
        }, 1000);

        return true;
    };

    const makeAIMove = () => {
        const bestMove = getBestMove(game, depth);
        if (bestMove) {
            game.move(bestMove);
            updateBoard();
            setStatus('Your move!');
        }

        if (game.isGameOver()) {
            setStatus(game.inCheckmate() ? 'Checkmate!' : game.inDraw() ? 'Draw!' : 'Game over!');
        }
    };

    const highlightCheckSquare = () => {
        const board = game.getBoard();
        const inCheck = game.game.in_check();
        const kingColor = game.game.turn();

        if (!inCheck) {
            setHighlightSquare(null);
            return;
        }

        // Tìm ô vua
        for (let row of board) {
            for (let piece of row) {
                if (piece && piece.type === 'k' && piece.color === kingColor) {
                    setHighlightSquare(piece.square);
                    return;
                }
            }
        }
    };

    const resetGame = () => {
        const newGame = new ChessGame();
        setGame(newGame);
        setFen('start');
        setStatus('Your move!');
        setMoveSquares({});
        setHighlightSquare(null);
    };

    const handleDepthChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 5) {
            setDepth(value);
        }
    };

    const onSquareClick = (square) => {
        const moves = game.getMoves({ square, verbose: true });

        if (moves.length === 0) {
            setMoveSquares({});
            return;
        }

        const highlights = {};
        moves.forEach((move) => {
            highlights[move.to] = {
                background: 'radial-gradient(circle, rgba(0, 0, 0, 0.8) 5%, transparent 30%)',
                borderRadius: '50%',
            };
        });

        setMoveSquares(highlights);
    };

    const getCustomSquareStyles = () => {
        const styles = { ...moveSquares };

        if (highlightSquare) {
            styles[highlightSquare] = {
                background: 'rgba(255, 0, 0, 0.5)',
            };
        }

        return styles;
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-bold mb-4">Chess AI Demo</h1>
            <img src={status === 'Thinking...' ? botThinking : bot} alt="" className="size-32" />
            <p className="text-lg mb-4">{status}</p>
            <div>
                <Chessboard
                    position={fen}
                    onPieceDrop={onDrop}
                    onSquareClick={onSquareClick}
                    onPieceDragBegin={(piece, square) => onSquareClick(square)}
                    boardWidth={500}
                    customSquareStyles={getCustomSquareStyles()}
                />
            </div>
            <div className="mt-4 flex items-center space-x-4">
                <button onClick={resetGame} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
                    New Game
                </button>
                <div>
                    <label htmlFor="depth" className="mr-2">
                        Depth:
                    </label>
                    <input
                        id="depth"
                        type="number"
                        min="1"
                        max="5"
                        value={depth}
                        onChange={handleDepthChange}
                        className="w-16 px-2 py-1 border rounded"
                    />
                </div>
            </div>
        </div>
    );
};

export default App;
