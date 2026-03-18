import test from "node:test";
import assert from "node:assert/strict";

import { getDifficultyText, getMessage, resolveLocale } from "../src/i18n.js";

test("resolveLocale detects english variants", () => {
  assert.equal(resolveLocale("en"), "en");
  assert.equal(resolveLocale("en-US"), "en");
  assert.equal(resolveLocale("EN-gb"), "en");
});

test("resolveLocale falls back to japanese for non-english values", () => {
  assert.equal(resolveLocale("ja"), "ja");
  assert.equal(resolveLocale("ja-JP"), "ja");
  assert.equal(resolveLocale("fr-FR"), "ja");
  assert.equal(resolveLocale(undefined), "ja");
});

test("getMessage formats template placeholders", () => {
  assert.equal(getMessage("ja", "puzzleNumber", { n: 3 }), "第3問");
  assert.equal(getMessage("en", "puzzleNumber", { n: 3 }), "Puzzle 3");
});

test("getDifficultyText returns localized difficulty labels", () => {
  assert.deepEqual(getDifficultyText("ja", "hard"), { badge: "上", label: "十五手" });
  assert.deepEqual(getDifficultyText("en", "hard"), { badge: "High", label: "15 moves" });
});

test("hintAction message exists for both locales", () => {
  assert.equal(getMessage("ja", "hintAction"), "ヒント");
  assert.equal(getMessage("en", "hintAction"), "Hint");
});

test("permalink messages exist for both locales", () => {
  assert.equal(getMessage("ja", "copyPermalink"), "リンクをコピー");
  assert.equal(getMessage("en", "copyPermalink"), "Copy Link");
  assert.equal(getMessage("ja", "invalidPermalinkTitle"), "無効なリンクです");
  assert.equal(getMessage("en", "invalidPermalinkTitle"), "Invalid Link");
});
