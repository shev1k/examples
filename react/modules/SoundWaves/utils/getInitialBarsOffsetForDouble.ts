import { ScaleLinear } from 'd3-scale';

export const getInitialBarsOffsetForDouble = (
  barsInViewport: number,
  chartStartTime: number,
  xScale: ScaleLinear<number, number>,
  rightZeroOffset: number,
  markedWordsStart: number,
  markedWordsEnd: number,
  nextWordStart: number,
) => {
  const doubleMaxTimeRange = {
    start: {
      startTime: chartStartTime
        ? Math.max(markedWordsStart - barsInViewport / 2 / 100, chartStartTime)
        : markedWordsStart - barsInViewport / 2 / 100,
      endTime:
        Math.max(markedWordsStart - barsInViewport / 2 / 100, chartStartTime) +
        barsInViewport / 100,
    },
    end: {
      startTime: nextWordStart
        ? Math.min(markedWordsEnd - barsInViewport / 2 / 100, nextWordStart)
        : markedWordsEnd - barsInViewport / 2 / 100,
      endTime:
        Math.min(markedWordsEnd - barsInViewport / 2 / 100, nextWordStart) +
        barsInViewport / 100,
    },
  };

  return {
    initialRightOffset:
      -xScale((doubleMaxTimeRange.end.startTime - chartStartTime) * 100) +
      rightZeroOffset,
    initialLeftOffset: -xScale(
      (doubleMaxTimeRange.start.startTime - chartStartTime) * 100,
    ),
  };
};
