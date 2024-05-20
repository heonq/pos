import React from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Products from '../components/Products';
import ShoppingCart from '../components/ShoppingCart';
import Payment from '../components/Payment';
import { Outlet } from 'react-router-dom';

const Wrapper = styled.div`
  top: 30px;
  position: relative;
  margin: 0 auto;
  width: 1280px;
  height: 700px;
`;

const MainSection = styled.div`
  height: 100%;
  min-height: inherit;
  display: flex;
  justify-content: space-between;
  margin-top: 30px;
`;

const ShoppingCartContainer = styled.div`
  width: 25%;
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  return (
    <>
      <Outlet />
      <Wrapper>
        <Header></Header>
        <MainSection>
          <Products></Products>
          <ShoppingCartContainer>
            <ShoppingCart></ShoppingCart>
            <Payment></Payment>
          </ShoppingCartContainer>
        </MainSection>
      </Wrapper>
    </>
  );
}