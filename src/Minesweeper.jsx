import { useState, useEffect } from "react";
import Board from "./components/Board";
import { createBoard, DIFFICULTIES } from "./gameUtils";
import GameControls from "./components/GameControls";

export default function Minesweeper() {
  const [difficulty, setDifficulty] = useState(localStorage.getItem("difficulty") || "easy");
  const { rows: ROWS, cols: COLS, mines: MINES } = DIFFICULTIES[difficulty];
  const [board, setBoard] = useState(() => {
    const saved = localStorage.getItem("savedBoard");
    const savedDiff = localStorage.getItem("savedDifficulty");
    if (saved && savedDiff === difficulty) {
      try {
        return JSON.parse(saved);
      } catch {
        return createBoard(ROWS, COLS, MINES);
      }
    }
    return createBoard(ROWS, COLS, MINES);
  });
  const [gameOver, setGameOver] = useState(false);
  const [win, setWin] = useState(false);
  const [time, setTime] = useState(localStorage.getItem("savedBoard") ? parseInt(localStorage.getItem("savedTime")) || 0 : 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [lastClicked, setLastClicked] = useState(null);

  useEffect(() => {
    if (!gameOver && !win) {
      localStorage.setItem("savedTime", time.toString());
    }
    if (gameOver || win) {
      localStorage.removeItem("savedTime");
    }
  }, [time, gameOver, win]);

  useEffect(() => {
    if (!gameOver && !win) {
      localStorage.setItem("savedBoard", JSON.stringify(board));
      localStorage.setItem("savedDifficulty", difficulty);
    }
    if (gameOver || win) {
      localStorage.removeItem("savedBoard");
      localStorage.removeItem("savedDifficulty");
    }
  }, [board, gameOver, win, difficulty]);

  useEffect(() => {
    localStorage.setItem("difficulty", difficulty);
  }, [difficulty]);

  useEffect(() => {
    let interval = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTime((t) => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning]);

  const revealCell = (r, c) => {
    if (gameOver) return;
    if (!timerRunning) setTimerRunning(true);
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[r][c];

    // stop if revealed/flagged
    if (cell.revealed || cell.flagged) return;

    // mark revealed immediately
    cell.revealed = true;

    // if mine -> game over
    if (cell.mine) {
      setTimerRunning(false);
      setTime(0);
      setLastClicked({ r, c });
      setGameOver(true);
      setBoard(newBoard);
      return;
    }

    // flood fill only if count is 0
    if (cell.count === 0) {
      const queue = [[r, c]];

      while (queue.length) {
        const [cr, cc] = queue.pop();

        for (let dr = -1; dr <= 1; dr++) {
          for (let dc = -1; dc <= 1; dc++) {
            const nr = cr + dr,
              nc = cc + dc;
            if (
              nr >= 0 &&
              nr < ROWS &&
              nc >= 0 &&
              nc < COLS &&
              !newBoard[nr][nc].revealed &&
              !newBoard[nr][nc].mine
            ) {
              newBoard[nr][nc].revealed = true;
              if (newBoard[nr][nc].count === 0) queue.push([nr, nc]);
            }
          }
        }
      }
    }

    setLastClicked({ r, c });
    setBoard(newBoard);
  };

  const toggleFlag = (e, r, c) => {
    e.preventDefault();
    if (gameOver) return;
    const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
    const cell = newBoard[r][c];
    if (cell.revealed) return;
    cell.flagged = !cell.flagged;
    setBoard(newBoard);
  };

  useEffect(() => {
    if (!gameOver) {
      const unrevealed = board.flat().filter((c) => !c.revealed);
      const minesLeft = board.flat().filter((c) => c.mine && !c.revealed);
      if (unrevealed.length === minesLeft.length) {
        setWin(true);
        setTimerRunning(false);
      }
    }
  }, [board, gameOver]);

  const resetGame = () => {
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
    setWin(false);
    localStorage.removeItem("savedBoard");
    localStorage.removeItem("savedDifficulty");
    setTime(0);
    setTimerRunning(false);
  };

  useEffect(() => {
    // If a saved board exists AND matches the difficulty, load it instead of resetting
    const saved = localStorage.getItem("savedBoard");
    const savedDiff = localStorage.getItem("savedDifficulty");

    if (saved && savedDiff === difficulty) {
      try {
        setBoard(JSON.parse(saved));
        setGameOver(false);
        setWin(false);
        return;
      } catch {}
    }

    // Otherwise, start a new game normally
    const { rows, cols, mines } = DIFFICULTIES[difficulty];
    setBoard(createBoard(rows, cols, mines));
    setGameOver(false);
    setWin(false);
    setTime(0);
    setTimerRunning(false);
  }, [difficulty]);

  const remainingFlags = win
    ? 0
    : MINES - board.flat().filter((c) => c.flagged).length;

  return (
    <div className="flex flex-col items-center gap-4 p-4 text-center select-none">
      <h1 className="text-4xl font-bold text-gray-800 mb-2">💣 Minesweeper</h1>
      <GameControls
        gameOver={gameOver}
        win={win}
        remainingFlags={remainingFlags}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        resetGame={resetGame}
        time={time}
      />
      <Board
        board={board}
        difficulty={difficulty}
        gameOver={gameOver}
        win={win}
        revealCell={revealCell}
        toggleFlag={toggleFlag}
        lastClicked={lastClicked}
      />
    </div>
  );
}
