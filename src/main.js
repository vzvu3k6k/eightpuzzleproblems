import {
  DIFFICULTIES,
  buildStateIndex,
  createPuzzleGenerator,
  findBlank,
  getNeighbors,
  rankBoard,
  isSolved,
  swap,
} from "./puzzle.js";
import { getMessage, resolveLocale } from "./i18n.js";
import { renderApp } from "./ui.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error("#app element not found");
}

const puzzleIndex = buildStateIndex();
const generatePuzzle = createPuzzleGenerator(puzzleIndex);

const state = {
  locale: resolveLocale(navigator.language),
  difficulty: null,
  puzzle: null,
  board: null,
  moveCount: 0,
  history: [],
  result: null,
  animatingTile: null,
  usedSolveOne: false,
  puzzleNumber: 1,
};

let animTimer = null;

function update() {
  document.documentElement.lang = state.locale;
  document.title = getMessage(state.locale, "pageTitle");
  renderApp(root, state);
}

function randomIntInclusive(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickTargetMoves(diff) {
  if (Number.isInteger(diff.moves)) return diff.moves;

  if (Array.isArray(diff.randomRange) && diff.randomRange.length === 2) {
    const [min, max] = diff.randomRange;
    if (Number.isInteger(min) && Number.isInteger(max) && min <= max) {
      return randomIntInclusive(min, max);
    }
  }

  throw new Error(`Unsupported difficulty config: ${diff.id}`);
}

function startPuzzle(diff) {
  const targetMoves = pickTargetMoves(diff);
  state.difficulty = diff;
  state.puzzle = generatePuzzle(targetMoves);
  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;
  state.usedSolveOne = false;
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

function handleSolveOne() {
  if (state.result || !state.board) return;

  const currentRank = rankBoard(state.board);
  const currentDistance = puzzleIndex.distanceByRank[currentRank];
  if (!Number.isInteger(currentDistance) || currentDistance <= 0) return;

  const blank = findBlank(state.board);
  const neighbors = getNeighbors(blank);

  for (const idx of neighbors) {
    const nextBoard = swap(state.board, blank, idx);
    const nextRank = rankBoard(nextBoard);
    const nextDistance = puzzleIndex.distanceByRank[nextRank];

    if (nextDistance === currentDistance - 1) {
      state.usedSolveOne = true;
      handleTileClick(idx);
      return;
    }
  }
}

function handleReset() {
  if (!state.puzzle) return;

  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;
  state.usedSolveOne = false;

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
  state.usedSolveOne = false;
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

function parseDifficulty(value) {
  if (!value) return null;
  return DIFFICULTIES.find((d) => d.id === value) || null;
}

function handleActionClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;

  if (action === "start") {
    const diff = parseDifficulty(button.dataset.difficultyId);
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

  if (action === "solve-one") {
    handleSolveOne();
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
    return;
  }

  if (action === "set-locale") {
    const locale = resolveLocale(button.dataset.locale);
    if (locale !== state.locale) {
      state.locale = locale;
      update();
    }
  }
}

root.addEventListener("click", handleActionClick);
window.addEventListener("keydown", handleKeyDown);

update();
