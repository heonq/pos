import React from 'react';
import styled from 'styled-components';

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
`;

export default function Payment() {
  return (
    <>
      <PaymentMethodButtonsContainer>
        <div>
          <PaymentMethodButton>카드결제</PaymentMethodButton>
          <PaymentMethodButton>현금결제</PaymentMethodButton>
          <PaymentMethodButton>계좌이체</PaymentMethodButton>
        </div>
        <div>
          <PaymentMethodButton>기타결제</PaymentMethodButton>
          <PaymentMethodButton>분할결제</PaymentMethodButton>
          <PaymentMethodButton>할인적용</PaymentMethodButton>
        </div>
      </PaymentMethodButtonsContainer>
      <PaymentBox>
        <Amount>
          <span>0</span>
        </Amount>
        <PaymentButtonsContainer>
          <PaymentButtons>결제완료</PaymentButtons>
          <PaymentButtons>초기화</PaymentButtons>
        </PaymentButtonsContainer>
      </PaymentBox>
    </>
  );
}
