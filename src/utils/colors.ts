export const WHEEL_COLORS = [
  '#FF4136', '#FF851B', '#FFDC00', '#2ECC40',
  '#0074D9', '#B10DC9', '#FF6BB5', '#01FF70',
  '#39CCCC', '#F012BE', '#FF6F00', '#7FDBFF',
];

export const getSegmentColor = (index: number) =>
  WHEEL_COLORS[index % WHEEL_COLORS.length];
