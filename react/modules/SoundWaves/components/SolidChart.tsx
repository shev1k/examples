import * as React from 'react';
import { scaleLinear } from 'd3-scale';

import { getInitialLeftOffsetForSolid } from '../utils/getInitialLeftOffsetForSolid';

import SolidGraphBars from './SolidGraphBars';

interface IProps {
  barsAreaHeight: number;
  barWidth: number;
  barsGapCoeff: number;
  chartLimitsSec: Record<string, number>;
  currentAudioTime: number;
  markedWords: string;
  markedWordsEnd: number;
  markedWordsStart: number;
  maxDataPoint: number;
  maxTimeRangeInSec: {
    start: number;
    end: number;
  };
  nextWords: string;
  nextWordStart: number | null;
  prevWords: string;
  prevWordEnd: number | null;
  setAudioFragment: (start: number, duration: number) => void;
  setMarkedWordsEnd: (newValue: number) => void;
  setMarkedWordsStart: (newValue: number) => void;
  setNextWordStart: (newValue: number) => void;
  setPrevWordEnd: (newValue: number) => void;
  soundWaves: number[];
  svgRef: React.RefObject<HTMLElement>;
  svgHeight: number;
  svgWidth: number;
}

const SolidChart = ({
  barsAreaHeight,
  barWidth,
  barsGapCoeff,
  chartLimitsSec,
  currentAudioTime,
  markedWords,
  markedWordsEnd,
  markedWordsStart,
  maxDataPoint,
  maxTimeRangeInSec,
  nextWords,
  nextWordStart,
  prevWords,
  prevWordEnd,
  setAudioFragment,
  setMarkedWordsEnd,
  setMarkedWordsStart,
  setNextWordStart,
  setPrevWordEnd,
  svgRef,
  soundWaves,
  svgHeight,
  svgWidth,
}: IProps) => {
  const currentTimeBarIndex = Math.round(
    (currentAudioTime - chartLimitsSec.start) * 100,
  );

  const yScale = React.useMemo(
    () =>
      scaleLinear()
        .range([barsAreaHeight - 40, 0])
        .domain([maxDataPoint, 0]),
    [maxDataPoint],
  );

  const barsQuantity = Math.round(
    (chartLimitsSec.end - chartLimitsSec.start) * 100,
  );
  const highlightedMarkedStartBarIndex = Math.round(
    (markedWordsStart - chartLimitsSec.start) * 100,
  );
  const highlightedMarkedEndBarIndex = Math.round(
    (markedWordsEnd - chartLimitsSec.start) * 100,
  );
  const highlightedNextStartBarIndex = nextWordStart
    ? Math.round((nextWordStart - chartLimitsSec.start) * 100)
    : null;
  const highlightedPrevEndBarIndex = prevWordEnd
    ? Math.round((prevWordEnd - chartLimitsSec.start) * 100)
    : null;

  const maxRangeWiderViewport =
    barsQuantity * barWidth * barsGapCoeff >= svgWidth;

  const xScale = React.useMemo(
    () =>
      scaleLinear()
        .range([0, barsQuantity * barWidth * barsGapCoeff])
        .domain([0, barsQuantity]),
    [barsQuantity],
  );
  const initialLeftOffset = getInitialLeftOffsetForSolid(
    Math.min(
      svgWidth / (barWidth * barsGapCoeff),
      Math.round((maxTimeRangeInSec.end - maxTimeRangeInSec.start) * 100),
    ),
    maxTimeRangeInSec.start,
    xScale,
    markedWordsStart,
    markedWordsEnd,
  );
  const [barsLeftOffset, setBarsLeftOffset] = React.useState(initialLeftOffset);

  const onBarClick = React.useCallback(barIndex => {
    const start = maxTimeRangeInSec.start + barIndex / 100;
    const duration = maxTimeRangeInSec.end - start;

    setAudioFragment(start, duration);
  }, []);

  return (
    <>
      <SolidGraphBars
        barWidth={barWidth}
        barGapCoef={barsGapCoeff}
        barsAreaHeight={barsAreaHeight}
        barsLeftOffset={barsLeftOffset}
        currentTimeBarIndex={currentTimeBarIndex}
        markedWords={markedWords}
        markedWordsStartTime={markedWordsStart}
        markedWordsEndTime={markedWordsEnd}
        nextWordStartTime={nextWordStart}
        onBarClick={onBarClick}
        prevWordEndTime={prevWordEnd}
        maxRangeWiderViewport={maxRangeWiderViewport}
        maxTimeRange={maxTimeRangeInSec}
        nextWords={nextWords}
        prevWords={prevWords}
        soundWaves={soundWaves}
        setAudioFragment={setAudioFragment}
        setBarsLeftOffset={setBarsLeftOffset}
        setMarkedWordsStart={setMarkedWordsStart}
        setMarkedWordsEnd={setMarkedWordsEnd}
        setNextWordStart={setNextWordStart}
        setPrevWordEnd={setPrevWordEnd}
        svgHeight={svgHeight}
        svgRef={svgRef}
        svgWidth={svgWidth}
        xScale={xScale}
        yScale={yScale}
        highlightedMarkedStartBarIndex={highlightedMarkedStartBarIndex}
        highlightedMarkedEndBarIndex={highlightedMarkedEndBarIndex}
        highlightedPrevEndBarIndex={highlightedPrevEndBarIndex}
        highlightedNextStartBarIndex={highlightedNextStartBarIndex}
      />
      {maxRangeWiderViewport && (
        <>
          <rect
            width={svgWidth}
            x={xScale.range()[0]}
            height={svgHeight}
            y={0}
            filter="url(#inset-shadow-left)"
            pointerEvents="none"
          />
          <rect
            width={svgWidth}
            x={xScale.range()[0]}
            height={svgHeight}
            y={0}
            filter="url(#inset-shadow-right)"
            pointerEvents="none"
          />
        </>
      )}
    </>
  );
};

export default SolidChart;
