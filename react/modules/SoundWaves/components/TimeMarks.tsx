import * as React from 'react';
import moment from 'moment';

const HOUR_IN_SEC = 60 * 60;

interface IProps {
  barWidth: number;
  markedEndXPos: number;
  markedStartXPos: number;
  markedWordsEnd: number;
  markedWordsStart: number;
  nextStartXPos: number;
  nextWordStart: number;
  prevEndXPos: number;
  prevWordEnd: number;
  svgHeight: number;
}

const TimeMarks = ({
  barWidth,
  markedEndXPos,
  markedStartXPos,
  markedWordsEnd,
  markedWordsStart,
  nextWordStart,
  nextStartXPos,
  prevEndXPos,
  prevWordEnd,
  svgHeight,
}: IProps) => {
  const language = navigator.language;
  const langIsEn = language.includes('en');
  const formatWithHours = langIsEn ? 'HH:mm:ss.SS' : 'HH:mm:ss,SS';
  const formatWithoutHours = langIsEn ? 'mm:ss.SS' : 'mm:ss,SS';
  const formatString = React.useMemo(
    () => (markedWordsEnd > HOUR_IN_SEC ? formatWithHours : formatWithoutHours),
    [markedWordsEnd],
  );
  const markedStartTimeLabel = React.useMemo(
    () =>
      moment('2019-01-01')
        .startOf('day')
        .milliseconds(markedWordsStart * 1000)
        .format(formatString),
    [markedWordsStart],
  );
  const markedEndTimeLabel = React.useMemo(
    () =>
      moment('2019-01-01')
        .startOf('day')
        .milliseconds(markedWordsEnd * 1000)
        .format(formatString),
    [markedWordsEnd],
  );
  const prevEndTimeLabel = React.useMemo(
    () =>
      prevWordEnd
        ? moment('2019-01-01')
            .startOf('day')
            .milliseconds(prevWordEnd * 1000)
            .format(formatString)
        : '',
    [prevWordEnd],
  );
  const nextStartTimeLabel = React.useMemo(
    () =>
      nextWordStart
        ? moment('2019-01-01')
            .startOf('day')
            .milliseconds(nextWordStart * 1000)
            .format(formatString)
        : '',
    [nextWordStart],
  );
  return (
    <>
      <text
        fill="black"
        fontSize={12}
        color="black"
        style={{ userSelect: 'none' }}
        textAnchor="middle"
        x={markedStartXPos + barWidth / 2}
        y="15"
      >
        {markedStartTimeLabel}
      </text>
      <text
        color="black"
        fill="black"
        fontSize={12}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
        x={prevEndXPos + barWidth / 2}
        y={svgHeight - 15}
      >
        {prevEndTimeLabel}
      </text>
      <text
        color="black"
        fill="black"
        fontSize={12}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
        x={markedEndXPos + barWidth / 2}
        y="15"
      >
        {markedEndTimeLabel}
      </text>
      <text
        color="black"
        fill="black"
        fontSize={12}
        style={{ userSelect: 'none' }}
        textAnchor="middle"
        x={nextStartXPos + barWidth / 2}
        y={svgHeight - 15}
      >
        {nextStartTimeLabel}
      </text>
    </>
  );
};

export default TimeMarks;
