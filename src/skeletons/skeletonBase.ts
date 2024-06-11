import styled, { css, keyframes } from 'styled-components';

export const SkeletonElement = css`
  background-color: rgb(248, 248, 248);
  overflow: hidden;
`;

export const loadingAnimation = keyframes`
    0% {
      transform: translateX(-150%) skewX(-30deg);
    }
    100% {
      transform: translateX(400%) skewX(-30deg);
    }
`;

export const Shimmer = styled.div`
  width: 50%;
  height: 100%;
  background: rgba(255, 255, 255, 0.4);
  animation: ${loadingAnimation} 1.1s infinite;
  box-shadow: 0 0 10px 10px rgba(255, 255, 255, 0.2);
`;
