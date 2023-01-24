import * as React from 'react';
import { scaleLinear, ScaleLinear } from 'd3-scale';

import MergedTopWordBar from './MergedTopWordBar';
import TimeMarks from './TimeMarks';
import WordsBars from './WordsBars';
import DragHandle from './DragHandle';
import ChartBarsGroup from './ChartBarsGroup';

import usePrevious from 'hooks/usePrevious';

interface IProps {
  barsAreaHeight: number;
  barWidth: number;
  barsGapCoeff: number;
  barsLeftOffset: number;
  barsRightOffset: number;
  chartLimitsSec: Record<string, number>;
  currentAudioTime: number;
  gap: number;
  initialLeftOffset: number;
  initialRightOffset: number;
  markedWords: string;
  markedWordsEnd: number;
  markedWordsStart: number;
  maxDataPoint: number;
  nextWords: string;
  nextWordStart: number | null;
  onePartWidth: number;
  prevWords: string;
  prevWordEnd: number | null;
  rightZeroOffset: number;
  setAudioFragment: (start: number, duration: number) => void;
  setBarsLeftOffset: (offset: number) => void;
  setBarsRightOffset: (offset: number) => void;
  setMarkedWordsEnd: (newValue: number) => void;
  setMarkedWordsStart: (newValue: number) => void;
  setNextWordStart: (newValue: number) => void;
  setPrevWordEnd: (newValue: number) => void;
  soundWaves: number[];
  svgRef: React.RefObject<HTMLElement>;
  svgHeight: number;
  svgWidth: number;
  xScale: ScaleLinear<number, number>;
}

const DoubleChart = ({
  barsAreaHeight,
  barWidth,
  barsGapCoeff,
  barsLeftOffset,
  barsRightOffset,
  chartLimitsSec,
  currentAudioTime,
  gap,
  initialLeftOffset,
  initialRightOffset,
  markedWords,
  markedWordsEnd,
  markedWordsStart,
  maxDataPoint,
  nextWords,
  nextWordStart,
  onePartWidth,
  prevWords,
  prevWordEnd,
  rightZeroOffset,
  setAudioFragment,
  setBarsLeftOffset,
  setBarsRightOffset,
  setMarkedWordsEnd,
  setMarkedWordsStart,
  setNextWordStart,
  setPrevWordEnd,
  svgRef,
  soundWaves,
  svgHeight,
  svgWidth,
  xScale,
}: IProps) => {
  const currentTimeBarIndex = React.useMemo(
    () => Math.round((currentAudioTime - chartLimitsSec.start) * 100),
    [currentAudioTime, chartLimitsSec.start],
  );

  const yScale = React.useMemo(
    () =>
      scaleLinear()
        .range([barsAreaHeight - 40, 0])
        .domain([maxDataPoint, 0]),
    [maxDataPoint],
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

  const markedStartBarXPos = xScale(highlightedMarkedStartBarIndex);
  const markedEndBarXPos = xScale(highlightedMarkedEndBarIndex);
  const prevEndBarXPos = xScale(highlightedPrevEndBarIndex);
  const nextStartBarXPos = xScale(highlightedNextStartBarIndex);

  const onBarClick = React.useCallback(
    barIndex => {
      const start = chartLimitsSec.start + barIndex / 100;
      const duration = chartLimitsSec.end - start;

      setAudioFragment(start, duration);
    },
    [chartLimitsSec, setAudioFragment],
  );

  // Handlers for sliding chart

  const startPointerPosLeft = React.useRef(0);
  const startPointerPosRight = React.useRef(0);
  const deltaLeft = React.useRef(barsLeftOffset);
  const deltaRight = React.useRef(barsRightOffset);

  const handleMouseMoveSliderLeft = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPosLeft.current;
    const newOffset = Math.max(
      Math.min(0, deltaX + deltaLeft.current),
      onePartWidth - barWidth * barsGapCoeff * soundWaves.length,
    );
    setBarsLeftOffset(newOffset);
  }, []);

  const handleMouseMoveSliderRight = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPosRight.current - rightZeroOffset;
    const newOffset = Math.max(
      Math.min(rightZeroOffset, deltaX + deltaRight.current),
      onePartWidth -
        barWidth * barsGapCoeff * soundWaves.length +
        rightZeroOffset,
    );

    setBarsRightOffset(newOffset);
  }, []);

  const handleMouseUpSliderLeft = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPosLeft.current;
    deltaLeft.current = deltaX + deltaLeft.current;
    document.removeEventListener('mousemove', handleMouseMoveSliderLeft);
    document.removeEventListener('mouseup', handleMouseUpSliderLeft);
  }, []);

  const handleMouseUpSliderRight = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPosRight.current - rightZeroOffset;
    deltaRight.current = deltaX + deltaRight.current;
    document.removeEventListener('mousemove', handleMouseMoveSliderRight);
    document.removeEventListener('mouseup', handleMouseUpSliderRight);
  }, []);

  const handleMouseDownSlider = React.useCallback(e => {
    if (e.target.dataset.role) return;
    if (e.target.id === 'left-group') {
      startPointerPosLeft.current = e.clientX;
      document.addEventListener('mousemove', handleMouseMoveSliderLeft);
      document.addEventListener('mouseup', handleMouseUpSliderLeft);
    } else if (e.target.id === 'right-group') {
      startPointerPosRight.current = e.clientX - rightZeroOffset;
      document.addEventListener('mousemove', handleMouseMoveSliderRight);
      document.addEventListener('mouseup', handleMouseUpSliderRight);
    }
  }, []);

  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveSliderLeft);
      document.removeEventListener('mouseup', handleMouseUpSliderLeft);
    };
  }, []);

  const prevSoundWaves = usePrevious(soundWaves);

  React.useEffect(() => {
    if (
      prevSoundWaves &&
      JSON.stringify(prevSoundWaves) !== JSON.stringify(soundWaves)
    ) {
      setBarsLeftOffset(initialLeftOffset);
      setBarsRightOffset(initialRightOffset);
      startPointerPosLeft.current = 0;
      startPointerPosRight.current = 0;
      deltaLeft.current = initialLeftOffset;
      deltaRight.current = initialRightOffset;
      document.removeEventListener('mousemove', handleMouseMoveSliderLeft);
      document.removeEventListener('mouseup', handleMouseUpSliderLeft);
    }
  }, [
    soundWaves,
    prevSoundWaves,
    initialLeftOffset,
    initialRightOffset,
    handleMouseMoveSliderLeft,
    handleMouseUpSliderLeft,
  ]);

  // Handlers for drag handles

  const handleMouseMoveMarkedStart = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition =
        Math.max(Math.min(e.clientX - svgBoundingRect.left, onePartWidth), 0) -
        barsLeftOffset;
      const barNumber = Math.max(
        Math.round(xScale.invert(pointerPosition)),
        highlightedPrevEndBarIndex,
      );
      const newTimeStart = chartLimitsSec.start + barNumber / 100;
      if (newTimeStart >= markedWordsEnd || newTimeStart < prevWordEnd) {
        return;
      }

      setMarkedWordsStart(newTimeStart);
    },
    [
      highlightedPrevEndBarIndex,
      barsLeftOffset,
      markedWordsEnd,
      chartLimitsSec,
      prevWordEnd,
      setMarkedWordsStart,
      xScale,
    ],
  );

  const handleMouseMovePrevEnd = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition =
        Math.max(Math.min(e.clientX - svgBoundingRect.left, onePartWidth), 0) -
        barsLeftOffset;
      const barNumber = Math.max(Math.round(xScale.invert(pointerPosition)), 0);
      const newTimePrevEnd = Math.min(
        chartLimitsSec.start + barNumber / 100,
        markedWordsStart,
      );
      if (
        newTimePrevEnd > markedWordsStart ||
        newTimePrevEnd < chartLimitsSec.start
      )
        return;

      setPrevWordEnd(newTimePrevEnd);
    },
    [
      barsLeftOffset,
      markedWordsStart,
      chartLimitsSec.start,
      setMarkedWordsStart,
      setPrevWordEnd,
      xScale,
    ],
  );

  const handleMouseMoveNextStart = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition =
        Math.max(
          Math.min(e.clientX - svgBoundingRect.left, svgWidth),
          onePartWidth + gap,
        ) - barsRightOffset;
      const barNumber = Math.round(xScale.invert(pointerPosition));
      const newTimeNextStart = Math.max(
        chartLimitsSec.start + barNumber / 100,
        markedWordsEnd,
      );
      if (newTimeNextStart < markedWordsEnd) return;

      setNextWordStart(newTimeNextStart);
    },
    [
      barsRightOffset,
      markedWordsEnd,
      chartLimitsSec.start,
      setNextWordStart,
      svgWidth,
      xScale,
    ],
  );

  const handleMouseMoveMarkedEnd = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition =
        Math.max(
          Math.min(e.clientX - svgBoundingRect.left, svgWidth),
          onePartWidth + gap,
        ) - barsRightOffset;
      const barNumber = Math.min(
        Math.round(xScale.invert(pointerPosition)),
        highlightedNextStartBarIndex || soundWaves.length - 1,
      );
      const newTimeEnd = chartLimitsSec.start + barNumber / 100;
      if (
        newTimeEnd <= markedWordsStart ||
        (nextWordStart && newTimeEnd > nextWordStart)
      )
        return;

      setMarkedWordsEnd(newTimeEnd);
    },
    [
      barsRightOffset,
      highlightedNextStartBarIndex,
      markedWordsStart,
      chartLimitsSec.start,
      nextWordStart,
      setMarkedWordsEnd,
      setMarkedWordsStart,
      xScale,
    ],
  );

  const handleMouseUpMarkedStart = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveMarkedStart);
    document.removeEventListener('mouseup', handleMouseUpMarkedStart);
  }, [handleMouseMoveMarkedStart]);

  const handleMouseUpPrevEnd = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMovePrevEnd);
    document.removeEventListener('mouseup', handleMouseUpPrevEnd);
  }, [handleMouseMovePrevEnd]);

  const handleMouseUpMarkedEnd = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveMarkedEnd);
    document.removeEventListener('mouseup', handleMouseUpMarkedEnd);
  }, [handleMouseMoveMarkedEnd]);

  const handleMouseUpNextStart = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveNextStart);
    document.removeEventListener('mouseup', handleMouseUpNextStart);
  }, [handleMouseMoveNextStart]);

  const handleMouseDownDragHandle = React.useCallback(
    e => {
      const { target } = e;
      const role = target.dataset.role;

      if (role === 'marked-start-drag-handle') {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMoveMarkedStart);
        document.addEventListener('mouseup', handleMouseUpMarkedStart);
      } else if (role === 'prev-end-drag-handle') {
        document.addEventListener('mousemove', handleMouseMovePrevEnd);
        document.addEventListener('mouseup', handleMouseUpPrevEnd);
      } else if (role === 'marked-end-drag-handle') {
        document.addEventListener('mousemove', handleMouseMoveMarkedEnd);
        document.addEventListener('mouseup', handleMouseUpMarkedEnd);
      } else if (role === 'prev-end-drag-handle') {
        document.addEventListener('mousemove', handleMouseMovePrevEnd);
        document.addEventListener('mouseup', handleMouseUpPrevEnd);
      } else if (role === 'next-start-drag-handle') {
        document.addEventListener('mousemove', handleMouseMoveNextStart);
        document.addEventListener('mouseup', handleMouseUpNextStart);
      }
    },
    [
      handleMouseMoveMarkedEnd,
      handleMouseMoveMarkedStart,
      handleMouseUpMarkedEnd,
      handleMouseUpMarkedStart,
      handleMouseMovePrevEnd,
      handleMouseUpPrevEnd,
      handleMouseMoveNextStart,
      handleMouseUpNextStart,
    ],
  );

  React.useEffect(
    () => () => {
      document.removeEventListener('mousemove', handleMouseMoveMarkedEnd);
      document.removeEventListener('mouseup', handleMouseUpMarkedEnd);
      document.removeEventListener('mousemove', handleMouseMoveMarkedStart);
      document.removeEventListener('mouseup', handleMouseUpMarkedStart);
      document.removeEventListener('mousemove', handleMouseMovePrevEnd);
      document.removeEventListener('mouseup', handleMouseUpPrevEnd);
      document.removeEventListener('mousemove', handleMouseMoveNextStart);
      document.removeEventListener('mouseup', handleMouseUpNextStart);
    },
    [],
  );

  return (
    <>
      <defs>
        <clipPath id="leftPartClipPath">
          <rect height={svgHeight} width={onePartWidth} x={0} y={0} />
        </clipPath>
        <clipPath id="rightPartClipPath">
          <rect
            height={svgHeight}
            width={onePartWidth}
            x={rightZeroOffset}
            y={0}
          />
        </clipPath>
        <clipPath id="leftWordBarsClipPath">
          <rect height={svgHeight} width={onePartWidth + gap / 2} x={0} y={0} />
        </clipPath>
        <clipPath id="rightWordBarsClipPath">
          <rect
            height={svgHeight}
            width={onePartWidth + gap / 2}
            x={rightZeroOffset - gap / 2}
            y={0}
          />
        </clipPath>
      </defs>
      <g clipPath="url(#leftPartClipPath)">
        <g
          transform={`translate(${barsLeftOffset}, 0)`}
          onMouseDown={handleMouseDownSlider}
        >
          <TimeMarks
            barWidth={barWidth}
            markedEndXPos={markedEndBarXPos}
            markedStartXPos={markedStartBarXPos}
            markedWordsEnd={markedWordsEnd}
            markedWordsStart={markedWordsStart}
            nextWordStart={nextWordStart}
            nextStartXPos={nextStartBarXPos}
            prevEndXPos={prevEndBarXPos}
            prevWordEnd={prevWordEnd}
            svgHeight={svgHeight}
          />
          <rect
            id="left-group"
            fill="transparent"
            width={xScale.range()[1]}
            height={svgHeight}
            y={0}
            cursor="grab"
          />
          <ChartBarsGroup
            soundWaves={soundWaves}
            yScale={yScale}
            barWidth={barWidth}
            xScale={xScale}
            svgHeight={svgHeight}
            onBarClick={onBarClick}
          />
          {currentTimeBarIndex >= 0 &&
            currentTimeBarIndex <= soundWaves.length - 1 && (
              <rect
                data-freq={soundWaves[currentTimeBarIndex]}
                height={Math.max(yScale(soundWaves[currentTimeBarIndex]), 0.5)}
                width={barWidth}
                x={xScale(currentTimeBarIndex)}
                y={(svgHeight - yScale(soundWaves[currentTimeBarIndex])) / 2}
                onClick={() => onBarClick(currentTimeBarIndex)}
                fill="#FF7371"
              />
            )}
          <g>
            <rect
              id="left-marked-start-bar-handle-line"
              data-freq={soundWaves[highlightedMarkedStartBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={markedStartBarXPos}
              y={0 + 50}
            />
            <rect
              id="left-marked-start-bar"
              data-freq={soundWaves[highlightedMarkedStartBarIndex]}
              fill="palegreen"
              height={yScale(soundWaves[highlightedMarkedStartBarIndex]) / 2}
              width={barWidth}
              x={markedStartBarXPos}
              y={
                (svgHeight -
                  yScale(soundWaves[highlightedMarkedStartBarIndex])) /
                2
              }
            />
          </g>
          <g>
            <rect
              id="left-marked-end-bar-handle-line"
              data-freq={soundWaves[highlightedMarkedEndBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={markedEndBarXPos}
              y={0 + 50}
            />
            {soundWaves[highlightedMarkedEndBarIndex] && (
              <rect
                id="left-marked-end-bar"
                data-freq={soundWaves[highlightedMarkedEndBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedMarkedEndBarIndex]) / 2}
                width={barWidth}
                x={markedEndBarXPos}
                y={
                  (svgHeight -
                    yScale(soundWaves[highlightedMarkedEndBarIndex])) /
                  2
                }
              />
            )}
          </g>
          {highlightedPrevEndBarIndex && (
            <g>
              <rect
                id="left-prev-end-bar-handle-line"
                data-freq={soundWaves[highlightedPrevEndBarIndex]}
                fill="forestgreen"
                height={svgHeight / 2 - 50}
                width={barWidth}
                x={prevEndBarXPos}
                y={svgHeight / 2}
              />
              <rect
                id="left-prev-end-bar"
                data-freq={soundWaves[highlightedPrevEndBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedPrevEndBarIndex]) / 2}
                width={barWidth}
                x={prevEndBarXPos}
                y={svgHeight / 2}
              />
            </g>
          )}
          {highlightedNextStartBarIndex && (
            <g>
              <rect
                id="left-next-start-bar-handle"
                data-freq={soundWaves[highlightedNextStartBarIndex]}
                fill="forestgreen"
                height={svgHeight / 2 - 50}
                width={barWidth}
                x={nextStartBarXPos}
                y={svgHeight / 2}
              />
              <rect
                id="left-next-start-bar"
                data-freq={soundWaves[highlightedNextStartBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedNextStartBarIndex]) / 2}
                width={barWidth}
                x={nextStartBarXPos}
                y={svgHeight / 2}
              />
            </g>
          )}
        </g>
      </g>
      <g clipPath="url(#rightPartClipPath)">
        <g
          transform={`translate(${barsRightOffset}, 0)`}
          onMouseDown={handleMouseDownSlider}
        >
          <TimeMarks
            barWidth={barWidth}
            markedEndXPos={markedEndBarXPos}
            markedStartXPos={markedStartBarXPos}
            markedWordsEnd={markedWordsEnd}
            markedWordsStart={markedWordsStart}
            nextWordStart={nextWordStart}
            nextStartXPos={nextStartBarXPos}
            prevEndXPos={prevEndBarXPos}
            prevWordEnd={prevWordEnd}
            svgHeight={svgHeight}
          />
          <WordsBars
            barWidth={barWidth}
            barsHeight={barsAreaHeight}
            leftOffset={0}
            markedEndXPos={markedEndBarXPos}
            markedStartXPos={markedStartBarXPos}
            markedWordsText="TEXT"
            nextStartXPos={nextStartBarXPos}
            nextWordsText="NEXT TEXT"
            prevEndXPos={prevEndBarXPos}
            prevWordsText="PREV TEXT"
            svgHeight={svgHeight}
            svgWidth={onePartWidth}
          />
          <rect
            id="right-group"
            fill="transparent"
            width={xScale.range()[1]}
            height={svgHeight}
            y={0}
            cursor="grab"
          />
          <ChartBarsGroup
            barWidth={barWidth}
            onBarClick={onBarClick}
            soundWaves={soundWaves}
            svgHeight={svgHeight}
            xScale={xScale}
            yScale={yScale}
          />
          {currentTimeBarIndex >= 0 &&
            currentTimeBarIndex <= soundWaves.length - 1 && (
              <rect
                data-freq={soundWaves[currentTimeBarIndex]}
                height={Math.max(yScale(soundWaves[currentTimeBarIndex]), 0.5)}
                width={barWidth}
                x={xScale(currentTimeBarIndex)}
                y={(svgHeight - yScale(soundWaves[currentTimeBarIndex])) / 2}
                onClick={() => onBarClick(currentTimeBarIndex)}
                fill="#FF7371"
              />
            )}
          <g>
            <rect
              id="right-marked-start-bar-handle-line"
              data-freq={soundWaves[highlightedMarkedStartBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={markedStartBarXPos}
              y={0 + 50}
            />
            <rect
              id="right-marked-start-bar"
              data-freq={soundWaves[highlightedMarkedStartBarIndex]}
              fill="palegreen"
              height={yScale(soundWaves[highlightedMarkedStartBarIndex]) / 2}
              width={barWidth}
              x={markedStartBarXPos}
              y={
                (svgHeight -
                  yScale(soundWaves[highlightedMarkedStartBarIndex])) /
                2
              }
            />
          </g>
          <g>
            <rect
              id="right-marked-end-bar-handle-line"
              data-freq={soundWaves[highlightedMarkedEndBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={markedEndBarXPos}
              y={0 + 50}
            />
            {soundWaves[highlightedMarkedEndBarIndex] && (
              <rect
                id="right-marked-end-bar"
                data-freq={soundWaves[highlightedMarkedEndBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedMarkedEndBarIndex]) / 2}
                width={barWidth}
                x={markedEndBarXPos}
                y={
                  (svgHeight -
                    yScale(soundWaves[highlightedMarkedEndBarIndex])) /
                  2
                }
              />
            )}
          </g>
          {highlightedPrevEndBarIndex && (
            <g>
              <rect
                id="right-prev-end-bar-handle-line"
                data-freq={soundWaves[highlightedPrevEndBarIndex]}
                fill="forestgreen"
                height={svgHeight / 2 - 50}
                width={barWidth}
                x={prevEndBarXPos}
                y={svgHeight / 2}
              />
              <rect
                id="right-prev-end-bar"
                data-freq={soundWaves[highlightedPrevEndBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedPrevEndBarIndex]) / 2}
                width={barWidth}
                x={prevEndBarXPos}
                y={svgHeight / 2}
              />
            </g>
          )}
          {highlightedNextStartBarIndex && (
            <g>
              <rect
                id="right-next-start-bar-handle"
                data-freq={soundWaves[highlightedNextStartBarIndex]}
                fill="forestgreen"
                height={svgHeight / 2 - 50}
                width={barWidth}
                x={nextStartBarXPos}
                y={svgHeight / 2}
              />
              <rect
                id="right-next-start-bar"
                data-freq={soundWaves[highlightedNextStartBarIndex]}
                fill="palegreen"
                height={yScale(soundWaves[highlightedNextStartBarIndex]) / 2}
                width={barWidth}
                x={nextStartBarXPos}
                y={svgHeight / 2}
              />
            </g>
          )}
        </g>
      </g>
      <g clipPath="url(#leftWordBarsClipPath)">
        <g transform={`translate(${barsLeftOffset}, 0)`}>
          <WordsBars
            barWidth={barWidth}
            barsHeight={barsAreaHeight}
            leftOffset={barsLeftOffset}
            markedEndXPos={markedEndBarXPos}
            markedStartXPos={markedStartBarXPos}
            markedWordsText={markedWords}
            nextStartXPos={nextStartBarXPos}
            nextWordsText={nextWords}
            prevEndXPos={prevEndBarXPos}
            prevWordsText={prevWords}
            svgHeight={svgHeight}
            svgWidth={onePartWidth}
          />
        </g>
      </g>
      <g pointerEvents="none">
        <rect
          x="0"
          width={onePartWidth}
          height={svgHeight}
          y={0}
          filter="url(#inset-shadow-left)"
        />
        <rect
          x="0"
          width={onePartWidth}
          height={svgHeight}
          y={0}
          filter="url(#inset-shadow-right)"
        />
        <rect
          x={onePartWidth + gap}
          width={onePartWidth}
          height={svgHeight}
          y={0}
          filter="url(#inset-shadow-left)"
        />
        <rect
          x={onePartWidth + gap}
          width={onePartWidth}
          height={svgHeight}
          y={0}
          filter="url(#inset-shadow-right)"
        />
      </g>
      <MergedTopWordBar
        barsHeight={barsAreaHeight}
        svgHeight={svgHeight}
        text={markedWords}
        markedStartBarXPos={markedStartBarXPos}
        markedEndBarXPos={markedEndBarXPos}
        barsLeftOffset={barsLeftOffset}
        barsRightOffset={barsRightOffset}
      />
      <g clipPath="url(#rightWordBarsClipPath)">
        <g transform={`translate(${barsRightOffset}, 0)`}>
          <WordsBars
            barWidth={barWidth}
            barsHeight={barsAreaHeight}
            leftOffset={barsRightOffset}
            markedEndXPos={markedEndBarXPos}
            markedStartXPos={markedStartBarXPos}
            markedWordsText={markedWords}
            nextStartXPos={nextStartBarXPos}
            nextWordsText={nextWords}
            prevEndXPos={prevEndBarXPos}
            prevWordsText={prevWords}
            svgHeight={svgHeight}
            svgWidth={svgWidth}
          />
        </g>
      </g>
      <g clipPath="url(#leftPartClipPath)">
        <g transform={`translate(${barsLeftOffset}, 0)`}>
          {prevWordEnd && prevWords && (
            <DragHandle
              role="prev-end-drag-handle"
              onMouseDown={handleMouseDownDragHandle}
              xPos={prevEndBarXPos + barWidth / 2 - 20 / 2}
              yPos={(svgHeight - barsAreaHeight) / 2 - 10 + barsAreaHeight}
            />
          )}
          <DragHandle
            role="marked-start-drag-handle"
            onMouseDown={handleMouseDownDragHandle}
            xPos={markedStartBarXPos + barWidth / 2 - 20 / 2}
            yPos={(svgHeight - barsAreaHeight) / 2 - 10}
          />
        </g>
      </g>
      <g clipPath="url(#rightPartClipPath)">
        <g transform={`translate(${barsRightOffset}, 0)`}>
          {nextWordStart && nextWords && (
            <DragHandle
              role="next-start-drag-handle"
              onMouseDown={handleMouseDownDragHandle}
              xPos={nextStartBarXPos + barWidth / 2 - 20 / 2}
              yPos={(svgHeight - barsAreaHeight) / 2 - 10 + barsAreaHeight}
            />
          )}
          <DragHandle
            role="marked-end-drag-handle"
            onMouseDown={handleMouseDownDragHandle}
            xPos={markedEndBarXPos + barWidth / 2 - 20 / 2}
            yPos={(svgHeight - barsAreaHeight) / 2 - 10}
          />
        </g>
      </g>
    </>
  );
};

export default React.memo(DoubleChart);
