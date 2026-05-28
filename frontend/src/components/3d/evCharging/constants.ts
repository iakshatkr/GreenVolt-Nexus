export const EV_COLORS = {
  background: '#04070d',
  fog: '#0b1118',
  primaryGlow: '#34d399',
  secondaryGlow: '#22d3ee',
  metal: '#d8e0ea',
  darkMetal: '#7f8a99',
  deep: '#1f2937'
} as const;

export const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

export const smoothStep = (edge0: number, edge1: number, x: number) => {
  const t = clamp01((x - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};
