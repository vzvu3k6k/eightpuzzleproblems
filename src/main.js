import {
  DIFFICULTIES,
  findBlank,
  generatePuzzle,
  getNeighbors,
  isSolved,
  swap,
} from "./puzzle.js";
import { renderApp } from "./ui.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error("#app element not found");
}

const state = {
  difficulty: null,
  puzzle: null,
  board: null,
  moveCount: 0,
  history: [],
  result: null,
  animatingTile: null,
  puzzleNumber: 1,
};

let animTimer = null;

function update() {
  renderApp(root, state);
}

function startPuzzle(diff) {
  state.difficulty = diff;
  state.puzzle = generatePuzzle(diff.moves);
  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;
  update();
}

function handleTileClick(idx) {
  if (state.result || !state.board) return;

  const blank = findBlank(state.board);
  if (!getNeighbors(blank).includes(idx)) return;

  if (animTimer) clearTimeout(animTimer);
  state.animatingTile = idx;

  const newBoard = swap(state.board, blank, idx);
  const newMoveCount = state.moveCount + 1;

  state.board = newBoard;
  state.moveCount = newMoveCount;
  state.history = [...state.history, newBoard];

  if (isSolved(newBoard)) {
    state.result = newMoveCount <= state.puzzle.optimal ? "correct" : "wrong";
  }

  update();

  animTimer = setTimeout(() => {
    state.animatingTile = null;
    update();
  }, 150);
}

function handleUndo() {
  if (state.result || state.history.length <= 1) return;

  const newHistory = state.history.slice(0, -1);
  state.history = newHistory;
  state.board = newHistory[newHistory.length - 1];
  state.moveCount -= 1;

  update();
}

function handleReset() {
  if (!state.puzzle) return;

  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;

  update();
}

function handleNext() {
  if (!state.difficulty) return;
  state.puzzleNumber += 1;
  startPuzzle(state.difficulty);
}

function handleBack() {
  state.difficulty = null;
  state.puzzle = null;
  state.board = null;
  state.moveCount = 0;
  state.history = [];
  state.result = null;
  state.animatingTile = null;
  state.puzzleNumber = 1;
  update();
}

function handleKeyDown(e) {
  if (!state.board || state.result) return;

  const blank = findBlank(state.board);
  const row = Math.floor(blank / 3);
  const col = blank % 3;

  let target = -1;
  if (e.key === "ArrowUp" && row < 2) target = blank + 3;
  if (e.key === "ArrowDown" && row > 0) target = blank - 3;
  if (e.key === "ArrowLeft" && col < 2) target = blank + 1;
  if (e.key === "ArrowRight" && col > 0) target = blank - 1;

  if (target >= 0) {
    e.preventDefault();
    handleTileClick(target);
  }

  if (e.key.toLowerCase() === "z" && (e.ctrlKey || e.metaKey)) {
    e.preventDefault();
    handleUndo();
  }
}

function parseMoves(value) {
  const moves = Number(value);
  if (!Number.isFinite(moves)) return null;
  return DIFFICULTIES.find((d) => d.moves === moves) || null;
}

function handleActionClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "start") {
    const diff = parseMoves(button.dataset.moves);
    if (diff) startPuzzle(diff);
    return;
  }

  if (action === "tile") {
    const idx = Number(button.dataset.idx);
    if (Number.isInteger(idx)) handleTileClick(idx);
    return;
  }

  if (action === "undo") {
    handleUndo();
    return;
  }

  if (action === "reset") {
    handleReset();
    return;
  }

  if (action === "next") {
    handleNext();
    return;
  }

  if (action === "back") {
    handleBack();
  }
}

root.addEventListener("click", handleActionClick);
window.addEventListener("keydown", handleKeyDown);

update();
