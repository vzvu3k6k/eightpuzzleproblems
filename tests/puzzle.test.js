import test from "node:test";
import assert from "node:assert/strict";

import {
  DIFFICULTIES,
  SOLVED,
  buildStateIndex,
  createPuzzleGenerator,
  findBlank,
  getOptimalFromIndex,
  getNeighbors,
  rankBoard,
  swap,
  unrankBoard,
} from "../src/puzzle.js";

test("rank/unrank roundtrip for solved board", () => {
  const rank = rankBoard(SOLVED);
  assert.ok(rank >= 0 && rank < 362880);
  assert.deepEqual(unrankBoard(rank), SOLVED);
});

test("rank/unrank roundtrip for sample boards", () => {
  const samples = [
    [1, 2, 3, 4, 5, 6, 0, 7, 8],
    [8, 7, 6, 5, 4, 3, 2, 1, 0],
    [2, 5, 0, 1, 8, 3, 4, 7, 6],
  ];

  for (const board of samples) {
    const rank = rankBoard(board);
    assert.deepEqual(unrankBoard(rank), board);
  }
});

test("swap does not mutate the original board", () => {
  const original = [1, 2, 3, 4, 5, 6, 7, 8, 0];
  const swapped = swap(original, 8, 7);
  assert.deepEqual(original, [1, 2, 3, 4, 5, 6, 7, 8, 0]);
  assert.deepEqual(swapped, [1, 2, 3, 4, 5, 6, 7, 0, 8]);
});

test("buildStateIndex covers all reachable states", () => {
  const index = buildStateIndex();
  assert.equal(index.reachableCount, 181440);

  const solvedRank = rankBoard(SOLVED);
  assert.equal(index.distanceByRank[solvedRank], 0);
});

test("getOptimalFromIndex returns 1 for a one-move board", () => {
  const index = buildStateIndex();
  const blank = findBlank(SOLVED);
  const neighbor = getNeighbors(blank)[0];
  const oneMoveBoard = swap(SOLVED, blank, neighbor);

  assert.equal(getOptimalFromIndex(index, oneMoveBoard), 1);
});

test("puzzle generator returns exact distance per difficulty", () => {
  const index = buildStateIndex();
  const generatePuzzle = createPuzzleGenerator(index);

  const fixedDiffs = DIFFICULTIES.filter((d) => Number.isInteger(d.moves));
  for (const diff of fixedDiffs) {
    for (let i = 0; i < 5; i += 1) {
      const puzzle = generatePuzzle(diff.moves);
      assert.equal(puzzle.optimal, diff.moves);
      assert.equal(getOptimalFromIndex(index, puzzle.board), diff.moves);
    }
  }
});

test("random difficulty range stays within configured bounds", () => {
  const index = buildStateIndex();
  const generatePuzzle = createPuzzleGenerator(index);
  const randomDiff = DIFFICULTIES.find((d) => d.id === "random");

  assert.ok(randomDiff);
  assert.ok(Array.isArray(randomDiff.randomRange));
  const [min, max] = randomDiff.randomRange;

  for (let i = 0; i < 50; i += 1) {
    const target = Math.floor(Math.random() * (max - min + 1)) + min;
    const puzzle = generatePuzzle(target);
    assert.ok(puzzle.optimal >= min && puzzle.optimal <= max);
    assert.equal(getOptimalFromIndex(index, puzzle.board), puzzle.optimal);
  }
});

test("every non-solved reachable board has a neighbor one step closer", () => {
  const index = buildStateIndex();

  for (let rank = 0; rank < index.distanceByRank.length; rank += 1) {
    const depth = index.distanceByRank[rank];
    if (depth === 255 || depth === 0) continue;

    const board = unrankBoard(rank);
    const blank = findBlank(board);
    const hasCloserNeighbor = getNeighbors(blank).some((n) => {
      const neighborBoard = swap(board, blank, n);
      const neighborRank = rankBoard(neighborBoard);
      return index.distanceByRank[neighborRank] === depth - 1;
    });

    assert.equal(hasCloserNeighbor, true);
  }
});
