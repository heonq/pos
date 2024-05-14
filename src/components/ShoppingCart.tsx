import React from 'react';
import styled from 'styled-components';

const ShoppingCartComponent = styled.div`
  height: 65%;
  border-style: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.elementBgColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  margin-bottom: 20px;
  overflow-y: scroll;
`;

export default function ShoppingCart() {
  return <ShoppingCartComponent></ShoppingCartComponent>;
}
