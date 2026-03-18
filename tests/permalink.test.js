import test from "node:test";
import assert from "node:assert/strict";

import { buildStateIndex, rankBoard, unrankBoard } from "../src/puzzle.js";
import {
  INVALID_PERMALINK_REASONS,
  buildPuzzlePermalink,
  parsePuzzlePermalink,
} from "../src/permalink.js";

test("buildPuzzlePermalink stores board rank in query param", () => {
  const board = [1, 2, 3, 4, 5, 6, 7, 0, 8];
  const permalink = buildPuzzlePermalink(board, "https://example.com/play?foo=1#hash");
  const url = new URL(permalink);

  assert.equal(url.searchParams.get("p"), String(rankBoard(board)));
  assert.equal(url.searchParams.get("foo"), "1");
  assert.equal(url.hash, "#hash");
});

test("parsePuzzlePermalink restores a reachable puzzle", () => {
  const index = buildStateIndex();
  const board = [1, 2, 3, 4, 5, 6, 0, 7, 8];
  const rank = rankBoard(board);

  const parsed = parsePuzzlePermalink(`?p=${rank}`, index.distanceByRank);

  assert.equal(parsed.kind, "puzzle");
  assert.deepEqual(parsed.board, board);
  assert.equal(parsed.optimal, 2);
  assert.equal(parsed.rank, rank);
});

test("parsePuzzlePermalink returns empty when p is absent", () => {
  const index = buildStateIndex();
  assert.deepEqual(parsePuzzlePermalink("?x=1", index.distanceByRank), { kind: "empty" });
});

test("parsePuzzlePermalink rejects malformed values", () => {
  const index = buildStateIndex();
  const parsed = parsePuzzlePermalink("?p=abc", index.distanceByRank);

  assert.equal(parsed.kind, "invalid");
  assert.equal(parsed.reason, INVALID_PERMALINK_REASONS.MALFORMED);
});

test("parsePuzzlePermalink rejects out of range values", () => {
  const index = buildStateIndex();
  const parsed = parsePuzzlePermalink("?p=362880", index.distanceByRank);

  assert.equal(parsed.kind, "invalid");
  assert.equal(parsed.reason, INVALID_PERMALINK_REASONS.OUT_OF_RANGE);
});

test("parsePuzzlePermalink rejects unreachable boards", () => {
  const index = buildStateIndex();
  const unreachableBoard = [1, 2, 3, 4, 5, 6, 8, 7, 0];
  const parsed = parsePuzzlePermalink(`?p=${rankBoard(unreachableBoard)}`, index.distanceByRank);

  assert.equal(parsed.kind, "invalid");
  assert.equal(parsed.reason, INVALID_PERMALINK_REASONS.UNREACHABLE);
});

test("unreachable test board is not altered by rank/unrank", () => {
  const board = [1, 2, 3, 4, 5, 6, 8, 7, 0];
  assert.deepEqual(unrankBoard(rankBoard(board)), board);
});
