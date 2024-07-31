import { useEffect, useState } from 'react';
import { useRecoilCallback, useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import {
  dateState,
  paymentInfoSelector,
  salesHistorySelector,
  salesNumberAtom,
  shoppingCartAtom,
  shoppingCartSelector,
  splitPaymentAtom,
} from '../atoms';
import formatter from '../utils/formatter';
import { PAYMENT_METHODS } from '../constants/enums';
import { auth } from '../firebase';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { IProduct, ISalesHistory } from '../Interfaces/DataInterfaces';
import { getSalesHistory, updateSalesQuantity } from '../utils/fetchFunctions';
import { useNavigate } from 'react-router-dom';
import useSalesDates from '../hooks/useSalesDates';
import useSetSalesHistoryMutation from '../hooks/useSetSalesHistoryMutation';
import useProductsAndCategories from '../hooks/useProductsAndCategories';
import QUERY_KEYS from '../constants/queryKeys';

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
  const setSalesHistorySelector = useSetRecoilState(salesHistorySelector);
  const resetShoppingCart = useResetRecoilState(shoppingCartSelector);
  const uid = auth.currentUser?.uid ?? '';
  const date = useRecoilValue(dateState);
  const { salesDates } = useSalesDates(uid);
  const { data } = useQuery<ISalesHistory[]>({
    queryKey: [QUERY_KEYS.salesHistory, date],
    queryFn: () => getSalesHistory(uid, date),
  });
  const setSalesNumber = useSetRecoilState(salesNumberAtom);
  const navigate = useNavigate();
  const splitPayment = useRecoilValue(splitPaymentAtom);
  const [etcReason, setEtcReason] = useState('');
  const mutation = useSetSalesHistoryMutation(uid, date, salesDates ?? []);
  const { products } = useProductsAndCategories(uid);
  const queryClient = useQueryClient();
  const salesQuantityMutation = useMutation({
    mutationFn: updateSalesQuantity,
    scope: {
      id: 'salesHistoryAndQuantity',
    },
  });

  const getNumbersAndQuantities = () => {
    return shoppingCart.reduce(
      (acc: { numbers: number[]; quantities: number[] }, product) => {
        acc.numbers.push(product?.number);
        acc.quantities.push(product?.quantity);
        return acc;
      },
      { numbers: [], quantities: [] },
    );
  };

  const handleSalesQuantity = () => {
    const { numbers, quantities } = getNumbersAndQuantities();
    const previousQuantity = numbers.map(
      (number) => products?.find((product) => product.number === number)?.salesQuantity as number,
    );
    const updatedQuantities = quantities.map((quantity, index) => quantity + previousQuantity[index]);
    salesQuantityMutation.mutate({
      uid,
      numbers: numbers.map((number) => number.toString()),
      quantities: updatedQuantities,
    });
    queryClient.setQueryData([QUERY_KEYS.products], (before: IProduct[]) => {
      const newData = [...before];
      const targetIndexes = numbers.map((number) => newData.findIndex((product) => product.number === number));
      targetIndexes.forEach((targetIndex, index) => {
        newData[targetIndex].salesQuantity = updatedQuantities[index];
      });
      return newData;
    });
  };

  const checkShoppingCartEmpty = () => {
    if (!shoppingCart.length) {
      alert('상품을 추가해야 합니다.');
      return true;
    }
    return false;
  };

  const changePaymentMethod = (method: PAYMENT_METHODS) => {
    if (checkShoppingCartEmpty()) return;
    setPaymentInfo((prevPayment) => {
      return { ...prevPayment, method };
    });
  };

  const updateSalesHistory = () => {
    const time = formatter.formatTime(new Date());
    setSalesHistorySelector((originalSalesHistory) => {
      return { ...originalSalesHistory, date, time };
    });
  };

  useEffect(() => {
    setSalesNumber(() => {
      return data?.length ? [...data].sort((a, b) => b.number - a.number)[0].number : 0;
    });
  }, [data, setSalesNumber]);

  const handleSalesHistory = useRecoilCallback(({ snapshot }) => async () => {
    if (paymentInfo.method === '') return alert('결제수단을 선택해주세요.');
    const updatedSalesHistory = await snapshot.getPromise(salesHistorySelector);
    if (paymentInfo.method === PAYMENT_METHODS.Split) handleSplitPayment(updatedSalesHistory);
    else handleNormalPayment(updatedSalesHistory);
    resetShoppingCart();
  });

  const handleNormalPayment = (updatedSalesHistory: ISalesHistory) => {
    const finalSalesHistory =
      paymentInfo.method === PAYMENT_METHODS.Other ? handleEtcMethod(updatedSalesHistory) : updatedSalesHistory;
    mutation.mutate(
      { uid, salesHistory: finalSalesHistory },
      {
        onSuccess: () => {
          queryClient.setQueryData([QUERY_KEYS.salesHistory, date], (before: ISalesHistory[]) => {
            return [...before, finalSalesHistory];
          });
          queryClient.setQueryData([QUERY_KEYS.salesHistory], (before: ISalesHistory[][]) => {
            if (before[0][0].date !== date) return [[finalSalesHistory], ...before];
            return [...before][0].unshift(finalSalesHistory);
          });
          handleSalesQuantity();
        },
      },
    );
  };

  const handleSplitPayment = (updatedSalesHistory: ISalesHistory) => {
    const note = `${updatedSalesHistory.note} ${updatedSalesHistory.number},${
      updatedSalesHistory.number + 1
    } 분할결제`.trim();
    const [firstPaymentInfo, secondPaymentInfo] = splitPayment.method.map((method, index) => {
      return {
        ...updatedSalesHistory,
        method,
        chargedAmount: splitPayment.price[index],
        note,
      } as ISalesHistory;
    });
    secondPaymentInfo.products = [];
    secondPaymentInfo.number = updatedSalesHistory.number + 1;
    mutation.mutate({ uid, salesHistory: firstPaymentInfo });
    mutation.mutate(
      { uid, salesHistory: secondPaymentInfo },
      {
        onSuccess: () => {
          queryClient.setQueryData([QUERY_KEYS.salesHistory, date], (before: ISalesHistory[]) => {
            return [...before, firstPaymentInfo, secondPaymentInfo];
          });
          queryClient.setQueryData([QUERY_KEYS.salesHistory], (before: ISalesHistory[][]) => {
            if (before[0][0].date !== date) return [[firstPaymentInfo, secondPaymentInfo], ...before];
            return [...before][0].unshift(firstPaymentInfo, secondPaymentInfo);
          });
          handleSalesQuantity();
        },
      },
    );
  };

  const onPaymentModalButtonClick = (path: string) => {
    if (checkShoppingCartEmpty()) return;
    navigate(path);
  };

  const selectEtcMethod = () => {
    if (checkShoppingCartEmpty()) return;
    const reason = prompt('기타 사유를 입력해주세요.');
    if (reason === null) return;
    setEtcReason(reason);
    setPaymentInfo((prev) => {
      return { ...prev, method: PAYMENT_METHODS.Other };
    });
  };

  const handleEtcMethod = (updatedPaymentInfo: ISalesHistory) => {
    return { ...updatedPaymentInfo, note: etcReason, chargedAmount: 0 };
  };

  const paymentMethodsFirstRow = [PAYMENT_METHODS.Card, PAYMENT_METHODS.Cash, PAYMENT_METHODS.Transfer];

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
          <PaymentMethodButton
            onClick={selectEtcMethod}
            className={paymentInfo.method === PAYMENT_METHODS.Other ? 'selected' : ''}
          >
            {PAYMENT_METHODS.Other}
          </PaymentMethodButton>
          <PaymentMethodButton
            className={paymentInfo.method === PAYMENT_METHODS.Split ? 'selected' : ''}
            onClick={() => onPaymentModalButtonClick('/split-payment')}
          >
            {PAYMENT_METHODS.Split}
          </PaymentMethodButton>
          <PaymentMethodButton
            className={paymentInfo.discountAmount > 0 ? 'selected' : ''}
            onClick={() => onPaymentModalButtonClick('/discount')}
          >
            {PAYMENT_METHODS.Discount}
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
              handleSalesHistory();
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
