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

const FACTORIAL = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880];
const PERMUTATION_COUNT = FACTORIAL[9];
const UNREACHABLE = 255;

export const DIFFICULTIES = [
  { id: "easy", moves: 7 },
  { id: "medium", moves: 10 },
  { id: "hard", moves: 15 },
  { id: "random", randomRange: [10, 31] },
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

export function isSolved(board) {
  for (let i = 0; i < SOLVED.length; i += 1) {
    if (board[i] !== SOLVED[i]) return false;
  }
  return true;
}

export function rankBoard(board) {
  let rank = 0;

  for (let i = 0; i < board.length; i += 1) {
    let smaller = 0;
    for (let j = i + 1; j < board.length; j += 1) {
      if (board[j] < board[i]) smaller += 1;
    }
    rank += smaller * FACTORIAL[board.length - 1 - i];
  }

  return rank;
}

export function unrankBoard(rank) {
  if (!Number.isInteger(rank) || rank < 0 || rank >= PERMUTATION_COUNT) {
    throw new Error(`rank out of range: ${rank}`);
  }

  const available = [0, 1, 2, 3, 4, 5, 6, 7, 8];
  const board = [];
  let remain = rank;

  for (let i = 8; i >= 0; i -= 1) {
    const base = FACTORIAL[i];
    const q = Math.floor(remain / base);
    remain %= base;
    board.push(available.splice(q, 1)[0]);
  }

  return board;
}

export function buildStateIndex() {
  const distanceByRank = new Uint8Array(PERMUTATION_COUNT);
  distanceByRank.fill(UNREACHABLE);

  const solvedRank = rankBoard(SOLVED);
  distanceByRank[solvedRank] = 0;

  const ranksByDistance = [[solvedRank]];
  let queue = [SOLVED];
  let depth = 0;
  let reachableCount = 1;

  while (queue.length > 0) {
    const next = [];

    for (const board of queue) {
      const blank = findBlank(board);

      for (const n of getNeighbors(blank)) {
        const nb = swap(board, blank, n);
        const rank = rankBoard(nb);

        if (distanceByRank[rank] !== UNREACHABLE) continue;

        const nextDepth = depth + 1;
        distanceByRank[rank] = nextDepth;

        if (!ranksByDistance[nextDepth]) ranksByDistance[nextDepth] = [];
        ranksByDistance[nextDepth].push(rank);

        reachableCount += 1;
        next.push(nb);
      }
    }

    queue = next;
    depth += 1;
  }

  return {
    distanceByRank,
    ranksByDistance,
    reachableCount,
  };
}

export function getOptimalFromIndex(index, board) {
  const rank = rankBoard(board);
  const depth = index.distanceByRank[rank];
  return depth === UNREACHABLE ? -1 : depth;
}

export function createPuzzleGenerator(index) {
  return function generatePuzzle(targetMoves) {
    const direct = index.ranksByDistance[targetMoves] || [];

    if (direct.length > 0) {
      const rank = direct[Math.floor(Math.random() * direct.length)];
      return {
        board: unrankBoard(rank),
        optimal: targetMoves,
      };
    }

    let bestDistance = -1;
    for (let offset = 1; offset < index.ranksByDistance.length; offset += 1) {
      const lower = targetMoves - offset;
      if (lower >= 0 && (index.ranksByDistance[lower] || []).length > 0) {
        bestDistance = lower;
        break;
      }

      const upper = targetMoves + offset;
      if ((index.ranksByDistance[upper] || []).length > 0) {
        bestDistance = upper;
        break;
      }
    }

    if (bestDistance < 0) {
      throw new Error(`No puzzle state found for targetMoves=${targetMoves}`);
    }

    const pool = index.ranksByDistance[bestDistance];
    const rank = pool[Math.floor(Math.random() * pool.length)];

    return {
      board: unrankBoard(rank),
      optimal: bestDistance,
    };
  };
}
