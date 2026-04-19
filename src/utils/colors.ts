export const WHEEL_COLORS = [
  'oklch(0.70 0.17 60)',
  'oklch(0.58 0.17 30)',
  'oklch(0.62 0.13 145)',
  'oklch(0.52 0.14 340)',
  'oklch(0.68 0.11 205)',
  'oklch(0.68 0.14 10)',
  'oklch(0.55 0.12 260)',
  'oklch(0.72 0.14 95)',
];

export const getSegmentColor = (index: number) =>
  WHEEL_COLORS[index % WHEEL_COLORS.length];
