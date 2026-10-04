/**
 * Mira's canvas (orientation + result): a field of colour, not drawn shapes. A very large conic wash of the logo's
 * ocean teal, cyan, aqua and amber turns slowly, a second, softer one drifts the other way, and a white veil keeps the
 * middle calm for reading so colour shows at the edges. Transform-only (no blur filters), still under
 * `prefers-reduced-motion`, never printed.
 */
export function ColorFieldBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 isolate overflow-hidden bg-canvas print:hidden">
      <span className="color-field-a absolute start-1/2 top-1/2 -ms-[75vmax] -mt-[75vmax] size-[150vmax] will-change-transform motion-safe:animate-[color-field-turn_90s_linear_infinite]" />
      <span className="color-field-b absolute start-1/2 top-1/2 -ms-[60vmax] -mt-[60vmax] size-[120vmax] will-change-transform motion-safe:animate-[color-field-turn_140s_linear_infinite_reverse]" />
      <div className="absolute inset-0 bg-[radial-gradient(65%_60%_at_50%_46%,rgb(255_255_255/0.78),rgb(255_255_255/0.4)_55%,transparent_100%)]" />
    </div>
  );
}
