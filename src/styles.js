export const tokens = {
  ink: "#2a2016",
  inkSoft: "#3d3225",
  sub: "#7a6b52",
  subDeep: "#6d5f49",
  mute: "#a89b80",
  paper: "#f5edd6",
  paperDeep: "#efe4c8",
  paperRaised: "#f0e4c8",
  grid: "#ede1c7",
  tileIdle: "#e8d5b5",
  tileLive: "#f0e4c8",
  tileDark: "#e8d5b5",
  goldLight: "#d4c4a0",
  gold: "#b89e6e",
  goalSurface: "#c4b89a",
  goalEmpty: "#b8ab8e",
  goalText: "#5a4d3a",
  matcha: "#3d6b4a",
  matchaLight: "#d4e0ce",
  vermilion: "#a84c3a",
  localeBg: "#efe4c8",
};

const motion = {
  easeOut: "cubic-bezier(0.2, 0.8, 0.2, 1)",
};

const washiNoiseUrl =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.16  0 0 0 0 0.12  0 0 0 0 0.08  0 0 0 0.55 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)' opacity='0.07'/></svg>\")";

export const styles = {
  container: {
    minHeight: "100vh",
    background: tokens.paper,
    backgroundImage: [
      `repeating-linear-gradient(0deg, transparent, transparent 39px, ${tokens.grid} 39px, ${tokens.grid} 40px)`,
      `repeating-linear-gradient(90deg, transparent, transparent 39px, ${tokens.grid} 39px, ${tokens.grid} 40px)`,
      washiNoiseUrl,
    ].join(", "),
    backgroundSize: "auto, auto, 160px 160px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "'Noto Serif JP', 'Hiragino Mincho ProN', 'Yu Mincho', serif",
    color: tokens.ink,
    padding: "clamp(12px, 4vw, 20px)",
    boxSizing: "border-box",
  },
  titleScreen: {
    textAlign: "center",
    maxWidth: "420px",
  },
  titleTopRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginBottom: "10px",
  },
  titleKanji: {
    fontSize: "96px",
    fontWeight: "900",
    lineHeight: "1",
    color: tokens.ink,
    textShadow: `2px 2px 0 ${tokens.goldLight}, 5px 5px 0 rgba(42,32,22,0.08), 0 1px 0 rgba(255,255,255,0.6)`,
    marginBottom: "8px",
    letterSpacing: "-0.02em",
    fontFeatureSettings: "'palt'",
    animation: `fadeRise 0.6s ${motion.easeOut} both`,
  },
  titleMainAnim: {
    animation: `fadeRise 0.6s ${motion.easeOut} 80ms both`,
  },
  titleSubAnim: {
    animation: `fadeRise 0.6s ${motion.easeOut} 160ms both`,
  },
  diffGridAnim: {
    animation: `fadeRise 0.6s ${motion.easeOut} 220ms both`,
  },
  titleMain: {
    fontSize: "32px",
    fontWeight: "700",
    margin: "0 0 4px",
    letterSpacing: "8px",
  },
  titleSub: {
    fontSize: "14px",
    color: tokens.sub,
    margin: "0 0 36px",
    letterSpacing: "4px",
  },
  diffGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "12px",
    marginBottom: "32px",
  },
  diffButton: {
    background: "transparent",
    border: `2px solid ${tokens.ink}`,
    color: tokens.ink,
    padding: "16px 12px",
    cursor: "pointer",
    fontFamily: "inherit",
    fontSize: "16px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "4px",
    transition: `background 0.22s ${motion.easeOut}, color 0.22s ${motion.easeOut}, transform 0.22s ${motion.easeOut}, box-shadow 0.22s ${motion.easeOut}`,
    borderRadius: "2px",
    animation: `fadeRise 0.6s ${motion.easeOut} both`,
  },
  diffKanji: {
    fontSize: "28px",
    fontWeight: "700",
  },
  diffLabel: {
    fontSize: "13px",
    letterSpacing: "2px",
  },
  ruleText: {
    fontSize: "13px",
    lineHeight: "1.8",
    color: tokens.sub,
  },
  gameScreen: {
    width: "100%",
    maxWidth: "520px",
    position: "relative",
    alignSelf: "flex-start",
  },
  header: {
    display: "grid",
    gridTemplateColumns: "1fr auto 1fr",
    alignItems: "center",
    marginBottom: "24px",
    gap: "12px",
    background: tokens.paperDeep,
    padding: "10px 16px",
    borderRadius: "4px",
    position: "sticky",
    top: "0",
    zIndex: "5",
    boxShadow: "0 1px 0 rgba(42,32,22,0.08), 0 6px 16px -12px rgba(42,32,22,0.35)",
  },
  backButton: {
    background: "none",
    border: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    color: tokens.sub,
    cursor: "pointer",
    padding: "4px 0",
    justifySelf: "start",
    transition: "color 0.2s",
  },
  headerCenter: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "2px",
  },
  headerDiff: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "4px",
  },
  headerNum: {
    fontSize: "12px",
    color: tokens.sub,
  },
  headerRight: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    justifySelf: "end",
    gap: "8px",
  },
  moveLabel: {
    fontSize: "15px",
    fontWeight: "700",
    fontVariantNumeric: "tabular-nums",
  },
  localeSwitch: {
    display: "inline-flex",
    border: `1px solid ${tokens.sub}`,
    borderRadius: "999px",
    overflow: "hidden",
    background: tokens.localeBg,
  },
  localeButton: {
    background: "transparent",
    border: "none",
    color: tokens.subDeep,
    padding: "5px 10px",
    fontFamily: "inherit",
    fontSize: "12px",
    cursor: "pointer",
    lineHeight: "1.1",
  },
  localeButtonActive: {
    background: tokens.ink,
    color: tokens.tileIdle,
  },
  boardWrapper: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    gap: "24px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },
  board: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "4px",
    background: tokens.ink,
    padding: "4px",
    borderRadius: "2px",
    width: "min(264px, calc(100vw - 56px))",
    aspectRatio: "1 / 1",
    height: "auto",
    flexShrink: "0",
    boxShadow:
      "0 2px 0 rgba(42,32,22,0.08), 0 12px 28px -14px rgba(42,32,22,0.45)",
  },
  emptyCell: {
    background: tokens.inkSoft,
    borderRadius: "1px",
    boxShadow: "inset 0 1px 0 rgba(0,0,0,0.35)",
  },
  tile: {
    background: tokens.tileIdle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: "1px",
    transition: `background 0.18s ${motion.easeOut}, box-shadow 0.18s ${motion.easeOut}, transform 0.18s ${motion.easeOut}`,
    userSelect: "none",
    WebkitUserSelect: "none",
    boxShadow:
      "inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -1px 0 rgba(42,32,22,0.1)",
  },
  tileMovable: {
    background: tokens.tileLive,
    boxShadow: `inset 0 0 0 2px ${tokens.gold}, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(42,32,22,0.08)`,
  },
  tileAnimating: {
    transform: "scale(0.93)",
  },
  tileHinted: {
    animation: "flashHint 2s ease-out forwards",
  },
  tileNumber: {
    fontSize: "clamp(24px, 7vw, 32px)",
    fontWeight: "700",
    color: tokens.ink,
    letterSpacing: "-0.02em",
  },
  goalSection: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "8px",
  },
  goalLabel: {
    fontSize: "11px",
    color: tokens.sub,
    letterSpacing: "2px",
  },
  goalGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "2px",
    background: tokens.goalSurface,
    padding: "2px",
    borderRadius: "2px",
    width: "84px",
    height: "84px",
    boxShadow: "0 1px 0 rgba(42,32,22,0.08), 0 4px 10px -6px rgba(42,32,22,0.3)",
  },
  goalTile: {
    background: tokens.tileIdle,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: "600",
    color: tokens.goalText,
    borderRadius: "1px",
  },
  goalEmpty: {
    background: tokens.goalEmpty,
    borderRadius: "1px",
  },
  controls: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    flexWrap: "wrap",
    marginBottom: "16px",
  },
  controlBtn: {
    background: "none",
    border: `1.5px solid ${tokens.sub}`,
    color: tokens.sub,
    padding: "8px 20px",
    fontFamily: "inherit",
    fontSize: "13px",
    cursor: "pointer",
    transition: `opacity 0.2s, background 0.2s ${motion.easeOut}, color 0.2s ${motion.easeOut}`,
    letterSpacing: "1px",
    borderRadius: "2px",
  },
  permalinkStatus: {
    textAlign: "center",
    fontSize: "12px",
    color: tokens.sub,
    minHeight: "18px",
    margin: "0 0 12px",
  },
  resultOverlay: {
    position: "absolute",
    inset: "0",
    background: "rgba(245, 237, 214, 0.86)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "10",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    animation: `overlayFade 0.22s ${motion.easeOut} both`,
  },
  resultCard: {
    background: tokens.paper,
    border: "3px solid",
    padding: "36px 48px",
    textAlign: "center",
    boxShadow: "0 18px 40px -16px rgba(42,32,22,0.35), 0 3px 0 rgba(42,32,22,0.05)",
    animation: `cardRise 0.28s ${motion.easeOut} both`,
    transformOrigin: "center",
    willChange: "transform, opacity",
  },
  resultKanji: {
    fontSize: "56px",
    fontWeight: "900",
    color: tokens.matcha,
    lineHeight: "1",
    marginBottom: "8px",
    letterSpacing: "-0.02em",
  },
  resultText: {
    fontSize: "15px",
    color: tokens.goalText,
    margin: "0 0 24px",
  },
  resultButtons: {
    display: "flex",
    gap: "12px",
    justifyContent: "center",
  },
  resultBtn: {
    background: tokens.ink,
    color: tokens.tileIdle,
    border: "none",
    padding: "10px 24px",
    fontFamily: "inherit",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "2px",
    borderRadius: "2px",
    transition: `transform 0.18s ${motion.easeOut}, box-shadow 0.18s ${motion.easeOut}`,
  },
  hint: {
    textAlign: "center",
    fontSize: "11px",
    color: tokens.mute,
    margin: "0",
  },
  historyButton: {
    background: "transparent",
    border: `1.5px solid ${tokens.sub}`,
    color: tokens.sub,
    padding: "10px 24px",
    fontFamily: "inherit",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "2px",
    marginBottom: "24px",
    transition: `background 0.2s ${motion.easeOut}, color 0.2s ${motion.easeOut}`,
    borderRadius: "2px",
  },
  historyScreen: {
    width: "100%",
    maxWidth: "520px",
    alignSelf: "flex-start",
  },
  historyHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "20px",
    background: tokens.paperDeep,
    padding: "10px 16px",
    borderRadius: "4px",
    boxShadow: "0 1px 0 rgba(42,32,22,0.08)",
  },
  historyBackButton: {
    background: "none",
    border: "none",
    fontFamily: "inherit",
    fontSize: "14px",
    color: tokens.sub,
    cursor: "pointer",
    padding: "4px 0",
    transition: "color 0.2s",
  },
  historyTitle: {
    fontSize: "18px",
    fontWeight: "700",
    letterSpacing: "4px",
  },
  historyList: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  historyItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    background: tokens.paperDeep,
    padding: "10px 16px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    transition: `transform 0.18s ${motion.easeOut}, box-shadow 0.18s ${motion.easeOut}`,
    boxShadow: "0 1px 0 rgba(42,32,22,0.05)",
  },
  historyResult: {
    fontSize: "20px",
    fontWeight: "700",
    width: "28px",
    textAlign: "center",
    flexShrink: "0",
  },
  historyDetails: {
    flex: "1",
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  historyMoves: {
    fontSize: "14px",
    fontWeight: "600",
  },
  historyMeta: {
    fontSize: "12px",
    color: tokens.sub,
  },
  historyEmpty: {
    textAlign: "center",
    color: tokens.sub,
    fontSize: "14px",
    padding: "40px 0",
  },
  invalidScreen: {
    width: "100%",
    maxWidth: "420px",
    textAlign: "center",
    background: tokens.paperDeep,
    borderRadius: "4px",
    padding: "40px 28px",
    boxSizing: "border-box",
    boxShadow: "0 12px 28px -16px rgba(42,32,22,0.35)",
  },
  invalidTitle: {
    fontSize: "28px",
    fontWeight: "700",
    margin: "0 0 12px",
    letterSpacing: "2px",
  },
  invalidText: {
    fontSize: "14px",
    color: tokens.sub,
    lineHeight: "1.8",
    margin: "0 0 24px",
  },
  invalidButton: {
    background: tokens.ink,
    color: tokens.tileIdle,
    border: "none",
    padding: "10px 24px",
    fontFamily: "inherit",
    fontSize: "14px",
    cursor: "pointer",
    letterSpacing: "2px",
    borderRadius: "2px",
  },
};

export function applyStyles(element, styleObject) {
  Object.assign(element.style, styleObject);
}

export function withHoverStyle(element, hoverStyle, baseStyle) {
  element.addEventListener("mouseenter", () => {
    Object.assign(element.style, hoverStyle);
  });
  element.addEventListener("mouseleave", () => {
    Object.assign(element.style, baseStyle);
  });
}

const styleTag = document.createElement("style");
styleTag.textContent = `
@keyframes flashHint {
  0% { background: ${tokens.matchaLight}; box-shadow: inset 0 0 0 3px ${tokens.matcha}; transform: scale(0.95); }
  10% { transform: scale(1); }
  70% { background: ${tokens.matchaLight}; box-shadow: inset 0 0 0 3px ${tokens.matcha}; }
  100% { background: ${tokens.tileLive}; box-shadow: inset 0 0 0 2px ${tokens.gold}, inset 0 1px 0 rgba(255,255,255,0.45), inset 0 -1px 0 rgba(42,32,22,0.08); }
}
@keyframes fadeRise {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes overlayFade {
  from { opacity: 0; }
  to { opacity: 1; }
}
@keyframes cardRise {
  from { opacity: 0; transform: scale(0.96); }
  to { opacity: 1; transform: scale(1); }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
`;
document.head.appendChild(styleTag);
