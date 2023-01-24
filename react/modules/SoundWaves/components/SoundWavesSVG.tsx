import * as React from 'react';
import styled from 'styled-components';
import { scaleLinear } from 'd3-scale';

import { getInitialBarsOffsetForDouble } from '../utils/getInitialBarsOffsetForDouble';
import DoubleChart from './DoubleChart';
import SolidChart from './SolidChart';

const TEXT_FONT_SIZE = 11;
const VIEWPORT_SVG_H = 270;
const VIEWPORT_BARS_H = 170;
const VIEWPORT_SVG_W = 1000;
const BARS_GAP_COEF = 1.3;
const BAR_WIDTH = 3;
const GAP = 50;

interface IProps {
  currentAudioTime: number;
  markedWords: string;
  markedWordsEnd: number;
  markedWordsStart: number;
  maxTimeRange: {
    startTime: number;
    endTime: number;
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
}

const SoundWaves = ({
  currentAudioTime,
  markedWords,
  markedWordsEnd, //in sec
  markedWordsStart, //in sec
  maxTimeRange, //in nanosec
  nextWords,
  nextWordStart,
  prevWords,
  prevWordEnd,
  setAudioFragment,
  setMarkedWordsEnd,
  setMarkedWordsStart,
  setNextWordStart,
  setPrevWordEnd,
  soundWaves,
}: IProps) => {
  const svgRef = React.useRef(null);

  const chartLimitsSec = React.useMemo(
    () => ({
      start: maxTimeRange.startTime,
      end: maxTimeRange.endTime,
    }),
    [maxTimeRange],
  );
  const wavesToDisplay = React.useMemo(
    () =>
      soundWaves.filter(
        (_, i) =>
          i >= chartLimitsSec.start * 100 && i <= chartLimitsSec.end * 100,
      ),
    [soundWaves, chartLimitsSec],
  );
  const maxDataPoint = React.useMemo(() => Math.max(...wavesToDisplay), [
    wavesToDisplay,
  ]);

  const onePartWidth = (VIEWPORT_SVG_W - GAP) / 2;
  const barsInViewport = Math.floor(onePartWidth / (BAR_WIDTH * BARS_GAP_COEF));
  const barsQuantity = Math.round(
    (chartLimitsSec.end - chartLimitsSec.start) * 100,
  );
  const doubleChartXScale = React.useMemo(
    () =>
      scaleLinear()
        .range([0, barsQuantity * BAR_WIDTH * BARS_GAP_COEF])
        .domain([0, barsQuantity]),
    [barsQuantity],
  );
  const rightZeroOffset = onePartWidth + GAP;
  const { initialLeftOffset, initialRightOffset } = React.useMemo(
    () =>
      getInitialBarsOffsetForDouble(
        barsInViewport,
        chartLimitsSec.start,
        doubleChartXScale,
        rightZeroOffset,
        markedWordsStart,
        markedWordsEnd,
        nextWordStart,
      ),
    [
      barsInViewport,
      chartLimitsSec.start,
      doubleChartXScale,
      rightZeroOffset,
      markedWordsStart,
      markedWordsEnd,
      nextWordStart,
    ],
  );

  const [barsLeftOffset, setBarsLeftOffset] = React.useState(initialLeftOffset);
  const [barsRightOffset, setBarsRightOffset] = React.useState(
    initialRightOffset,
  );

  const showTwoCharts =
    (barsRightOffset - barsLeftOffset - rightZeroOffset) * -1 >=
    VIEWPORT_SVG_W - GAP;

  return (
    <SoundWaves.SVG
      height={VIEWPORT_SVG_H}
      ref={svgRef}
      style={{ marginLeft: 'auto', marginRight: 'auto' }}
      width={VIEWPORT_SVG_W}
    >
      <defs>
        <filter id="inset-shadow-left" width="200%" height="200%">
          <feOffset dx="10" dy="0" />
          <feGaussianBlur stdDeviation="5" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" result="inverse" />
          <feFlood floodColor="white" floodOpacity="1" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComponentTransfer in="shadow" result="shadow">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
        <filter id="inset-shadow-right" width="200%" height="200%">
          <feOffset dx="-10" dy="0" />
          <feGaussianBlur stdDeviation="5" result="offset-blur" />
          <feComposite operator="out" in="SourceGraphic" result="inverse" />
          <feFlood floodColor="white" floodOpacity="1" result="color" />
          <feComposite operator="in" in="color" in2="inverse" result="shadow" />
          <feComponentTransfer in="shadow" result="shadow">
            <feFuncA type="linear" slope="1" />
          </feComponentTransfer>
        </filter>
      </defs>
      {showTwoCharts ? (
        <DoubleChart
          barWidth={BAR_WIDTH}
          barsAreaHeight={VIEWPORT_BARS_H}
          barsGapCoeff={BARS_GAP_COEF}
          barsLeftOffset={barsLeftOffset}
          barsRightOffset={barsRightOffset}
          chartLimitsSec={chartLimitsSec}
          currentAudioTime={currentAudioTime}
          gap={GAP}
          initialLeftOffset={initialLeftOffset}
          initialRightOffset={initialRightOffset}
          markedWords={markedWords}
          markedWordsEnd={markedWordsEnd}
          markedWordsStart={markedWordsStart}
          maxDataPoint={maxDataPoint}
          nextWords={nextWords}
          nextWordStart={nextWordStart}
          onePartWidth={onePartWidth}
          prevWords={prevWords}
          prevWordEnd={prevWordEnd}
          rightZeroOffset={rightZeroOffset}
          setBarsLeftOffset={setBarsLeftOffset}
          setBarsRightOffset={setBarsRightOffset}
          setAudioFragment={setAudioFragment}
          setMarkedWordsEnd={setMarkedWordsEnd}
          setMarkedWordsStart={setMarkedWordsStart}
          setNextWordStart={setNextWordStart}
          setPrevWordEnd={setPrevWordEnd}
          soundWaves={wavesToDisplay}
          svgWidth={VIEWPORT_SVG_W}
          svgHeight={VIEWPORT_SVG_H}
          svgRef={svgRef}
          xScale={doubleChartXScale}
        />
      ) : (
        <SolidChart
          barWidth={BAR_WIDTH}
          barsAreaHeight={VIEWPORT_BARS_H}
          barsGapCoeff={BARS_GAP_COEF}
          chartLimitsSec={chartLimitsSec}
          currentAudioTime={currentAudioTime}
          markedWords={markedWords}
          markedWordsEnd={markedWordsEnd}
          markedWordsStart={markedWordsStart}
          maxDataPoint={maxDataPoint}
          maxTimeRangeInSec={chartLimitsSec}
          nextWords={nextWords}
          nextWordStart={nextWordStart}
          prevWords={prevWords}
          prevWordEnd={prevWordEnd}
          setAudioFragment={setAudioFragment}
          setMarkedWordsEnd={setMarkedWordsEnd}
          setMarkedWordsStart={setMarkedWordsStart}
          setNextWordStart={setNextWordStart}
          setPrevWordEnd={setPrevWordEnd}
          soundWaves={wavesToDisplay}
          svgWidth={VIEWPORT_SVG_W}
          svgHeight={VIEWPORT_SVG_H}
          svgRef={svgRef}
        />
      )}
    </SoundWaves.SVG>
  );
};

SoundWaves.SVG = styled.svg`
  & text {
    font-family: 'Roboto Mono', monospace;
    font-size: ${TEXT_FONT_SIZE}px;
    user-select: none;
  }
`;

export default SoundWaves;
