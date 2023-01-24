import * as React from 'react';

const TEXT_FONT_SIZE = 11;

interface IProps {
  barsHeight: number;
  barWidth: number;
  leftOffset: number;
  markedEndXPos: number;
  markedStartXPos: number;
  markedWordsText: string;
  nextStartXPos: number;
  nextWordsText: string;
  prevEndXPos: number;
  prevWordsText: string;
  showTop?: boolean;
  svgHeight: number;
  svgWidth: number;
}

const WordsBars = ({
  barsHeight,
  barWidth,
  leftOffset,
  markedEndXPos,
  markedStartXPos,
  markedWordsText,
  nextStartXPos,
  nextWordsText,
  prevEndXPos,
  prevWordsText,
  showTop,
  svgHeight,
  svgWidth,
}: IProps) => {
  const markedTextContainerWidth =
    markedEndXPos - markedStartXPos + 20 + barWidth;
  const prevTextContainerWidth = prevEndXPos + barWidth + 10 + leftOffset;
  const nextTextContainerWidth = svgWidth - nextStartXPos - leftOffset;

  const markedWordsAdjustedText = React.useMemo(() => {
    const charactersQuant = markedTextContainerWidth / TEXT_FONT_SIZE;
    if (markedWordsText.length > charactersQuant) {
      const charachtersQuantOfHalf = Math.ceil(charactersQuant / 2) - 2;
      return (
        markedWordsText.substr(0, charachtersQuantOfHalf) +
        '...' +
        markedWordsText.substr(-charachtersQuantOfHalf, charachtersQuantOfHalf)
      );
    }
    return markedWordsText;
  }, [markedWordsText, markedTextContainerWidth]);

  const prevWordsTextAdjusted = React.useMemo(() => {
    if (!prevWordsText) return '';
    const charactersAllowedQuant = prevTextContainerWidth / TEXT_FONT_SIZE + 5;
    if (prevWordsText.length > charactersAllowedQuant) {
      return prevWordsText.substr(
        -charactersAllowedQuant,
        charactersAllowedQuant,
      );
    }
    return prevWordsText;
  }, [prevWordsText, prevTextContainerWidth]);

  const nextWordsTextAdjusted = React.useMemo(() => {
    if (!nextWordsText) return '';
    const charactersAllowedQuant = nextTextContainerWidth / TEXT_FONT_SIZE + 5;
    if (nextWordsText.length > charactersAllowedQuant) {
      return nextWordsText.substr(0, charactersAllowedQuant);
    }
    return nextWordsText;
  }, [nextWordsText, nextTextContainerWidth]);

  return (
    <>
      {showTop && (
        <>
          <rect
            fill="lightgrey"
            height="20"
            rx="5"
            stroke="darkgrey"
            strokeWidth="1"
            width={markedTextContainerWidth}
            x={markedStartXPos - 10}
            y={(svgHeight - barsHeight) / 2 - 10}
          />
          <text
            x={(markedStartXPos + markedEndXPos) / 2}
            y={(svgHeight - barsHeight) / 2 + 5}
            textAnchor="middle"
            style={{ userSelect: 'none' }}
          >
            {markedWordsAdjustedText}
          </text>
        </>
      )}
      {prevWordsText && prevTextContainerWidth > 0 && (
        <>
          <rect
            fill="lightgrey"
            height="20"
            rx="5"
            strokeWidth="1"
            stroke="darkgrey"
            width={prevTextContainerWidth}
            x={-leftOffset}
            y={(svgHeight - barsHeight) / 2 - 10 + barsHeight}
          />
          <text
            textAnchor="end"
            x={prevEndXPos - 10}
            y={(svgHeight - barsHeight) / 2 - 10 + barsHeight + 13}
            style={{ userSelect: 'none' }}
          >
            {'...' + prevWordsTextAdjusted}
          </text>
        </>
      )}
      {nextWordsText && nextTextContainerWidth >= 0 && (
        <>
          <rect
            height="20"
            fill="lightgrey"
            rx="5"
            strokeWidth="1"
            stroke="darkgrey"
            width={nextTextContainerWidth}
            x={nextStartXPos - 10}
            y={(svgHeight - barsHeight) / 2 - 10 + barsHeight}
          />
          <text
            x={nextStartXPos + barWidth + 10}
            y={(svgHeight - barsHeight) / 2 - 10 + barsHeight + 13}
            style={{ userSelect: 'none' }}
          >
            {nextWordsTextAdjusted + '...'}
          </text>
        </>
      )}
    </>
  );
};

export default WordsBars;
