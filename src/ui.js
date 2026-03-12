import { DIFFICULTIES, findBlank, getNeighbors, rankBoard } from "./puzzle.js";
import { getDifficultyText, getMessage } from "./i18n.js";
import { styles, withHoverStyle } from "./styles.js";
import { Actions } from "./actions.js";
import { h } from "./dom.js";

function ActionButton({ label, style, action, disabled = false, dataset, attrs }) {
  const mergedStyle = disabled ? { ...(style ?? {}), opacity: "0.4" } : style;
  return h(
    "button",
    {
      style: mergedStyle,
      disabled,
      dataset: { action, ...(dataset ?? {}) },
      attrs,
    },
    label
  );
}

function LocaleSwitch({ locale }) {
  const options = [
    { locale: "ja", key: "localeJa" },
    { locale: "en", key: "localeEn" },
  ];

  return h(
    "div",
    { style: styles.localeSwitch },
    options.map((option) => {
      const active = locale === option.locale;
      return ActionButton({
        label: getMessage(locale, option.key),
        style: active ? { ...styles.localeButton, ...styles.localeButtonActive } : styles.localeButton,
        action: Actions.SET_LOCALE,
        dataset: { locale: option.locale },
        attrs: { "aria-pressed": active ? "true" : "false" },
      });
    })
  );
}

function DifficultyButton({ locale, difficulty }) {
  const diffText = getDifficultyText(locale, difficulty.id);
  const button = h(
    "button",
    {
      style: styles.diffButton,
      dataset: { action: Actions.START, difficultyId: difficulty.id },
    },
    h("span", { style: styles.diffKanji }, diffText.badge),
    h("span", { style: styles.diffLabel }, diffText.label)
  );

  withHoverStyle(
    button,
    { background: "#2a2016", color: "#e8d5b5" },
    { background: "transparent", color: "#2a2016" }
  );

  return button;
}

function TitleScreen({ state }) {
  const { locale } = state;

  return h(
    "div",
    { style: styles.titleScreen },
    h("div", { style: styles.titleTopRow }, LocaleSwitch({ locale })),
    h("div", { style: styles.titleKanji }, getMessage(locale, "titleKanji")),
    h("h1", { style: styles.titleMain }, getMessage(locale, "titleMain")),
    h("p", { style: styles.titleSub }, getMessage(locale, "titleSub")),
    h(
      "div",
      { style: styles.diffGrid },
      DIFFICULTIES.map((d) => DifficultyButton({ locale, difficulty: d }))
    ),
    ActionButton({
      label: getMessage(locale, "history"),
      style: styles.historyButton,
      action: Actions.HISTORY,
    }),
    // i18n message includes <br>
    h("p", { style: styles.ruleText, html: getMessage(locale, "ruleText") })
  );
}

function Board({ state }) {
  if (!state.board) return h("div", { style: styles.board });

  const blank = findBlank(state.board);
  const movableNeighbors = new Set(getNeighbors(blank));

  return h(
    "div",
    { style: styles.board },
    state.board.map((tile, idx) => {
      if (tile === 0) return h("div", { style: styles.emptyCell });

      const movable = !state.result && movableNeighbors.has(idx);
      const isAnimating = state.animatingTile === idx;
      const isHinted = state.hintedTiles?.includes(idx);
      const tileStyle = {
        ...styles.tile,
        ...(movable ? styles.tileMovable : {}),
        ...(isAnimating ? styles.tileAnimating : {}),
        ...(isHinted ? styles.tileHinted : {}),
        cursor: movable ? "pointer" : "default",
      };

      return h(
        "div",
        {
          style: tileStyle,
          dataset: { action: Actions.TILE, idx },
        },
        h("span", { style: styles.tileNumber }, String(tile))
      );
    })
  );
}

function GoalSection({ locale }) {
  return h(
    "div",
    { style: styles.goalSection },
    h("div", { style: styles.goalLabel }, getMessage(locale, "goalLabel")),
    h(
      "div",
      { style: styles.goalGrid },
      [1, 2, 3, 4, 5, 6, 7, 8, 0].map((value) =>
        value === 0 ? h("div", { style: styles.goalEmpty }) : h("div", { style: styles.goalTile }, String(value))
      )
    )
  );
}

function ResultOverlay({ state }) {
  if (!state.result) return null;

  const { locale } = state;
  const resultCardStyle = {
    ...styles.resultCard,
    borderColor: state.result === "correct" ? "#4a7c59" : "#8c4a4a",
  };

  const body =
    state.result === "correct"
      ? [
          h("div", { style: styles.resultKanji }, getMessage(locale, "resultCorrect")),
          h("p", { style: styles.resultText }, getMessage(locale, "resultCorrectText", { optimal: state.puzzle.optimal })),
        ]
      : [
          h(
            "div",
            {
              style: {
                ...styles.resultKanji,
                color: "#8c4a4a",
                fontSize: locale === "en" ? "44px" : styles.resultKanji.fontSize,
              },
            },
            getMessage(locale, "resultWrong")
          ),
          h(
            "p",
            { style: styles.resultText },
            getMessage(locale, "resultWrongText", { move: state.moveCount, optimal: state.puzzle.optimal })
          ),
        ];

  const buttons = h(
    "div",
    { style: styles.resultButtons },
    state.result === "wrong" || state.usedHint
      ? ActionButton({ label: getMessage(locale, "retry"), style: styles.resultBtn, action: Actions.RESET })
      : null,
    ActionButton({ label: getMessage(locale, state.fromHistory ? "backToHistory" : "next"), style: styles.resultBtn, action: Actions.NEXT })
  );

  return h(
    "div",
    { style: styles.resultOverlay },
    h("div", { style: resultCardStyle }, body, buttons)
  );
}

function GameScreen({ state }) {
  const { locale } = state;
  const diffText = getDifficultyText(locale, state.difficulty.id);
  const moveText = state.puzzle
    ? getMessage(locale, "moveLabel", { move: state.moveCount, optimal: state.puzzle.optimal })
    : getMessage(locale, "moveLabelNoPuzzle", { move: state.moveCount });

  const backBtn = ActionButton({ label: getMessage(locale, "back"), style: styles.backButton, action: Actions.BACK });
  withHoverStyle(
    backBtn,
    { color: "#2a2016" },
    { color: "#7a6b52" }
  );

  const header = h(
    "div",
    { style: styles.header },
    backBtn,
    h(
      "div",
      { style: styles.headerCenter },
      h("span", { style: styles.headerDiff }, diffText.label),
      h("span", { style: styles.headerNum }, getMessage(locale, "puzzleNumber", { n: state.puzzleNumber }))
    ),
    h(
      "div",
      { style: styles.headerRight },
      h("span", { style: styles.moveLabel }, moveText)
    )
  );

  const controls = h(
    "div",
    { style: styles.controls },
    ActionButton({
      label: getMessage(locale, "undo"),
      style: styles.controlBtn,
      action: Actions.UNDO,
      disabled: state.history.length <= 1 || !!state.result,
    }),
    ActionButton({
      label: getMessage(locale, "hintAction"),
      style: styles.controlBtn,
      action: Actions.SHOW_HINT,
      disabled: !state.board || !!state.result,
    }),
    ActionButton({
      label: getMessage(locale, "reset"),
      style: styles.controlBtn,
      action: Actions.RESET,
      disabled: state.moveCount === 0 || !!state.result,
    })
  );

  return h(
    "div",
    { style: styles.gameScreen },
    header,
    h("div", { style: styles.boardWrapper }, Board({ state }), GoalSection({ locale })),
    controls,
    ResultOverlay({ state }),
    h("p", { style: styles.hint }, getMessage(locale, "hint"))
  );
}

function formatDate(timestamp, locale) {
  const d = new Date(timestamp);
  const pad = (n) => String(n).padStart(2, "0");
  if (locale === "ja") {
    return `${d.getFullYear()}/${pad(d.getMonth() + 1)}/${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
  }
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function HistoryScreen({ state, loadHistory, puzzleIndex }) {
  const { locale } = state;
  const entries = loadHistory();

  const backBtn = ActionButton({
    label: getMessage(locale, "historyBack"),
    style: styles.historyBackButton,
    action: Actions.HISTORY_BACK,
  });
  withHoverStyle(backBtn, { color: "#2a2016" }, { color: "#7a6b52" });

  const header = h(
    "div",
    { style: styles.historyHeader },
    backBtn,
    h("span", { style: styles.historyTitle }, getMessage(locale, "history")),
    h("span", { style: { width: "48px" } })
  );

  if (entries.length === 0) {
    return h(
      "div",
      { style: styles.historyScreen },
      header,
      h("p", { style: styles.historyEmpty }, getMessage(locale, "historyEmpty"))
    );
  }

  const items = entries.map((entry, index) => {
    const diffText = getDifficultyText(locale, entry.difficulty);
    const rank = rankBoard(entry.initialBoard);
    const optimal = puzzleIndex.distanceByRank[rank];
    const resultMark = entry.result === "correct" ? "○" : "×";
    const resultColor = entry.result === "correct" ? "#4a7c59" : "#8c4a4a";

    return h(
      "div",
      { style: styles.historyItem, dataset: { action: Actions.HISTORY_PLAY, historyIndex: index } },
      h("span", { style: { ...styles.historyResult, color: resultColor } }, resultMark),
      h(
        "div",
        { style: styles.historyDetails },
        h("span", { style: styles.historyMoves }, `${entry.moveCount}/${optimal} — ${diffText.label}`),
        h("span", { style: styles.historyMeta }, formatDate(entry.timestamp, locale))
      )
    );
  });

  return h("div", { style: styles.historyScreen }, header, h("div", { style: styles.historyList }, items));
}

export function renderApp(root, state, context) {
  root.textContent = "";

  let screen;
  if (state.screen === "history") {
    screen = HistoryScreen({ state, loadHistory: context.loadHistory, puzzleIndex: context.puzzleIndex });
  } else if (state.difficulty) {
    screen = GameScreen({ state });
  } else {
    screen = TitleScreen({ state });
  }

  root.appendChild(h("div", { style: styles.container }, screen));
}
