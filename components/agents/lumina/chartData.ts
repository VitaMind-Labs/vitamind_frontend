/** Example data for Lumina's illustrations. Nothing here is real: it only has to look like a calm month. */

export const SIGNAL_LEVELS = [4, 3, 4, 2, 3] as const;

export type Point = readonly [x: number, y: number];

/** Thirty days of one signal: a gentle wave inside the person's usual band, ending in it. */
export function monthSeries(width: number, top: number, bottom: number, amplitude = 1.15): Point[] {
  const days = 30;
  const mid = (top + bottom) / 2;
  const span = (bottom - top) / 2;
  return Array.from({ length: days }, (_, day) => {
    const wave = Math.sin(day * 0.5) * 0.62 + Math.cos(day * 1.7) * 0.22 + Math.sin(day * 0.17) * 0.16;
    return [(day / (days - 1)) * width, mid - wave * span * amplitude] as const;
  });
}

/** A smooth path through the points: level tangents at every point, so the line never spikes. */
export function smoothPath(points: readonly Point[]): string {
  return points.reduce((path, [x, y], index) => {
    if (index === 0) return `M ${x.toFixed(1)} ${y.toFixed(1)}`;
    const [px, py] = points[index - 1];
    const mid = ((px + x) / 2).toFixed(1);
    return `${path} C ${mid} ${py.toFixed(1)}, ${mid} ${y.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`;
  }, "");
}

/** Five weeks of days, 0 (nothing) to 4 (a full check-in): mostly full, a few gaps — a real-looking habit. */
export const HEATMAP: readonly number[] = Array.from({ length: 35 }, (_, day) => {
  if (day > 30) return 0;
  const value = (day * 37 + 11) % 13;
  return value < 2 ? 1 : value < 4 ? 2 : value < 8 ? 3 : 4;
});
