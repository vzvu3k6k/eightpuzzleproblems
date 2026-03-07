export const SUPPORTED_LOCALES = ["ja", "en"];

const MESSAGES = {
  ja: {
    pageTitle: "詰め8パズル",
    titleKanji: "詰",
    titleMain: "詰め8パズル",
    titleSub: "最善手で解ければ正解",
    ruleText: "タイルをスライドして1〜8を順に並べよ。<br>最少手数で完成すれば「正解」。",
    back: "← 戻る",
    puzzleNumber: "第{n}問",
    moveLabel: "{move}手／{optimal}手",
    moveLabelNoPuzzle: "{move}手",
    goalLabel: "完成図",
    undo: "一手戻す",
    hintAction: "ヒント",
    reset: "最初から",
    resultCorrect: "正解",
    resultCorrectText: "{optimal}手で解きました",
    resultWrong: "不正解",
    resultWrongText: "{move}手（最善：{optimal}手）",
    retry: "再挑戦",
    next: "次の問題",
    hint: "矢印キー操作可・Ctrl+Zで一手戻す",
    localeJa: "日本語",
    localeEn: "English",
  },
  en: {
    pageTitle: "8-Puzzle Challenge",
    titleKanji: "8",
    titleMain: "8-Puzzle Challenge",
    titleSub: "Clear it in the optimal move count",
    ruleText: "Slide the tiles to arrange 1-8 in order.<br>Finish in the minimum moves for a correct answer.",
    back: "← Back",
    puzzleNumber: "Puzzle {n}",
    moveLabel: "{move} moves / {optimal}",
    moveLabelNoPuzzle: "{move} moves",
    goalLabel: "Goal",
    undo: "Undo",
    hintAction: "Hint",
    reset: "Reset",
    resultCorrect: "Correct",
    resultCorrectText: "Solved in {optimal} moves",
    resultWrong: "Incorrect",
    resultWrongText: "{move} moves (optimal: {optimal})",
    retry: "Try Again",
    next: "Next Puzzle",
    hint: "Arrow keys supported, Ctrl+Z to undo",
    localeJa: "日本語",
    localeEn: "English",
  },
};

const DIFFICULTY_TEXT = {
  ja: {
    easy: { badge: "初", label: "七手" },
    medium: { badge: "中", label: "十手" },
    hard: { badge: "上", label: "十五手" },
    random: { badge: "乱", label: "ランダム" },
  },
  en: {
    easy: { badge: "Easy", label: "7 moves" },
    medium: { badge: "Medium", label: "10 moves" },
    hard: { badge: "High", label: "15 moves" },
    random: { badge: "Random", label: "Random" },
  },
};

function formatTemplate(template, params = {}) {
  return template.replace(/\{(\w+)\}/g, (_, key) => String(params[key] ?? ""));
}

export function resolveLocale(rawLocale) {
  if (typeof rawLocale !== "string") return "ja";
  const normalized = rawLocale.trim().toLowerCase();
  if (normalized.startsWith("en")) return "en";
  return "ja";
}

export function getMessage(locale, key, params) {
  const messages = MESSAGES[locale] || MESSAGES.ja;
  const template = messages[key];
  if (typeof template !== "string") {
    throw new Error(`Missing message: ${locale}.${key}`);
  }
  return formatTemplate(template, params);
}

export function getDifficultyText(locale, difficultyId) {
  const byLocale = DIFFICULTY_TEXT[locale] || DIFFICULTY_TEXT.ja;
  return byLocale[difficultyId] || DIFFICULTY_TEXT.ja[difficultyId];
}
