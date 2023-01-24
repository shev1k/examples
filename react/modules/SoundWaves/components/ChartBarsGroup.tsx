import { ScaleLinear } from 'd3-scale';
import * as React from 'react';
import styled from 'styled-components';

interface IProps {
  soundWaves: number[];
  yScale: ScaleLinear<number, number>;
  barWidth: number;
  xScale: ScaleLinear<number, number>;
  svgHeight: number;
  onBarClick: (barIndex: number) => void;
}

const DoubleChartBarsGroup = ({
  soundWaves,
  yScale,
  barWidth,
  xScale,
  svgHeight,
  onBarClick,
}: IProps) => {
  return (
    <g>
      {soundWaves.map((freq, i) => (
        <DoubleChartBarsGroup.Bar
          key={freq + i}
          data-freq={freq}
          height={Math.max(yScale(freq), 0.5)}
          width={barWidth}
          x={xScale(i)}
          y={(svgHeight - yScale(freq)) / 2}
          onClick={() => onBarClick(i)}
          fill={'black'}
        />
      ))}
    </g>
  );
};

DoubleChartBarsGroup.Bar = styled.rect`
  &:hover {
    fill: #484848;
  }
`;

export default React.memo(DoubleChartBarsGroup);
