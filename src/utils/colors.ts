export const WHEEL_COLORS = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4',
  '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F',
  '#BB8FCE', '#85C1E9', '#F8C471', '#82E0AA',
];

export const getSegmentColor = (index: number) =>
  WHEEL_COLORS[index % WHEEL_COLORS.length];
