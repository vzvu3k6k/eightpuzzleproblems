import { rankBoard, unrankBoard } from "./puzzle.js";

export const INVALID_PERMALINK_REASONS = {
  MALFORMED: "malformed",
  OUT_OF_RANGE: "out_of_range",
  UNREACHABLE: "unreachable",
};

function normalizeRank(rawRank) {
  if (rawRank === null || rawRank === undefined || rawRank === "") {
    return { ok: false, reason: INVALID_PERMALINK_REASONS.MALFORMED };
  }

  if (!/^\d+$/.test(String(rawRank))) {
    return { ok: false, reason: INVALID_PERMALINK_REASONS.MALFORMED };
  }

  const rank = Number(rawRank);
  if (!Number.isInteger(rank)) {
    return { ok: false, reason: INVALID_PERMALINK_REASONS.MALFORMED };
  }

  if (rank < 0 || rank >= 362880) {
    return { ok: false, reason: INVALID_PERMALINK_REASONS.OUT_OF_RANGE };
  }

  return { ok: true, rank };
}

export function buildPuzzlePermalink(board, baseHref = window.location.href) {
  const url = new URL(baseHref);
  url.searchParams.set("p", String(rankBoard(board)));
  return url.toString();
}

export function parsePuzzlePermalink(search, distanceByRank) {
  const params = new URLSearchParams(search);
  if (!params.has("p")) {
    return { kind: "empty" };
  }

  const normalized = normalizeRank(params.get("p"));
  if (!normalized.ok) {
    return { kind: "invalid", reason: normalized.reason };
  }

  const depth = distanceByRank[normalized.rank];
  if (!Number.isInteger(depth) || depth === 255) {
    return { kind: "invalid", reason: INVALID_PERMALINK_REASONS.UNREACHABLE };
  }

  return {
    kind: "puzzle",
    board: unrankBoard(normalized.rank),
    optimal: depth,
    rank: normalized.rank,
  };
}
