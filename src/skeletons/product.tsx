import React, { Fragment } from 'react';
import styled from 'styled-components';
import { Button } from '../components/product-components/product-button';
import { CategoryHeader, ScrollContainer } from '../components/product-components/category-mode';
import { Shimmer, SkeletonElement } from './skeletonBase';

const ButtonSkeleton = styled(Button)`
  ${SkeletonElement}
  pointer-events: none;
`;
const CategoryHeaderSkeleton = styled(CategoryHeader)`
  ${SkeletonElement}
  width:100px;
`;

export const CategoryModeSkeleton = () => {
  return (
    <div>
      {[1, 2, 3, 4, 5].map((el) => (
        <Fragment key={el}>
          <CategoryHeaderSkeleton>
            <Shimmer />
          </CategoryHeaderSkeleton>
          <ScrollContainer>
            {[1, 2, 3, 4, 5].map((el) => (
              <Fragment key={el}>
                <ButtonSkeleton>
                  <Shimmer />
                </ButtonSkeleton>
              </Fragment>
            ))}
          </ScrollContainer>
        </Fragment>
      ))}
    </div>
  );
};
