import * as React from 'react';

interface IProps {
  barsHeight: number;
  svgHeight: number;
  text: string;
  markedStartBarXPos: number;
  markedEndBarXPos: number;
  barsLeftOffset: number;
  barsRightOffset: number;
}

const TEXT_FONT_SIZE = 11;

const MergedTopWordBar = ({
  barsHeight,
  svgHeight,
  text,
  markedStartBarXPos,
  markedEndBarXPos,
  barsLeftOffset,
  barsRightOffset,
}: IProps) => {
  const x = Math.min(
    markedStartBarXPos + barsLeftOffset,
    markedEndBarXPos - 30 + barsRightOffset,
  );
  const width = Math.max(
    markedEndBarXPos + barsRightOffset - (markedStartBarXPos + barsLeftOffset),
    30,
  );

  const markedWordsAdjustedText = React.useMemo(() => {
    const charactersQuant = width / TEXT_FONT_SIZE;
    if (text.length > charactersQuant) {
      const charachtersQuantOfHalf = Math.ceil(charactersQuant / 2) - 2;
      return (
        text.substr(0, charachtersQuantOfHalf) +
        '...' +
        text.substr(-charachtersQuantOfHalf, charachtersQuantOfHalf)
      );
    }
    return text;
  }, [text, width]);

  return (
    <>
      <rect
        width={width + 25}
        x={x - 10}
        y={(svgHeight - barsHeight) / 2 - 10}
        fill="lightgrey"
        rx="5"
        stroke="darkgrey"
        strokeWidth="1"
        height="20"
      />
      <text
        x={x + width / 2}
        y={(svgHeight - barsHeight) / 2 + 5}
        textAnchor="middle"
        style={{ userSelect: 'none' }}
      >
        {markedWordsAdjustedText}
      </text>
    </>
  );
};

export default MergedTopWordBar;
