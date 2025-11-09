export default function Board({
  board,
  difficulty,
  gameOver,
  win,
  revealCell,
  toggleFlag,
}) {
  return (
    <div className="mt-4 max-h-[80vh] overflow-auto p-2 border rounded-lg bg-gray-50 shadow-inner">
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
                  : "w-6 h-6"
              } flex items-center justify-center border border-gray-400 text-sm font-bold
                ${
                  cell.revealed
                    ? "bg-gray-100"
                    : "bg-gray-200 hover:bg-gray-300 hover:cursor-pointer"
                }
                ${
                  cell.revealed || gameOver || win
                    ? "pointer-events-none"
                    : ""
                }
                ${cell.mine && gameOver ? "bg-red-500 text-white" : ""}`}
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
              {cell.revealed && !cell.mine && cell.count > 0 && cell.count}
              {cell.flagged && !gameOver && !cell.revealed && "🚩"}
              {cell.mine && gameOver && "💣"}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}