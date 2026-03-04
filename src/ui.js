import { DIFFICULTIES, findBlank, getNeighbors } from "./puzzle.js";
import { getDifficultyText, getMessage } from "./i18n.js";
import { styles, applyStyles, withHoverStyle } from "./styles.js";

function el(tag, style, text) {
  const node = document.createElement(tag);
  if (style) applyStyles(node, style);
  if (text !== undefined) node.textContent = text;
  return node;
}

function makeButton(label, style, action, disabled = false) {
  const button = el("button", style, label);
  button.dataset.action = action;
  if (disabled) {
    button.disabled = true;
    button.style.opacity = "0.4";
  }
  return button;
}

function createLocaleSwitch(locale) {
  const switcher = el("div", styles.localeSwitch);
  const options = [
    { locale: "ja", key: "localeJa" },
    { locale: "en", key: "localeEn" },
  ];

  for (const option of options) {
    const active = locale === option.locale;
    const button = el(
      "button",
      active ? { ...styles.localeButton, ...styles.localeButtonActive } : styles.localeButton,
      getMessage(locale, option.key)
    );
    button.dataset.action = "set-locale";
    button.dataset.locale = option.locale;
    button.setAttribute("aria-pressed", active ? "true" : "false");
    switcher.appendChild(button);
  }

  return switcher;
}

export function renderTitleScreen(container, state) {
  const { locale } = state;
  const titleScreen = el("div", styles.titleScreen);

  const topRow = el("div", styles.titleTopRow);
  topRow.appendChild(createLocaleSwitch(locale));
  titleScreen.appendChild(topRow);

  titleScreen.appendChild(el("div", styles.titleKanji, getMessage(locale, "titleKanji")));
  titleScreen.appendChild(el("h1", styles.titleMain, getMessage(locale, "titleMain")));
  titleScreen.appendChild(el("p", styles.titleSub, getMessage(locale, "titleSub")));

  const diffGrid = el("div", styles.diffGrid);
  DIFFICULTIES.forEach((d) => {
    const button = el("button", styles.diffButton);
    button.dataset.action = "start";
    button.dataset.difficultyId = d.id;

    withHoverStyle(
      button,
      { background: "#2a2016", color: "#e8d5b5" },
      { background: "transparent", color: "#2a2016" }
    );

    const diffText = getDifficultyText(locale, d.id);
    const badge = el("span", styles.diffKanji, diffText.badge);
    const label = el("span", styles.diffLabel, diffText.label);
    button.append(badge, label);
    diffGrid.appendChild(button);
  });

  const ruleText = el("p", styles.ruleText);
  ruleText.innerHTML = getMessage(locale, "ruleText");

  titleScreen.append(diffGrid, ruleText);
  container.appendChild(titleScreen);
}

function createBoard(state) {
  const board = el("div", styles.board);

  const blank = findBlank(state.board);

  state.board.forEach((tile, idx) => {
    if (tile === 0) {
      board.appendChild(el("div", styles.emptyCell));
      return;
    }

    const movable = !state.result && getNeighbors(blank).includes(idx);
    const isAnimating = state.animatingTile === idx;

    const tileNode = el("div", styles.tile);
    if (movable) applyStyles(tileNode, styles.tileMovable);
    if (isAnimating) applyStyles(tileNode, styles.tileAnimating);

    tileNode.style.cursor = movable ? "pointer" : "default";
    tileNode.dataset.action = "tile";
    tileNode.dataset.idx = String(idx);

    tileNode.appendChild(el("span", styles.tileNumber, String(tile)));
    board.appendChild(tileNode);
  });

  return board;
}

function createGoalSection(locale) {
  const goalSection = el("div", styles.goalSection);
  goalSection.appendChild(el("div", styles.goalLabel, getMessage(locale, "goalLabel")));

  const goalGrid = el("div", styles.goalGrid);
  [1, 2, 3, 4, 5, 6, 7, 8, 0].forEach((value) => {
    const cell = value === 0 ? el("div", styles.goalEmpty) : el("div", styles.goalTile, String(value));
    goalGrid.appendChild(cell);
  });

  goalSection.appendChild(goalGrid);
  return goalSection;
}

function createResultOverlay(state) {
  if (!state.result) return null;

  const { locale } = state;
  const overlay = el("div", styles.resultOverlay);
  const resultCard = el("div", styles.resultCard);
  resultCard.style.borderColor = state.result === "correct" ? "#4a7c59" : "#8c4a4a";

  if (state.result === "correct") {
    resultCard.appendChild(el("div", styles.resultKanji, getMessage(locale, "resultCorrect")));
    resultCard.appendChild(
      el("p", styles.resultText, getMessage(locale, "resultCorrectText", { optimal: state.puzzle.optimal }))
    );
  } else {
    const wrong = el(
      "div",
      { ...styles.resultKanji, color: "#8c4a4a", fontSize: locale === "en" ? "44px" : styles.resultKanji.fontSize },
      getMessage(locale, "resultWrong")
    );
    resultCard.appendChild(wrong);
    resultCard.appendChild(
      el(
        "p",
        styles.resultText,
        getMessage(locale, "resultWrongText", {
          move: state.moveCount,
          optimal: state.puzzle.optimal,
        })
      )
    );
  }

  const resultButtons = el("div", styles.resultButtons);
  if (state.result === "wrong") {
    resultButtons.appendChild(makeButton(getMessage(locale, "retry"), styles.resultBtn, "reset"));
  }
  resultButtons.appendChild(makeButton(getMessage(locale, "next"), styles.resultBtn, "next"));

  resultCard.appendChild(resultButtons);
  overlay.appendChild(resultCard);
  return overlay;
}

export function renderGameScreen(container, state) {
  const { locale } = state;
  const gameScreen = el("div", styles.gameScreen);

  const header = el("div", styles.header);
  header.appendChild(makeButton(getMessage(locale, "back"), styles.backButton, "back"));

  const headerCenter = el("div", styles.headerCenter);
  const diffText = getDifficultyText(locale, state.difficulty.id);
  headerCenter.appendChild(el("span", styles.headerDiff, diffText.label));
  headerCenter.appendChild(
    el("span", styles.headerNum, getMessage(locale, "puzzleNumber", { n: state.puzzleNumber }))
  );
  header.appendChild(headerCenter);

  const headerRight = el("div", styles.headerRight);
  const moveText = state.puzzle
    ? getMessage(locale, "moveLabel", { move: state.moveCount, optimal: state.puzzle.optimal })
    : getMessage(locale, "moveLabelNoPuzzle", { move: state.moveCount });
  headerRight.appendChild(el("span", styles.moveLabel, moveText));
  headerRight.appendChild(createLocaleSwitch(locale));
  header.appendChild(headerRight);
  gameScreen.appendChild(header);

  const boardWrapper = el("div", styles.boardWrapper);
  boardWrapper.appendChild(createBoard(state));
  boardWrapper.appendChild(createGoalSection(locale));
  gameScreen.appendChild(boardWrapper);

  const controls = el("div", styles.controls);
  controls.appendChild(
    makeButton(getMessage(locale, "undo"), styles.controlBtn, "undo", state.history.length <= 1 || !!state.result)
  );
  controls.appendChild(
    makeButton(getMessage(locale, "solveOne"), styles.controlBtn, "solve-one", !state.board || !!state.result)
  );
  controls.appendChild(
    makeButton(getMessage(locale, "reset"), styles.controlBtn, "reset", state.moveCount === 0 || !!state.result)
  );
  gameScreen.appendChild(controls);

  const overlay = createResultOverlay(state);
  if (overlay) gameScreen.appendChild(overlay);

  gameScreen.appendChild(el("p", styles.hint, getMessage(locale, "hint")));
  container.appendChild(gameScreen);
}

export function renderApp(root, state) {
  root.textContent = "";

  const container = el("div", styles.container);
  if (!state.difficulty) {
    renderTitleScreen(container, state);
  } else {
    renderGameScreen(container, state);
  }

  root.appendChild(container);
}
