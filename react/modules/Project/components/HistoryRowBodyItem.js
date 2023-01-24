import React, { Fragment, memo, useCallback } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { JiraParser } from 'src/packages/JiraParser';
import { getStatusNameColorMap } from 'src/modules/Mappings/reducer';
import { ACTION_CHANGE_TYPE } from 'src/constants/constants';
import { ReactComponent as HistoryRowArrow } from '../assets/HistoryRowArrow.svg';

const HistoryRowItem = ({ action, body }) => {
  const statusColorMap = useSelector(getStatusNameColorMap());

  const getBodyItemStyles = useCallback(() => {
    switch (action) {
      case ACTION_CHANGE_TYPE.STATUS: {
        const commonStyles = `
          padding: 3px 6px;
          border-radius: 6px;
          font-weight: 800;
          font-size: 10px;

          p {
            color: #fff !important;
            font-size: 10px;
            text-transform: uppercase;
          }
        `;

        const [firstElementBackground, secondElementBackground] = statusColorMap
          ? [
              statusColorMap[body[0]] || '#0C56C9',
              statusColorMap[body[1]] || '#0C56C9',
            ]
          : ['', ''];

        return {
          firstElement: `
            ${commonStyles}
            background: ${firstElementBackground};
          `,
          secondElement: `
            ${commonStyles}
            background: ${secondElementBackground};
        `,
        };
      }

      case ACTION_CHANGE_TYPE.TIMEORIGINALESTIMATE:
      case ACTION_CHANGE_TYPE.TIMESPENT: {
        const commonStyles = `
          width: fit-content;
          padding: 1px 4px;
          border-radius: 7px;
          font-family: Montserrat;
          border: 0.5px solid #c1c7d0;

          p {
            font-size: 10px;
            color: #484848;
          }
        `;

        return {
          firstElement: commonStyles,
          secondElement: commonStyles,
        };
      }

      default: {
        return { firstElement: '', secondElement: '' };
      }
    }
  }, [action, body, statusColorMap]);

  const renderHistoryBody = useCallback(() => {
    if (body.length === 0) return null;

    if (body.length === 2) {
      const [nextBodyText, prevBodyText] = body;

      const { firstElement, secondElement } = getBodyItemStyles();

      return (
        <Fragment>
          <BodyItem customStyles={firstElement}>
            <JiraParser text={nextBodyText || 'None'} />
          </BodyItem>
          <HistoryRowArrow style={{ marginBottom: 10 }} />
          <BodyItem customStyles={secondElement}>
            <JiraParser text={prevBodyText || 'None'} />
          </BodyItem>
        </Fragment>
      );
    }

    return (
      <BodyItem>
        <JiraParser text={body[0] || 'None'} />
      </BodyItem>
    );
  }, [body, getBodyItemStyles]);

  return <Container>{renderHistoryBody()}</Container>;
};

const Container = styled.div`
  display: flex;
  align-items: center;
  max-width: 100%;
`;

const BodyItem = styled.p`
  max-width: 100%;
  margin-bottom: 10px;
  word-break: break-word;

  p {
    margin-bottom: 0;
  }

  ${({ customStyles }) => customStyles}
`;

export default memo(HistoryRowItem);
