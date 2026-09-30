/**
 * The home page's canvas (white, with teal / gold / sage light) brought to life: three soft colour
 * reflections drift slowly and a faint conic sheen turns behind them, like light moving across glass.
 * Motion is transform-only and stops under `prefers-reduced-motion`. Decorative and never printed.
 */
export function AmbientBackdrop({ ribbons = false }: { ribbons?: boolean }) {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-canvas print:hidden">
      <div className="canvas-glow absolute inset-0" />
      <span className="vm-sheen" />
      <span className="vm-reflet vm-reflet-teal" />
      <span className="vm-reflet vm-reflet-gold" />
      <span className="vm-reflet vm-reflet-sage" />
      {/* A veil keeps reading surfaces calm: colour shows at the edges, not behind the text. */}
      <div className="absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_45%,rgb(255_255_255/0.55),transparent_80%)]" />

      {ribbons && (
        <>
          <svg viewBox="0 0 600 900" preserveAspectRatio="none" className="absolute -start-24 top-0 h-full w-[34rem] opacity-80 rtl:-scale-x-100">
            <defs>
              <linearGradient id="ambient-ribbon" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#fff" stopOpacity="0" />
                <stop offset="45%" stopColor="#fff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M-40 620 C 140 520, 260 700, 420 560 S 620 380, 700 420" fill="none" stroke="url(#ambient-ribbon)" strokeWidth="1.6" />
            <path d="M-60 700 C 120 600, 280 760, 440 640 S 640 480, 720 520" fill="none" stroke="url(#ambient-ribbon)" strokeWidth="1" />
          </svg>
          <svg viewBox="0 0 600 900" preserveAspectRatio="none" className="absolute -end-24 top-0 h-full w-[34rem] -scale-x-100 opacity-80 rtl:scale-x-100">
            <path d="M-40 260 C 140 160, 260 340, 420 200 S 620 40, 700 80" fill="none" stroke="url(#ambient-ribbon)" strokeWidth="1.6" />
            <path d="M-60 340 C 120 240, 280 400, 440 280 S 640 120, 720 160" fill="none" stroke="url(#ambient-ribbon)" strokeWidth="1" />
          </svg>
        </>
      )}
    </div>
  );
}
