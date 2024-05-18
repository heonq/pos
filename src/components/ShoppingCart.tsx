import React from 'react';
import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { shoppingCartAtom } from '../atoms';
import ShoppingCartRow from './ShoppingCartRow';

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
  const shoppingCart = useRecoilValue(shoppingCartAtom);

  return (
    <ShoppingCartComponent>
      {shoppingCart.map((cartProduct, index) => (
        <ShoppingCartRow key={index} {...cartProduct}></ShoppingCartRow>
      ))}
    </ShoppingCartComponent>
  );
}
