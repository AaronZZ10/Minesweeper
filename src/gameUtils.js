export function createBoard(rows, cols, mines) {
  const board = Array(rows)
    .fill()
    .map(() =>
      Array(cols).fill({
        revealed: false,
        mine: false,
        flagged: false,
        count: 0,
      })
    );

  // Deep copy rows
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));

  // Place mines randomly
  let placed = 0;
  while (placed < mines) {
    const r = Math.floor(Math.random() * rows);
    const c = Math.floor(Math.random() * cols);
    if (!newBoard[r][c].mine) {
      newBoard[r][c].mine = true;
      placed++;
    }
  }

  // Calculate adjacent mine counts
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (newBoard[r][c].mine) continue;
      let count = 0;
      for (let dr = -1; dr <= 1; dr++) {
        for (let dc = -1; dc <= 1; dc++) {
          const nr = r + dr,
            nc = c + dc;
          if (
            nr >= 0 &&
            nr < rows &&
            nc >= 0 &&
            nc < cols &&
            newBoard[nr][nc].mine
          )
            count++;
        }
      }
      newBoard[r][c].count = count;
    }
  }

  return newBoard;
}
