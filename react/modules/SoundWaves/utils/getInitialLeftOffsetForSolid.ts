import { ScaleLinear } from 'd3-scale';

export const getInitialLeftOffsetForSolid = (
  barsInViewport: number,
  chartStartTime: number,
  xScale: ScaleLinear<number, number>,
  markedWordsStart: number,
  markedWordsEnd: number,
) => {
  const middle = markedWordsStart + (markedWordsEnd - markedWordsStart) / 2;
  const displayedRange = {
    startTime: Math.max(middle - barsInViewport / 2 / 100, chartStartTime),
    endTime:
      Math.max(middle - barsInViewport / 2 / 100, chartStartTime) +
      barsInViewport / 100,
  };

  return -xScale((displayedRange.startTime - chartStartTime) * 100);
};
