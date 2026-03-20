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
import { Actions } from "./actions.js";
import { buildPuzzlePermalink, parsePuzzlePermalink } from "./permalink.js";

const root = document.getElementById("app");

if (!root) {
  throw new Error("#app element not found");
}

const puzzleIndex = buildStateIndex();
const generatePuzzle = createPuzzleGenerator(puzzleIndex);

const HISTORY_KEY = "eightpuzzle-history";
const HISTORY_MAX = 100;

const state = {
  locale: resolveLocale(navigator.language),
  screen: "title",
  difficulty: null,
  puzzle: null,
  board: null,
  moveCount: 0,
  history: [],
  result: null,
  animatingTile: null,
  usedHint: false,
  puzzleNumber: 1,
  hintedTiles: [],
  fromHistory: false,
  fromPermalink: false,
  permalinkStatus: null,
};

let animTimer = null;
let permalinkStatusTimer = null;

function update() {
  document.documentElement.lang = state.locale;
  document.title = getMessage(state.locale, "pageTitle");
  renderApp(root, state, { loadHistory, puzzleIndex });
}

function clearPermalinkStatusTimer() {
  if (permalinkStatusTimer) {
    clearTimeout(permalinkStatusTimer);
    permalinkStatusTimer = null;
  }
}

function setPermalinkStatus(messageKey) {
  clearPermalinkStatusTimer();
  state.permalinkStatus = messageKey;
  update();

  if (!messageKey) return;

  permalinkStatusTimer = setTimeout(() => {
    state.permalinkStatus = null;
    permalinkStatusTimer = null;
    update();
  }, 1800);
}

function clearUrlPermalink() {
  const url = new URL(window.location.href);
  if (!url.searchParams.has("p")) return;
  url.searchParams.delete("p");
  window.history.replaceState({}, "", url);
}

function syncPuzzleUrl(board) {
  const href = buildPuzzlePermalink(board, window.location.href);
  window.history.replaceState({}, "", href);
}

function loadHistory() {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveResult() {
  const entry = {
    initialBoard: state.puzzle.board,
    moveCount: state.moveCount,
    result: state.result,
    difficulty: state.difficulty.id,
    usedSolveOne: state.usedSolveOne,
    timestamp: Date.now(),
  };
  const history = loadHistory();
  history.unshift(entry);
  if (history.length > HISTORY_MAX) history.length = HISTORY_MAX;
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
  } catch {
    // storage full — silently ignore
  }
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
  clearPermalinkStatusTimer();
  const targetMoves = pickTargetMoves(diff);
  state.screen = "game";
  state.difficulty = diff;
  state.puzzle = generatePuzzle(targetMoves);
  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;
  state.usedHint = false;
  state.hintedTiles = [];
  state.fromHistory = false;
  state.fromPermalink = false;
  state.permalinkStatus = null;
  syncPuzzleUrl(state.puzzle.board);
  update();
}

function startPuzzleFromHistory(board, difficultyId) {
  clearPermalinkStatusTimer();
  const rank = rankBoard(board);
  const optimal = puzzleIndex.distanceByRank[rank];
  const diff = DIFFICULTIES.find((d) => d.id === difficultyId) || DIFFICULTIES[0];

  state.screen = "game";
  state.difficulty = diff;
  state.puzzle = { board, optimal };
  state.board = [...board];
  state.moveCount = 0;
  state.history = [board];
  state.result = null;
  state.animatingTile = null;
  state.usedHint = false;
  state.hintedTiles = [];
  state.fromHistory = true;
  state.fromPermalink = false;
  state.permalinkStatus = null;
  syncPuzzleUrl(board);
  update();
}

function startPuzzleFromPermalink(board, optimal) {
  clearPermalinkStatusTimer();
  state.screen = "game";
  state.difficulty = null;
  state.puzzle = { board, optimal };
  state.board = [...board];
  state.moveCount = 0;
  state.history = [board];
  state.result = null;
  state.animatingTile = null;
  state.usedHint = false;
  state.hintedTiles = [];
  state.fromHistory = false;
  state.fromPermalink = true;
  state.puzzleNumber = 1;
  state.permalinkStatus = null;
  syncPuzzleUrl(board);
  update();
}

function showInvalidPermalink() {
  clearPermalinkStatusTimer();
  state.screen = "invalid-permalink";
  state.difficulty = null;
  state.puzzle = null;
  state.board = null;
  state.moveCount = 0;
  state.history = [];
  state.result = null;
  state.animatingTile = null;
  state.puzzleNumber = 1;
  state.usedHint = false;
  state.hintedTiles = [];
  state.fromHistory = false;
  state.fromPermalink = false;
  state.permalinkStatus = null;
  clearUrlPermalink();
  update();
}

function handleTileClick(idx) {
  if (state.result || !state.board) return;

  const blank = findBlank(state.board);
  if (!getNeighbors(blank).includes(idx)) return;

  state.hintedTiles = [];

  if (animTimer) clearTimeout(animTimer);
  state.animatingTile = idx;

  const newBoard = swap(state.board, blank, idx);
  const newMoveCount = state.moveCount + 1;

  state.board = newBoard;
  state.moveCount = newMoveCount;
  state.history = [...state.history, newBoard];

  if (isSolved(newBoard)) {
    state.result = newMoveCount <= state.puzzle.optimal ? "correct" : "wrong";
    saveResult();
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
  state.hintedTiles = [];

  update();
}

function handleShowHint() {
  if (state.result || !state.board) return;

  const currentRank = rankBoard(state.board);
  const currentDistance = puzzleIndex.distanceByRank[currentRank];
  if (!Number.isInteger(currentDistance) || currentDistance <= 0) return;

  const blank = findBlank(state.board);
  const neighbors = getNeighbors(blank);

  const optimalMoves = [];
  for (const idx of neighbors) {
    const nextBoard = swap(state.board, blank, idx);
    const nextRank = rankBoard(nextBoard);
    const nextDistance = puzzleIndex.distanceByRank[nextRank];

    if (nextDistance === currentDistance - 1) {
      optimalMoves.push(idx);
    }
  }

  if (optimalMoves.length > 0) {
    state.usedHint = true;
    state.hintedTiles = optimalMoves;
    update();
  }
}

function handleReset() {
  if (!state.puzzle) return;
  clearPermalinkStatusTimer();

  state.board = [...state.puzzle.board];
  state.moveCount = 0;
  state.history = [state.puzzle.board];
  state.result = null;
  state.animatingTile = null;
  state.usedHint = false;
  state.hintedTiles = [];
  state.permalinkStatus = null;

  update();
}

function handleNext() {
  clearPermalinkStatusTimer();
  if (state.fromPermalink) {
    state.screen = "title";
    state.fromPermalink = false;
    state.difficulty = null;
    state.puzzle = null;
    state.board = null;
    state.moveCount = 0;
    state.history = [];
    state.result = null;
    state.animatingTile = null;
    state.puzzleNumber = 1;
    state.usedHint = false;
    state.hintedTiles = [];
    state.permalinkStatus = null;
    clearUrlPermalink();
    update();
    return;
  }
  if (state.fromHistory) {
    state.screen = "history";
    state.fromHistory = false;
    state.difficulty = null;
    state.puzzle = null;
    state.board = null;
    state.moveCount = 0;
    state.history = [];
    state.result = null;
    state.animatingTile = null;
    state.usedHint = false;
    state.hintedTiles = [];
    state.permalinkStatus = null;
    clearUrlPermalink();
    update();
    return;
  }
  if (!state.difficulty) return;
  state.puzzleNumber += 1;
  startPuzzle(state.difficulty);
}

function handleBack() {
  clearPermalinkStatusTimer();
  state.screen = state.fromHistory ? "history" : "title";
  state.fromHistory = false;
  state.fromPermalink = false;
  state.difficulty = null;
  state.puzzle = null;
  state.board = null;
  state.moveCount = 0;
  state.history = [];
  state.result = null;
  state.animatingTile = null;
  state.puzzleNumber = 1;
  state.usedHint = false;
  state.hintedTiles = [];
  state.permalinkStatus = null;
  clearUrlPermalink();
  update();
}

async function copyPermalinkToClipboard() {
  if (!state.puzzle) return;

  const permalink = buildPuzzlePermalink(state.puzzle.board, window.location.href);

  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(permalink);
    } else {
      const input = document.createElement("textarea");
      input.value = permalink;
      input.setAttribute("readonly", "true");
      input.style.position = "absolute";
      input.style.left = "-9999px";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      document.body.removeChild(input);
      if (!copied) throw new Error("copy failed");
    }
    setPermalinkStatus("permalinkCopied");
  } catch {
    setPermalinkStatus("permalinkCopyFailed");
  }
}

function handleKeyDown(e) {
  if (!state.board || state.result) return;

  const blank = findBlank(state.board);
  const row = Math.floor(blank / 3);
  const col = blank % 3;

  let target = -1;
  if ((e.key === "ArrowUp" || e.key.toLowerCase() === "w") && row < 2) target = blank + 3;
  if ((e.key === "ArrowDown" || e.key.toLowerCase() === "s") && row > 0) target = blank - 3;
  if ((e.key === "ArrowLeft" || e.key.toLowerCase() === "a") && col < 2) target = blank + 1;
  if ((e.key === "ArrowRight" || e.key.toLowerCase() === "d") && col > 0) target = blank - 1;

  if (target >= 0) {
    e.preventDefault();
    handleTileClick(target);
  }

  if (e.key.toLowerCase() === "u") {
    e.preventDefault();
    handleUndo();
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

const actionHandlers = {
  [Actions.START]: (el) => {
    const diff = parseDifficulty(el.dataset.difficultyId);
    if (diff) startPuzzle(diff);
  },
  [Actions.TILE]: (el) => {
    const idx = Number(el.dataset.idx);
    if (Number.isInteger(idx)) handleTileClick(idx);
  },
  [Actions.UNDO]: () => {
    handleUndo();
  },
  [Actions.SHOW_HINT]: () => {
    handleShowHint();
  },
  [Actions.RESET]: () => {
    handleReset();
  },
  [Actions.NEXT]: () => {
    handleNext();
  },
  [Actions.BACK]: () => {
    handleBack();
  },
  [Actions.COPY_PERMALINK]: () => {
    void copyPermalinkToClipboard();
  },
  [Actions.HISTORY]: () => {
    clearPermalinkStatusTimer();
    state.screen = "history";
    clearUrlPermalink();
    update();
  },
  [Actions.HISTORY_BACK]: () => {
    clearPermalinkStatusTimer();
    state.screen = "title";
    clearUrlPermalink();
    update();
  },
  [Actions.INVALID_PERMALINK_BACK]: () => {
    clearPermalinkStatusTimer();
    state.screen = "title";
    clearUrlPermalink();
    update();
  },
  [Actions.HISTORY_PLAY]: (el) => {
    const index = Number(el.dataset.historyIndex);
    const entries = loadHistory();
    const entry = entries[index];
    if (entry) {
      startPuzzleFromHistory(entry.initialBoard, entry.difficulty);
    }
  },
  [Actions.SET_LOCALE]: (el) => {
    const locale = resolveLocale(el.dataset.locale);
    if (locale !== state.locale) {
      state.locale = locale;
      update();
    }
  },
};

function handleActionClick(event) {
  const button = event.target.closest("[data-action]");
  if (!button) return;

  const action = button.dataset.action;
  const handler = actionHandlers[action];
  if (handler) handler(button);
}

root.addEventListener("click", handleActionClick);
window.addEventListener("keydown", handleKeyDown);

const parsedPermalink = parsePuzzlePermalink(window.location.search, puzzleIndex.distanceByRank);
if (parsedPermalink.kind === "puzzle") {
  startPuzzleFromPermalink(parsedPermalink.board, parsedPermalink.optimal);
} else if (parsedPermalink.kind === "invalid") {
  showInvalidPermalink();
} else {
  update();
}
