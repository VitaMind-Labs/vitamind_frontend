/**
 * The auth canvas — a quiet, still page in the spirit of Linear and Vercel: a hairline grid that fades away from the
 * top, one cool spotlight in the logo's cyan and a trace of amber. Nothing moves, nothing is drawn as a line that
 * travels; the form is the only thing that asks for attention. Decorative and never printed.
 */
export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden bg-canvas print:hidden">
      {/* Spotlight from above */}
      <div className="absolute inset-x-0 top-0 h-[44rem] bg-[radial-gradient(52rem_26rem_at_50%_-4rem,rgb(91_144_145/0.2),transparent_72%)]" />
      <div className="absolute -end-40 top-24 size-[34rem] bg-[radial-gradient(closest-side,rgb(201_175_111/0.1),transparent_72%)]" />
      <div className="absolute -start-40 top-[38rem] size-[34rem] bg-[radial-gradient(closest-side,rgb(17_76_97/0.08),transparent_72%)]" />

      {/* Hairline grid, strongest under the spotlight */}
      <div className="grid-hairline absolute inset-0 [mask-image:radial-gradient(70%_60%_at_50%_0%,black,transparent_78%)]" />
    </div>
  );
}
