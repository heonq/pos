import React, { useEffect } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  paymentInfoSelector,
  salesHistorySelector,
  salesNumberAtom,
  shoppingCartAtom,
  shoppingCartSelector,
  splitPaymentAtom,
} from '../atoms';
import formatter from '../utils/formatter';
import { paymentMethodsEnum } from '../Interfaces/enums';
import { collection, doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useQuery } from 'react-query';
import { ISalesHistory } from '../Interfaces/DataInterfaces';
import { fetchSalesHistory } from '../utils/fetchFunctions';
import { useNavigate } from 'react-router-dom';

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
  span.discount {
    color: blue;
  }
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
  const setSalesHistory = useSetRecoilState(salesHistorySelector);
  const resetShoppingCart = useResetRecoilState(shoppingCartSelector);
  const uid = auth.currentUser?.uid;
  const date = formatter.formatDate(new Date());
  const { data, refetch } = useQuery<ISalesHistory[]>('salesHistory', () => fetchSalesHistory(uid!));
  const setSalesNumber = useSetRecoilState(salesNumberAtom);
  const navigate = useNavigate();
  const splitPayment = useRecoilValue(splitPaymentAtom);
  const salesDataCollectionRef = collection(doc(collection(db, 'salesData'), uid), date);

  const checkShoppingCartEmpty = () => {
    if (!shoppingCart.length) {
      alert('상품을 추가해야 합니다.');
      return true;
    }
    return false;
  };

  const changePaymentMethod = (method: paymentMethodsEnum) => {
    if (checkShoppingCartEmpty()) return;
    setPaymentInfo((prevPayment) => {
      return { ...prevPayment, method };
    });
  };

  const updateSalesHistory = () => {
    const time = formatter.formatTime(new Date());
    setSalesHistory((originalSalesHistory) => {
      return { ...originalSalesHistory, date, time };
    });
  };

  useEffect(() => {
    setSalesNumber(() => {
      return data && data.length ? data.sort((a, b) => b.number - a.number)[0].number : 0;
    });
  }, [data]);

  const storeSalesHistory = useRecoilCallback(({ snapshot }) => async () => {
    if (paymentInfo.method === '') return alert('결제수단을 선택해주세요.');
    try {
      const updatedSalesHistory = await snapshot.getPromise(salesHistorySelector);
      if (paymentInfo.method === paymentMethodsEnum.Split) handleSplitPayment(updatedSalesHistory);
      else handleNormalPayment(updatedSalesHistory);
      resetShoppingCart();
    } catch (e) {
      console.log(e);
    }
  });

  const handleNormalPayment = async (updatedSalesHistory: ISalesHistory) => {
    const newDoc = doc(salesDataCollectionRef, updatedSalesHistory.number.toString());
    await setDoc(newDoc, updatedSalesHistory);
    refetch();
  };

  const handleSplitPayment = async (updatedSalesHistory: ISalesHistory) => {
    const firstPaymentDoc = doc(salesDataCollectionRef, updatedSalesHistory.number.toString());
    const firstPaymentHistory = {
      ...updatedSalesHistory,
      method: splitPayment.method[0],
      chargedAmount: splitPayment.price[0],
      note: `${updatedSalesHistory.note} ${updatedSalesHistory.number},${
        updatedSalesHistory.number + 1
      } 분할결제`.trim(),
    };
    await setDoc(firstPaymentDoc, firstPaymentHistory);
    const secondPaymentDoc = doc(salesDataCollectionRef, (updatedSalesHistory.number + 1).toString());
    const secondPaymentHistory = {
      ...updatedSalesHistory,
      products: [],
      number: updatedSalesHistory.number + 1,
      method: splitPayment.method[1],
      chargedAmount: splitPayment.price[1],
      note: `${updatedSalesHistory.note} ${updatedSalesHistory.number},${
        updatedSalesHistory.number + 1
      } 분할결제`.trim(),
    };
    await setDoc(secondPaymentDoc, secondPaymentHistory);
    refetch();
  };

  const onPaymentModalButtonClick = (path: string) => {
    if (checkShoppingCartEmpty()) return;
    navigate(path);
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
          <PaymentMethodButton
            className={paymentInfo.method === paymentMethodsEnum.Split ? 'selected' : ''}
            onClick={() => onPaymentModalButtonClick('/split-payment')}
          >
            {paymentMethodsEnum.Split}
          </PaymentMethodButton>
          <PaymentMethodButton
            className={paymentInfo.discountAmount > 0 ? 'selected' : ''}
            onClick={() => onPaymentModalButtonClick('/discount')}
          >
            {paymentMethodsEnum.Discount}
          </PaymentMethodButton>
        </div>
      </PaymentMethodButtonsContainer>
      <PaymentBox>
        <Amount>
          <span className={paymentInfo.discountAmount > 0 ? 'discount' : ''}>
            {formatter.formatNumber(paymentInfo.chargedAmount)}
          </span>
        </Amount>
        <PaymentButtonsContainer>
          <PaymentButtons
            onClick={() => {
              updateSalesHistory();
              storeSalesHistory();
            }}
          >
            결제완료
          </PaymentButtons>
          <PaymentButtons onClick={resetShoppingCart}>초기화</PaymentButtons>
        </PaymentButtonsContainer>
      </PaymentBox>
    </>
  );
}
