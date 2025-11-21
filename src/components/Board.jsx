export default function Board({
  board,
  difficulty,
  gameOver,
  win,
  revealCell,
  toggleFlag,
  lastClicked,
}) {
  const smallscreen =
    typeof window !== "undefined" && window.innerWidth < 600;

  return (
    <div
      className={`mt-4 max-h-[80vh] overflow-auto p-2 border rounded-lg shadow-inner
        ${win ? "bg-green-100" : "bg-gray-50"} ${
        gameOver ? "bg-red-100" : "bg-gray-50"
      }`}
    >
      {board.map((row, rIdx) => (
        <div className="flex justify-center" key={rIdx}>
          {row.map((cell, cIdx) => (
            <div
              key={cIdx}
              className={`${
                difficulty === "easy"
                  ? "w-8 h-8"
                  : difficulty === "normal"
                  ? "w-7 h-7"
                  : smallscreen?
                  "w-5 h-5"
                  : "w-6 h-6"
              } flex items-center justify-center border border-gray-400 text-sm font-bold
                ${
                  cell.revealed
                    ? "bg-gray-100"
                    : "bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
                }
                ${cell.revealed || gameOver || win ? "pointer-events-none" : ""}
                ${
                  gameOver &&
                  lastClicked &&
                  lastClicked.r === rIdx &&
                  lastClicked.c === cIdx
                    ? "bg-red-500 text-white"
                    : ""
                }`}
              // 👇 Fix long press vs tap
              onTouchStart={(e) => {
                e.persist();
                e.preventDefault(); // prevent Safari "ghost click"
                e.target.longPressTriggered = false;
                const timeout = setTimeout(() => {
                  toggleFlag(e, rIdx, cIdx);
                  e.target.longPressTriggered = true;
                }, 500);
                e.target.longPressTimeout = timeout;
              }}
              onTouchEnd={(e) => {
                clearTimeout(e.target.longPressTimeout);
                if (!e.target.longPressTriggered) {
                  revealCell(rIdx, cIdx);
                }
              }}
              // 👇 Only for desktop users
              onClick={(e) => {
                if (!("ontouchstart" in window)) revealCell(rIdx, cIdx);
              }}
              onContextMenu={(e) => {
                e.preventDefault();
                toggleFlag(e, rIdx, cIdx);
              }}
            >
              {/* If game over (loss) */}
              {gameOver ? (
                <>
                  {/* Correct flag on mine — keep the flag */}
                  {cell.flagged && cell.mine && "🚩"}

                  {/* Wrong flag — show red cross */}
                  {cell.flagged && !cell.mine && "❌"}

                  {/* Unflagged mine — show bomb */}
                  {!cell.flagged && cell.mine && "💣"}

                  {/* Revealed numbered cell */}
                  {cell.revealed && !cell.mine && cell.count > 0 && cell.count}
                </>
              ) : win ? (
                <>
                  {/* On win, show all mines with flags */}
                  {cell.mine && "🚩"}
                  {cell.revealed && !cell.mine && cell.count > 0 && cell.count}
                </>
              ) : (
                <>
                  {/* Normal gameplay (not game over) */}
                  {cell.revealed && !cell.mine && cell.count > 0 && cell.count}
                  {cell.flagged && !cell.revealed && "🚩"}
                  {cell.mine && false}
                </>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
