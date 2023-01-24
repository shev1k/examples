import * as R from 'ramda';
import * as React from 'react';
import { ScaleLinear } from 'd3-scale';
import styled from 'styled-components';

import DragHandle from './DragHandle';
import TimeMarks from './TimeMarks';
import WordsBars from './WordsBars';
import ChartBarsGroup from './ChartBarsGroup';

interface IProps {
  barsAreaHeight: number;
  barGapCoef: number;
  barsLeftOffset: number;
  barWidth: number;
  currentTimeBarIndex: number;
  highlightedMarkedStartBarIndex: number;
  highlightedMarkedEndBarIndex: number;
  highlightedPrevEndBarIndex: number;
  highlightedNextStartBarIndex: number;
  markedWords: string;
  markedWordsStartTime: number;
  markedWordsEndTime: number;
  maxRangeWiderViewport: boolean;
  maxTimeRange: {
    start: number;
    end: number;
  };
  nextWords: string;
  nextWordStartTime: number;
  onBarClick: (barIndex: number) => void;
  prevWords: string;
  prevWordEndTime: number;
  setAudioFragment: (start: number, duration: number) => void;
  setBarsLeftOffset: (deltaX: number) => void;
  setMarkedWordsStart: (newValue: number) => void;
  setMarkedWordsEnd: (newValue: number) => void;
  setNextWordStart: (newValue: number) => void;
  setPrevWordEnd: (newValue: number) => void;
  soundWaves: number[];
  svgHeight: number;
  svgRef: React.RefObject<HTMLElement>;
  svgWidth: number;
  xScale: ScaleLinear<number, number>;
  yScale: ScaleLinear<number, number>;
}
const SolidGraphBars = ({
  barsAreaHeight,
  barGapCoef,
  barsLeftOffset,
  barWidth,
  currentTimeBarIndex,
  highlightedMarkedStartBarIndex,
  highlightedMarkedEndBarIndex,
  highlightedPrevEndBarIndex,
  highlightedNextStartBarIndex,
  markedWords,
  markedWordsStartTime,
  markedWordsEndTime,
  maxRangeWiderViewport,
  maxTimeRange,
  nextWords,
  nextWordStartTime,
  onBarClick,
  prevWords,
  prevWordEndTime,
  setBarsLeftOffset,
  setMarkedWordsEnd,
  setMarkedWordsStart,
  setNextWordStart,
  setPrevWordEnd,
  soundWaves,
  svgHeight,
  svgRef,
  svgWidth,
  xScale,
  yScale,
}: IProps) => {
  const needsSliding = soundWaves.length * barWidth * barGapCoef > svgWidth;
  const markedStartBarXPos = xScale(highlightedMarkedStartBarIndex);
  const markedEndBarXPos = xScale(highlightedMarkedEndBarIndex);
  const prevEndBarXPos = R.isNil(highlightedPrevEndBarIndex)
    ? null
    : xScale(highlightedPrevEndBarIndex);
  const nextStartBarXPos = R.isNil(highlightedNextStartBarIndex)
    ? null
    : xScale(highlightedNextStartBarIndex);

  const startPointerPos = React.useRef(0);
  const delta = React.useRef(barsLeftOffset);

  // Handlers for sliding chart

  const handleMouseMoveSlider = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPos.current;
    const newOffset = Math.max(
      Math.min(0, deltaX + delta.current),
      -(barWidth * barGapCoef * soundWaves.length - svgWidth),
    );
    setBarsLeftOffset(newOffset);
  }, []);

  const handleMouseUpSlider = React.useCallback(e => {
    const deltaX = e.clientX - startPointerPos.current;
    delta.current = deltaX + delta.current;
    document.removeEventListener('mousemove', handleMouseMoveSlider);
    document.removeEventListener('mouseup', handleMouseUpSlider);
  }, []);

  const handleMouseDownSlider = React.useCallback(e => {
    if (e.target.dataset.role) return;
    startPointerPos.current = e.clientX;
    document.addEventListener('mousemove', handleMouseMoveSlider);
    document.addEventListener('mouseup', handleMouseUpSlider);
  }, []);

  React.useEffect(() => {
    return () => {
      document.removeEventListener('mousemove', handleMouseMoveSlider);
      document.removeEventListener('mouseup', handleMouseUpSlider);
    };
  }, []);

  // Handlers for drah handles

  const handleMouseMoveMarkedStart = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition = Math.max(
        Math.min(e.clientX - svgBoundingRect.left, svgWidth) - barsLeftOffset,
        0,
      );
      const barNumber = Math.max(
        Math.round(xScale.invert(pointerPosition)),
        highlightedPrevEndBarIndex,
      );
      const newTimeStart = maxTimeRange.start + barNumber / 100;
      if (
        newTimeStart >= markedWordsEndTime ||
        newTimeStart < prevWordEndTime
      ) {
        return;
      }

      setMarkedWordsStart(newTimeStart);
    },
    [
      highlightedPrevEndBarIndex,
      barsLeftOffset,
      markedWordsEndTime,
      maxTimeRange.start,
      prevWordEndTime,
      setMarkedWordsStart,
      xScale,
    ],
  );

  const handleMouseMoveMarkedEnd = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition = Math.max(
        Math.min(e.clientX - svgBoundingRect.left, svgWidth) - barsLeftOffset,
        0,
      );
      const barNumber = Math.min(
        Math.round(xScale.invert(pointerPosition)),
        highlightedNextStartBarIndex || soundWaves.length - 1,
      );
      const newTimeEnd = maxTimeRange.start + barNumber / 100;
      if (
        newTimeEnd <= markedWordsStartTime ||
        (nextWordStartTime && newTimeEnd > nextWordStartTime)
      )
        return;

      setMarkedWordsEnd(newTimeEnd);
    },
    [
      barsLeftOffset,
      highlightedNextStartBarIndex,
      markedWordsStartTime,
      maxTimeRange.start,
      nextWordStartTime,
      setMarkedWordsEnd,
      setMarkedWordsStart,
      xScale,
      soundWaves,
    ],
  );

  const handleMouseMovePrevEnd = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition = Math.max(
        Math.min(e.clientX - svgBoundingRect.left, svgWidth) - barsLeftOffset,
        0,
      );
      const barNumber = Math.max(Math.round(xScale.invert(pointerPosition)), 0);
      const newTimePrevEnd = Math.min(
        maxTimeRange.start + barNumber / 100,
        markedWordsStartTime,
      );
      if (
        newTimePrevEnd > markedWordsStartTime ||
        newTimePrevEnd < maxTimeRange.start
      )
        return;

      setPrevWordEnd(newTimePrevEnd);
    },
    [
      barsLeftOffset,
      markedWordsStartTime,
      maxTimeRange.start,
      setMarkedWordsStart,
      setPrevWordEnd,
      xScale,
    ],
  );

  const handleMouseMoveNextStart = React.useCallback(
    e => {
      const svgBoundingRect = svgRef.current.getBoundingClientRect();
      const pointerPosition = Math.max(
        Math.min(e.clientX - svgBoundingRect.left, svgWidth) - barsLeftOffset,
        0,
      );
      const barNumber = Math.round(xScale.invert(pointerPosition));
      const newTimeNextStart = Math.max(
        maxTimeRange.start + barNumber / 100,
        markedWordsEndTime,
      );
      if (newTimeNextStart < markedWordsEndTime) return;

      setNextWordStart(newTimeNextStart);
    },
    [
      barsLeftOffset,
      markedWordsEndTime,
      maxTimeRange.start,
      setNextWordStart,
      svgWidth,
      xScale,
    ],
  );

  const handleMouseUpMarkedStart = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveMarkedStart);
    document.removeEventListener('mouseup', handleMouseUpMarkedStart);
  }, [handleMouseMoveMarkedStart]);

  const handleMouseUpMarkedEnd = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveMarkedEnd);
    document.removeEventListener('mouseup', handleMouseUpMarkedEnd);
  }, [handleMouseMoveMarkedEnd]);

  const handleMouseUpNextStart = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMoveNextStart);
    document.removeEventListener('mouseup', handleMouseUpNextStart);
  }, [handleMouseMoveNextStart]);

  const handleMouseUpPrevEnd = React.useCallback(() => {
    document.removeEventListener('mousemove', handleMouseMovePrevEnd);
    document.removeEventListener('mouseup', handleMouseUpPrevEnd);
  }, [handleMouseMovePrevEnd]);

  const handleMouseDownDragHandle = React.useCallback(
    e => {
      const { target } = e;
      const role = target.dataset.role;

      if (role === 'marked-start-drag-handle') {
        e.preventDefault();
        document.addEventListener('mousemove', handleMouseMoveMarkedStart);
        document.addEventListener('mouseup', handleMouseUpMarkedStart);
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
      <g
        transform={`translate(${barsLeftOffset}, 0)`}
        onMouseDown={needsSliding ? handleMouseDownSlider : null}
      >
        <rect
          fill="transparent"
          width={xScale.range()[1]}
          height={svgHeight}
          y={0}
          cursor={maxRangeWiderViewport ? 'grab' : 'auto'}
        />
        <line
          stroke="black"
          strokeWidth="1"
          x1="0"
          x2={xScale.range()[1]}
          y1={svgHeight / 2}
          y2={svgHeight / 2}
        />
        <g>
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
        </g>
        <g>
          <rect
            id="marked-start-bar-handle-line"
            data-freq={soundWaves[highlightedMarkedStartBarIndex]}
            fill="forestgreen"
            height={svgHeight / 2 - 50}
            width={barWidth}
            x={markedStartBarXPos}
            y={0 + 50}
          />
          <rect
            id="marked-start-bar"
            data-freq={soundWaves[highlightedMarkedStartBarIndex]}
            fill="palegreen"
            height={yScale(soundWaves[highlightedMarkedStartBarIndex]) / 2}
            width={barWidth}
            x={markedStartBarXPos}
            y={
              (svgHeight - yScale(soundWaves[highlightedMarkedStartBarIndex])) /
              2
            }
          />
        </g>
        <g>
          <rect
            id="marked-end-bar-handle-line"
            data-freq={soundWaves[highlightedMarkedEndBarIndex]}
            fill="forestgreen"
            height={svgHeight / 2 - 50}
            width={barWidth}
            x={markedEndBarXPos}
            y={0 + 50}
          />
          {soundWaves[highlightedMarkedEndBarIndex] && (
            <rect
              id="marked-end-bar"
              data-freq={soundWaves[highlightedMarkedEndBarIndex]}
              fill="palegreen"
              height={yScale(soundWaves[highlightedMarkedEndBarIndex]) / 2}
              width={barWidth}
              x={markedEndBarXPos}
              y={
                (svgHeight - yScale(soundWaves[highlightedMarkedEndBarIndex])) /
                2
              }
            />
          )}
        </g>
        {highlightedPrevEndBarIndex && (
          <g>
            <rect
              id="prev-end-bar-handle-line"
              data-freq={soundWaves[highlightedPrevEndBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={prevEndBarXPos}
              y={svgHeight / 2}
            />
            <rect
              id="prev-end-bar"
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
              id="next-start-bar-handle"
              data-freq={soundWaves[highlightedNextStartBarIndex]}
              fill="forestgreen"
              height={svgHeight / 2 - 50}
              width={barWidth}
              x={nextStartBarXPos}
              y={svgHeight / 2}
            />
            <rect
              id="next-start-bar"
              data-freq={soundWaves[highlightedNextStartBarIndex]}
              fill="palegreen"
              height={yScale(soundWaves[highlightedNextStartBarIndex]) / 2}
              width={barWidth}
              x={nextStartBarXPos}
              y={svgHeight / 2}
            />
          </g>
        )}
        <WordsBars
          barsHeight={barsAreaHeight}
          barWidth={barWidth}
          leftOffset={barsLeftOffset}
          markedEndXPos={markedEndBarXPos}
          markedStartXPos={markedStartBarXPos}
          markedWordsText={markedWords}
          nextStartXPos={nextStartBarXPos}
          nextWordsText={nextWords}
          prevEndXPos={prevEndBarXPos}
          prevWordsText={prevWords}
          showTop
          svgHeight={svgHeight}
          svgWidth={svgWidth}
        />
        <TimeMarks
          barWidth={barWidth}
          markedEndXPos={markedEndBarXPos}
          markedStartXPos={markedStartBarXPos}
          markedWordsEnd={markedWordsEndTime}
          markedWordsStart={markedWordsStartTime}
          nextStartXPos={nextStartBarXPos}
          nextWordStart={nextWordStartTime}
          prevEndXPos={prevEndBarXPos}
          prevWordEnd={prevWordEndTime}
          svgHeight={svgHeight}
        />
        {prevWordEndTime && prevWords && (
          <DragHandle
            role="prev-end-drag-handle"
            onMouseDown={handleMouseDownDragHandle}
            xPos={prevEndBarXPos + barWidth / 2 - 20 / 2}
            yPos={(svgHeight - barsAreaHeight) / 2 - 10 + barsAreaHeight}
          />
        )}
        {nextWordStartTime && nextWords && (
          <DragHandle
            role="next-start-drag-handle"
            onMouseDown={handleMouseDownDragHandle}
            xPos={nextStartBarXPos + barWidth / 2 - 20 / 2}
            yPos={(svgHeight - barsAreaHeight) / 2 - 10 + barsAreaHeight}
          />
        )}
        <DragHandle
          role="marked-start-drag-handle"
          onMouseDown={handleMouseDownDragHandle}
          xPos={markedStartBarXPos + barWidth / 2 - 20 / 2}
          yPos={(svgHeight - barsAreaHeight) / 2 - 10}
        />
        <DragHandle
          role="marked-end-drag-handle"
          onMouseDown={handleMouseDownDragHandle}
          xPos={markedEndBarXPos + barWidth / 2 - 20 / 2}
          yPos={(svgHeight - barsAreaHeight) / 2 - 10}
        />
      </g>
    </>
  );
};

SolidGraphBars.Bar = styled.rect`
  &:hover {
    fill: #484848;
  }
`;

export default SolidGraphBars;
