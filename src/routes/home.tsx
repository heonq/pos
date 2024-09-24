import React, { useEffect } from 'react';
import styled from 'styled-components';
import Header from '../components/Header';
import Products from '../components/Products';
import ShoppingCart from '../components/ShoppingCart';
import Payment from '../components/Payment';
import { Outlet } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import { dateState, headerMenusDisplaySelector, shoppingCartSelector } from '../atoms';
import { auth } from '../firebase';
import formatter from '../utils/formatter';

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

export const ShoppingCartContainer = styled.div`
  width: 25%;
  height: 100%;
  display: flex;
  flex-direction: column;
`;

export default function Home() {
  const [headerMenusDisplay, setHeaderMenusDisplay] = useRecoilState(headerMenusDisplaySelector);
  const onElseClick = () => {
    headerMenusDisplay && setHeaderMenusDisplay(false);
  };
  const resetShoppingCart = useResetRecoilState(shoppingCartSelector);
  const uid = auth.currentUser?.uid;
  const [date, setDate] = useRecoilState(dateState);

  useEffect(() => {
    resetShoppingCart();
  }, [uid, resetShoppingCart]);

  useEffect(() => {
    const updateDate = () => {
      if (new Date(date).getDate() !== new Date().getDate()) setDate(formatter.formatDate(new Date()));
    };
    const intervalId = setInterval(updateDate, 1000);
    return () => clearInterval(intervalId);
  }, [date, setDate]);

  return (
    <>
      <Outlet />
      <Wrapper onClick={onElseClick}>
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
