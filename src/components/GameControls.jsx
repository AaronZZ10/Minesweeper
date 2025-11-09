export default function GameControls({ gameOver, win, remainingFlags, difficulty, setDifficulty, resetGame }) {
  return (
    <div className="flex flex-col items-center gap-2 p-3 max-w-xl">
      {/* Top row: Status + Mine count */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="text-lg font-semibold">
          {gameOver && <div className="text-red-600">💀 Game Over</div>}
          {win && <div className="text-green-600">🎉 You Win!</div>}
          {!gameOver && !win && <div className="text-gray-700">🙂 Playing</div>}
        </div>
        <div className="text-gray-700 font-medium">
          🚩 {remainingFlags} left
        </div>
      </div>

      {/* Bottom row: Difficulty + Restart */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <select
          className="border border-gray-300 rounded-md px-3 py-1 bg-white text-sm focus:ring-2 focus:ring-blue-400"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="asian">Asian</option>
        </select>

        <button
          className="px-4 py-1.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm font-medium"
          onClick={resetGame}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
