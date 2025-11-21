export default function Board({
  board,
  difficulty,
  gameOver,
  win,
  revealCell,
  toggleFlag,
  lastClicked,
}) {
  const smallscreen = typeof window !== "undefined" && window.innerWidth < 600;

  return (
    <div
      className={`board-container mt-4 max-h-[80vh] overflow-auto p-2 border rounded-lg shadow-inner
        ${win ? "bg-green-100" : "bg-gray-50"} ${
        gameOver ? "bg-red-100" : "bg-gray-50"
      }`}
    >
      <>
        <style>
          {`
            .float-flag {
              position: absolute;
              font-size: 20px;
              animation: floatUp 600ms ease-out forwards;
              pointer-events: none;
            }
            @keyframes floatUp {
              0% { opacity: 0; transform: translateY(10px); }
              30% { opacity: 1; }
              100% { opacity: 0; transform: translateY(-25px); }
            }
            .ripple {
              position: absolute;
              width: 10px;
              height: 10px;
              border-radius: 50%;
              background: rgba(255, 255, 255, 0.6);
              transform: translate(-50%, -50%);
              animation: rippleExpand 500ms ease-out forwards;
              pointer-events: none;
            }
            @keyframes rippleExpand {
              0% { opacity: 0.8; transform: translate(-50%, -50%) scale(0.4); }
              100% { opacity: 0; transform: translate(-50%, -50%) scale(3); }
            }
            .flash-bg {
              animation: boardFlash 250ms ease-out;
            }
            @keyframes boardFlash {
              0% { background-color: rgba(150, 150, 150, 0.6); }
              100% { background-color: transparent; }
            }
          `}
        </style>
      </>
      {board.map((row, rIdx) => (
        <div className="flex justify-center" key={rIdx}>
          {row.map((cell, cIdx) => (
            <div key={cIdx} className="relative">
              <div
                className={`${
                  difficulty === "easy"
                    ? "w-8 h-8"
                    : difficulty === "normal"
                    ? "w-7 h-7"
                    : smallscreen
                    ? "w-5 h-5"
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
                    // --- begin inserted code ---
                    if (navigator && navigator.vibrate) navigator.vibrate(40);

                    const float = document.createElement("div");
                    float.className = "float-flag";
                    float.textContent = "🚩";
                    float.style.left = "50%";
                    float.style.top = "50%";
                    float.style.transform = "translate(-50%, -50%)";
                    e.target.parentElement.appendChild(float);
                    setTimeout(() => float.remove(), 600);

                    const ripple = document.createElement("div");
                    ripple.className = "ripple";
                    ripple.style.left = "50%";
                    ripple.style.top = "50%";
                    e.target.parentElement.appendChild(ripple);
                    setTimeout(() => ripple.remove(), 500);

                    const board = e.target.closest(".board-container");
                    if (board) {
                      board.classList.add("flash-bg");
                      setTimeout(() => board.classList.remove("flash-bg"), 250);
                    }
                    // --- end inserted code ---
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
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
