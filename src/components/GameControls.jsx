export default function GameControls({
  gameOver,
  win,
  remainingFlags,
  difficulty,
  setDifficulty,
  resetGame,
  time,
}) {
  const minutes = Math.floor(time / 60);
  const seconds = time % 60;
  const formattedTime = `${String(minutes).padStart(2, "0")}:${String(
    seconds
  ).padStart(2, "0")}`;
  return (
    <div className="flex flex-col items-center gap-2 p-3 max-w-xl">
      {/* Top row: Status + Mine count */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <div className="text-lg font-semibold w-36 text-center">
          {gameOver && <div className="text-red-600">☠️ You blew up!</div>}
          {win && <div className="text-green-600">🎉 You win!</div>}
          {!gameOver && !win && <div className="text-gray-700">🎮 Playing</div>}
        </div>
        <div className="text-gray-700 font-medium w-24 text-center">
          🚩 {remainingFlags} left
        </div>
        <div className="text-gray-700 font-medium w-20 text-center">
          ⏱ {formattedTime}
        </div>
      </div>

      {/* Bottom row: Difficulty + Restart */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <select
          className="border border-gray-300 rounded-md px-3 py-1 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-maroon "
          value={difficulty}
          onChange={(e) => {
            resetGame(e.target.value);
            setDifficulty(e.target.value);
          }}
        >
          <option value="easy">Easy</option>
          <option value="normal">Normal</option>
          <option value="hard">Hard</option>
          <option value="asian">Asian</option>
        </select>

        <button
          className="px-4 py-1.5 bg-maroon text-white rounded-md hover:bg-darkmaroon text-sm font-medium"
          onClick={resetGame}
        >
          Restart
        </button>
      </div>
    </div>
  );
}
