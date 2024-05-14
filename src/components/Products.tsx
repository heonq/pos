import React from 'react';
import styled from 'styled-components';

const ProductsContainer = styled.div`
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  min-height: inherit;
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.boxShadow};
  margin-right: 20px;
`;

export default function Products() {
  return <ProductsContainer></ProductsContainer>;
}
