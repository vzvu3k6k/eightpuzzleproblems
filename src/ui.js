import { DIFFICULTIES, findBlank, getNeighbors } from "./puzzle.js";
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

export function renderTitleScreen(container) {
  const titleScreen = el("div", styles.titleScreen);

  titleScreen.appendChild(el("div", styles.titleKanji, "詰"));
  titleScreen.appendChild(el("h1", styles.titleMain, "詰め8パズル"));
  titleScreen.appendChild(el("p", styles.titleSub, "最善手で解ければ正解"));

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

    const kanji = el("span", styles.diffKanji, d.kanji);
    const label = el("span", styles.diffLabel, d.label);
    button.append(kanji, label);
    diffGrid.appendChild(button);
  });

  const ruleText = el("p", styles.ruleText);
  ruleText.innerHTML = "タイルをスライドして1〜8を順に並べよ。<br>最少手数で完成すれば「正解」。";

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

function createGoalSection() {
  const goalSection = el("div", styles.goalSection);
  goalSection.appendChild(el("div", styles.goalLabel, "完成図"));

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

  const overlay = el("div", styles.resultOverlay);
  const resultCard = el("div", styles.resultCard);
  resultCard.style.borderColor = state.result === "correct" ? "#4a7c59" : "#8c4a4a";

  if (state.result === "correct") {
    resultCard.appendChild(el("div", styles.resultKanji, "正解"));
    resultCard.appendChild(el("p", styles.resultText, `${state.puzzle.optimal}手で解きました`));
  } else {
    const wrong = el("div", { ...styles.resultKanji, color: "#8c4a4a" }, "不正解");
    resultCard.appendChild(wrong);
    resultCard.appendChild(
      el("p", styles.resultText, `${state.moveCount}手（最善：${state.puzzle.optimal}手）`)
    );
  }

  const resultButtons = el("div", styles.resultButtons);
  if (state.result === "wrong") {
    resultButtons.appendChild(makeButton("再挑戦", styles.resultBtn, "reset"));
  }
  resultButtons.appendChild(makeButton("次の問題", styles.resultBtn, "next"));

  resultCard.appendChild(resultButtons);
  overlay.appendChild(resultCard);
  return overlay;
}

export function renderGameScreen(container, state) {
  const gameScreen = el("div", styles.gameScreen);

  const header = el("div", styles.header);
  header.appendChild(makeButton("← 戻る", styles.backButton, "back"));

  const headerCenter = el("div", styles.headerCenter);
  headerCenter.appendChild(
    el("span", styles.headerDiff, `${state.difficulty.kanji}・${state.difficulty.label}`)
  );
  headerCenter.appendChild(el("span", styles.headerNum, `第${state.puzzleNumber}問`));
  header.appendChild(headerCenter);

  const headerRight = el("div");
  headerRight.appendChild(
    el(
      "span",
      styles.moveLabel,
      `${state.moveCount}手${state.puzzle ? `／${state.puzzle.optimal}手` : ""}`
    )
  );
  header.appendChild(headerRight);
  gameScreen.appendChild(header);

  const boardWrapper = el("div", styles.boardWrapper);
  boardWrapper.appendChild(createBoard(state));
  boardWrapper.appendChild(createGoalSection());
  gameScreen.appendChild(boardWrapper);

  const controls = el("div", styles.controls);
  controls.appendChild(
    makeButton("一手戻す", styles.controlBtn, "undo", state.history.length <= 1 || !!state.result)
  );
  controls.appendChild(
    makeButton("最初から", styles.controlBtn, "reset", state.moveCount === 0 || !!state.result)
  );
  gameScreen.appendChild(controls);

  const overlay = createResultOverlay(state);
  if (overlay) gameScreen.appendChild(overlay);

  gameScreen.appendChild(el("p", styles.hint, "矢印キー操作可・Ctrl+Zで一手戻す"));
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
