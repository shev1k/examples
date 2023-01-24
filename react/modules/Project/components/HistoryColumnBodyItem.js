import React, { useState } from 'react';
import styled from 'styled-components';

import { JiraParser } from 'src/packages/JiraParser';

const HistoryColumnItem = ({ body }) => {
  const [containerRef, setContainerRef] = useState(null);

  const renderArrows = () => {
    if (containerRef) {
      const arrowContainer = containerRef.querySelector(
        'div[data-role="arrows-container"]',
      );
      const paragraphs = containerRef.querySelectorAll(
        'div[data-role="content-container"] > p',
      );
      const paragraphsCenterY = Array.from(paragraphs).map(
        (paragraph) => paragraph.offsetTop + paragraph.offsetHeight / 2,
      );
      const arrowContainerWidth = arrowContainer.offsetWidth - 6;
      const arrowContainerHeight = arrowContainer.offsetHeight;
      const arrowContainerCenterX = arrowContainerWidth / 2;

      const arrowPaths = [];
      let commonLinePath = '';

      for (const [index, paragraphCenterY] of paragraphsCenterY.entries()) {
        const isFirstParagraph = index === 0;
        const isLastParagraph = index === paragraphsCenterY.length - 1;
        const arrowTipLength = 5;

        const arrowLinePath = `
          M ${arrowContainerWidth}, ${paragraphCenterY}
          L ${arrowContainerCenterX}, ${paragraphCenterY}
          Z
        `;
        const arrowTipPath = `
          M ${arrowContainerWidth}, ${paragraphCenterY}
          L ${arrowContainerWidth - arrowTipLength}, ${
          paragraphCenterY - arrowTipLength
        }
          M ${arrowContainerWidth}, ${paragraphCenterY}
          L ${arrowContainerWidth - arrowTipLength}, ${
          paragraphCenterY + arrowTipLength
        }
        `;
        const arrowPath =
          arrowLinePath + (!isFirstParagraph ? arrowTipPath : '');

        arrowPaths.push(arrowPath);

        if (isFirstParagraph) {
          commonLinePath += `
            M ${arrowContainerCenterX}, ${paragraphCenterY}
          `;
        }

        if (isLastParagraph) {
          commonLinePath += `
            L ${arrowContainerCenterX}, ${paragraphCenterY}
            Z
          `;
        }
      }

      const strokeColor = '#c4c4c4';
      const strokeWidth = 2;

      return (
        <svg
          width={arrowContainerWidth}
          height={arrowContainerHeight}
          viewBox={`0 0 ${arrowContainerWidth} ${arrowContainerHeight}`}
          fill="none"
        >
          <path
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            d={commonLinePath}
          />
          {arrowPaths.map((arrowPath, index) => (
            <path
              key={index}
              stroke={strokeColor}
              strokeWidth={strokeWidth}
              d={arrowPath}
            />
          ))}
        </svg>
      );
    }

    return null;
  };

  const renderBody = () =>
    body.map((initialBodyText, index) => {
      const doesBodyChanged = body.length === 2;
      const isPrevText = index === 0;

      return (
        <BodyItem key={`body-item-${index}`}>
          <JiraParser
            style={{
              color: doesBodyChanged && isPrevText ? '#999' : '#484848',
            }}
            text={initialBodyText}
          />
        </BodyItem>
      );
    });

  if (body.length !== 1) {
    return (
      <Container ref={(ref) => setContainerRef(ref)}>
        <ArrowContainer data-role="arrows-container">
          {renderArrows()}
        </ArrowContainer>
        <ContentContainer data-role="content-container">
          {renderBody()}
        </ContentContainer>
      </Container>
    );
  }

  return <BodyItem>{body}</BodyItem>;
};

const Container = styled.div`
  display: flex;
  margin-left: -40px;
  position: relative;
`;

const ContentContainer = styled.div`
  display: flex;
  flex-flow: column nowrap;
`;

const ArrowContainer = styled.div`
  flex-basis: 40px;
  flex-shrink: 0;
`;

const BodyItem = styled.p`
  margin-bottom: 20px;

  p {
    margin-bottom: 0;
  }
`;

export default HistoryColumnItem;
