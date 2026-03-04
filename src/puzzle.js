export const SOLVED = [1, 2, 3, 4, 5, 6, 7, 8, 0];

const NEIGHBOR_MAP = {
  0: [1, 3],
  1: [0, 2, 4],
  2: [1, 5],
  3: [0, 4, 6],
  4: [1, 3, 5, 7],
  5: [2, 4, 8],
  6: [3, 7],
  7: [4, 6, 8],
  8: [5, 7],
};

export const DIFFICULTIES = [
  { label: "三手", moves: 3, kanji: "初" },
  { label: "五手", moves: 5, kanji: "中" },
  { label: "七手", moves: 7, kanji: "上" },
  { label: "十手", moves: 10, kanji: "極" },
];

export function findBlank(board) {
  return board.indexOf(0);
}

export function getNeighbors(idx) {
  return NEIGHBOR_MAP[idx];
}

export function swap(board, i, j) {
  const b = [...board];
  [b[i], b[j]] = [b[j], b[i]];
  return b;
}

export function boardKey(board) {
  return board.join(",");
}

export function isSolved(board) {
  for (let i = 0; i < SOLVED.length; i += 1) {
    if (board[i] !== SOLVED[i]) return false;
  }
  return true;
}

// BFS to find optimal solution length
export function optimalMoves(board) {
  if (isSolved(board)) return 0;

  const visited = new Set([boardKey(board)]);
  let queue = [{ board, depth: 0 }];

  while (queue.length > 0) {
    const next = [];

    for (const { board: b, depth } of queue) {
      const blank = findBlank(b);

      for (const n of getNeighbors(blank)) {
        const nb = swap(b, blank, n);
        const key = boardKey(nb);

        if (isSolved(nb)) return depth + 1;

        if (!visited.has(key)) {
          visited.add(key);
          next.push({ board: nb, depth: depth + 1 });
        }
      }
    }

    queue = next;
  }

  return -1;
}

function randomWalkFromSolved(steps) {
  let board = [...SOLVED];
  let lastBlank = -1;

  for (let i = 0; i < steps; i += 1) {
    const blank = findBlank(board);
    const neighbors = getNeighbors(blank).filter((n) => n !== lastBlank);
    const pick = neighbors[Math.floor(Math.random() * neighbors.length)];
    lastBlank = blank;
    board = swap(board, blank, pick);
  }

  return board;
}

export function generatePuzzle(
  targetMoves,
  opts = { tolerance: 1, maxAttempts: 2000 }
) {
  const tolerance = opts.tolerance ?? 1;
  const maxAttempts = opts.maxAttempts ?? 2000;

  let fallback = null;

  for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
    const board = randomWalkFromSolved(targetMoves * 3);
    const optimal = optimalMoves(board);

    if (optimal > 0) {
      if (!fallback || Math.abs(optimal - targetMoves) < Math.abs(fallback.optimal - targetMoves)) {
        fallback = { board, optimal };
      }

      if (optimal >= targetMoves - tolerance && optimal <= targetMoves + tolerance) {
        return { board, optimal };
      }
    }
  }

  if (fallback) return fallback;

  const safeBoard = randomWalkFromSolved(Math.max(6, targetMoves * 2));
  return { board: safeBoard, optimal: Math.max(1, optimalMoves(safeBoard)) };
}
