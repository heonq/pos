import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SkeletonElement, Shimmer } from './skeletonBase';

const TableDiv = styled.div`
  ${SkeletonElement}
  width:120px;
  height: 15px;
  background-color: rgba(248, 248, 248, 1);
  border-radius: 5px;
`;

export const SalesStatisticTableSkeleton = () => {
  const array = Array.from({ length: 10 });
  return (
    <>
      {array.map((_, index) => (
        <Fragment key={index}>
          <tr>
            {[1, 2, 3, 4, 5].map((el) => (
              <td key={el}>
                <TableDiv>
                  <Shimmer />
                </TableDiv>
              </td>
            ))}
          </tr>
        </Fragment>
      ))}
    </>
  );
};
