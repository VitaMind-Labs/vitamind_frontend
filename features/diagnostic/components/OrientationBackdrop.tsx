/**
 * Misted teal canvas with soft light ribbons at the edges (orientation + result).
 * Static on purpose: no looping motion behind reading content. Never printed.
 */
export function OrientationBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-[linear-gradient(180deg,#f2f6f6_0%,#e9f0f0_55%,#eef3f2_100%)] print:hidden">
      <div className="absolute inset-0 bg-[radial-gradient(55%_45%_at_20%_0%,rgb(81_133_145/0.10),transparent_70%),radial-gradient(40%_40%_at_100%_100%,rgb(125_168_158/0.14),transparent_70%),radial-gradient(35%_30%_at_85%_10%,rgb(255_255_255/0.7),transparent_70%)]" />

      {/* Light ribbons — mirrored on each side, like light through frosted glass. */}
      <svg viewBox="0 0 600 900" preserveAspectRatio="none" className="absolute -start-24 top-0 h-full w-[34rem] opacity-80 rtl:-scale-x-100">
        <defs>
          <linearGradient id="orientation-ribbon-a" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#fff" stopOpacity="0" />
            <stop offset="45%" stopColor="#fff" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M-40 620 C 140 520, 260 700, 420 560 S 620 380, 700 420" fill="none" stroke="url(#orientation-ribbon-a)" strokeWidth="1.6" />
        <path d="M-60 700 C 120 600, 280 760, 440 640 S 640 480, 720 520" fill="none" stroke="url(#orientation-ribbon-a)" strokeWidth="1" />
        <path d="M-20 560 C 160 470, 250 620, 400 500" fill="none" stroke="url(#orientation-ribbon-a)" strokeWidth="0.8" strokeOpacity="0.6" />
      </svg>
      <svg viewBox="0 0 600 900" preserveAspectRatio="none" className="absolute -end-24 top-0 h-full w-[34rem] -scale-x-100 opacity-80 rtl:scale-x-100">
        <path d="M-40 260 C 140 160, 260 340, 420 200 S 620 40, 700 80" fill="none" stroke="url(#orientation-ribbon-a)" strokeWidth="1.6" />
        <path d="M-60 340 C 120 240, 280 400, 440 280 S 640 120, 720 160" fill="none" stroke="url(#orientation-ribbon-a)" strokeWidth="1" />
      </svg>
    </div>
  );
}
