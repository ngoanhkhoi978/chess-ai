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
    const [depth, setDepth] = useState(3); // State cho độ sâu, mặc định là 3

    const onDrop = (sourceSquare, targetSquare, piece) => {
        console.log('onDrop called:', { sourceSquare, targetSquare, piece });
        const move = game.move({
            from: sourceSquare,
            to: targetSquare,
            promotion: 'q',
        });

        if (move === null) {
            console.log('Invalid move');
            return false;
        }

        setFen(game.getFen());
        setStatus('Thinking...');

        setTimeout(() => {
            makeAIMove();
        }, 1000);
        return true;
    };

    const makeAIMove = () => {
        const bestMove = getBestMove(game, depth); // Sử dụng depth từ state
        console.log('Best move:', bestMove);
        if (bestMove) {
            game.move(bestMove);
            setFen(game.getFen());
            setStatus('Your move!');
        }

        if (game.isGameOver()) {
            setStatus(game.inCheckmate() ? 'Checkmate!' : game.inDraw() ? 'Draw!' : 'Game over!');
        }
    };

    const resetGame = () => {
        const newGame = new ChessGame();
        setGame(newGame);
        setFen('start');
        setStatus('Your move!');
    };

    const handleDepthChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value >= 1 && value <= 5) {
            // Giới hạn depth từ 1-5
            setDepth(value);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-5xl font-bold mb-4">Chess AI Demo</h1>
            <img src={status === 'Thinking...' ? botThinking : bot} alt="" className="size-32" />
            <p className="text-lg mb-4">{status}</p>
            <div>
                <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={500} />
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
