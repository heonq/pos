import React from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { paymentInfoSelector, shoppingCartAtom } from '../atoms';
import formatter from '../utils/formatter';
import { paymentMethodsEnum } from '../Interfaces/enums';

const PaymentBox = styled.div`
  display: flex;
  width: 100%;
  height: 17.5%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  overflow: visible;
  box-shadow: ${(props) => props.theme.boxShadow};
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.elementBgColor};
`;

const Amount = styled.div`
  border-style: none;
  width: 66.66%;
  height: 100%;
  text-align: center;
  line-height: 122.5px;
  font-size: 20px;
`;

const PaymentButtonsContainer = styled.div`
  width: 33.3%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${(props) => props.theme.elementBgColor};
`;

const PaymentButtons = styled.button`
  width: 100%;
  height: 50%;
  line-height: 61px;
  text-align: center;
  border-style: none;
  cursor: pointer;
  background-color: ${(props) => props.theme.elementBgColor};
  &:hover {
    filter: brightness(0.9);
  }
`;

const PaymentMethodButtonsContainer = styled.div`
  height: 17.5%;
  display: flex;
  justify-content: space-evenly;
  align-items: cener;
  flex-direction: column;
  border-style: none;
  margin-bottom: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.elementBgColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  div {
    width: 100%;
    height: 50%;
    display: flex;
    flex-direction: row;
    border-radius: ${(props) => props.theme.borderRadius};
    background-color: ${(props) => props.theme.elementBgColor};
  }
`;

const PaymentMethodButton = styled.button`
  width: 33.33%;
  height: 100%;
  line-height: 100%;
  text-align: center;
  border-style: none;
  border-radius: ${(props) => props.theme.borderRadius};
  background-color: ${(props) => props.theme.elementBgColor};
  cursor: pointer;
  &:hover {
    filter: brightness(0.9);
  }
  &.selected {
    background-color: blue;
    color: white;
  }
`;

export default function Payment() {
  const [paymentInfo, setPaymentInfo] = useRecoilState(paymentInfoSelector);
  const shoppingCart = useRecoilValue(shoppingCartAtom);
  const changePaymentMethod = (method: paymentMethodsEnum) => {
    if (!shoppingCart.length) return alert('상품을 추가해야 합니다.');
    setPaymentInfo((prevPayment) => {
      return { ...prevPayment, method };
    });
  };

  const paymentMethodsFirstRow = [paymentMethodsEnum.Card, paymentMethodsEnum.Cash, paymentMethodsEnum.Transfer];

  return (
    <>
      <PaymentMethodButtonsContainer>
        <div>
          {paymentMethodsFirstRow.map((method) => (
            <PaymentMethodButton
              className={paymentInfo.method === method ? 'selected' : ''}
              key={method}
              onClick={() => changePaymentMethod(method)}
            >
              {method}
            </PaymentMethodButton>
          ))}
        </div>
        <div>
          <PaymentMethodButton>{paymentMethodsEnum.Other}</PaymentMethodButton>
          <PaymentMethodButton>{paymentMethodsEnum.Split}</PaymentMethodButton>
          <PaymentMethodButton>{paymentMethodsEnum.Discount}</PaymentMethodButton>
        </div>
      </PaymentMethodButtonsContainer>
      <PaymentBox>
        <Amount>
          <span>{formatter.formatNumber(paymentInfo.chargedAmount)}</span>
        </Amount>
        <PaymentButtonsContainer>
          <PaymentButtons>결제완료</PaymentButtons>
          <PaymentButtons>초기화</PaymentButtons>
        </PaymentButtonsContainer>
      </PaymentBox>
    </>
  );
}
