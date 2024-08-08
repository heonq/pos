import styled from 'styled-components';
import { Shimmer, SkeletonElement } from './skeletonBase';

const SkeletonDiv = styled.div`
  ${SkeletonElement};
  padding: 10px;
`;

const SkeletonTableRow = ({ columnLength }: { columnLength: number }) => {
  return (
    <tr>
      {Array.from({ length: columnLength }).map((_) => {
        return (
          <td>
            <SkeletonDiv>
              <Shimmer></Shimmer>
            </SkeletonDiv>
          </td>
        );
      })}
    </tr>
  );
};

export default function SalesHistoryTableSkeleton({ productLength }: { productLength: number }) {
  return (
    <>
      {Array.from({ length: 5 }).map((_) => {
        return <SkeletonTableRow {...{ columnLength: productLength + 8 }} />;
      })}
    </>
  );
}
