import React, { useEffect, useState } from 'react';
import { ModalComponent, Background, SubmitButtons } from '../../components/Modal';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { paymentInfoAtom, paymentInfoSelector, splitPaymentAtom } from '../../atoms';
import styled from 'styled-components';
import formatter from '../../utils/formatter';
import { useNavigate } from 'react-router-dom';
import { paymentMethodsEnum } from '../../Interfaces/enums';
import validator from '../../utils/validator';

const SplitPaymentContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 500px;
  width: 280px;
  font-size: 18px;
  line-height: 25px;
  margin-top: 50px;
  div {
    margin-top: 15px;
  }
  input {
    height: 40px;
    border-style: none;
    background-color: rgb(246, 246, 246);
    font-size: 16px;
    text-align: right;
    margin-right: 5px;
  }
  select {
    height: 40px;
    border-style: none;
    background-color: rgb(246, 246, 246);
    font-size: 16px;
    text-align: right;
  }
`;

export default function SplitPaymentModal() {
  const setPaymentInfo = useSetRecoilState(paymentInfoAtom);
  const navigate = useNavigate();
  const { chargedAmount } = useRecoilValue(paymentInfoSelector);
  const [splitPayment, setSplitPayment] = useRecoilState(splitPaymentAtom);
  const [disable, setDisable] = useState(true);

  useEffect(() => {
    if (chargedAmount === 0) navigate('/');
  }, [chargedAmount]);

  useEffect(() => {
    setDisable(!validator.validateSplitPayment(splitPayment, chargedAmount));
  }, [splitPayment]);

  const onPriceChange = (e: React.FormEvent<HTMLInputElement>, index: number) => {
    const newPrice = +e.currentTarget.value;
    setSplitPayment((previous) => {
      const newPriceArray: [number, number] = [...previous.price];
      newPriceArray[index] = newPrice;
      newPriceArray[1 - index] = chargedAmount - newPrice;
      return { ...previous, price: newPriceArray };
    });
  };

  const onMethodChange = (e: React.FormEvent<HTMLSelectElement>, index: number) => {
    const newMethod = e.currentTarget.value;
    setSplitPayment((previous) => {
      const newMethodArray: [string, string] = [...previous.method];
      newMethodArray[index] = newMethod;
      return { ...previous, method: newMethodArray };
    });
  };

  const onSubmitClick = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (disable) return;
    setPaymentInfo((prev) => {
      return {
        ...prev,
        method: paymentMethodsEnum.Split,
      };
    });
    navigate('/');
  };

  const paymentMethodArray = [paymentMethodsEnum.Card, paymentMethodsEnum.Cash, paymentMethodsEnum.Transfer];

  return (
    <>
      <Background />
      <ModalComponent className="small" onSubmit={onSubmitClick}>
        <SplitPaymentContainer>
          <div>총 결제금액 : {formatter.formatNumber(chargedAmount)}원</div>
          {[0, 0].map((_, index) => {
            return (
              <div key={index}>
                <input onChange={(e) => onPriceChange(e, index)} value={splitPayment.price[index]}></input>
                <select onChange={(e) => onMethodChange(e, index)} value={splitPayment.method[index]}>
                  <option hidden={true} value=""></option>
                  {paymentMethodArray.map((method) => (
                    <option key={method} value={method}>
                      {method}
                    </option>
                  ))}
                </select>
              </div>
            );
          })}
          <SubmitButtons {...{ disable }} />
        </SplitPaymentContainer>
      </ModalComponent>
    </>
  );
}
