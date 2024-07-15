/* eslint-disable no-restricted-globals */
import styled from 'styled-components';
import {
  ModalHeader,
  TableContainer,
  TableHeader,
  WideModalContainer,
  TableWithBorder,
} from '../../components/formComponents/FormContainerComponents';
import {
  Background,
  SubmitButtonsContainer,
  SubmitButton,
  CancelButton,
  WideModalComponent,
} from '../../components/Modal';
import formatter from '../../utils/formatter';
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { ICashCheckForm, ISalesHistory } from '../../Interfaces/DataInterfaces';
import { auth } from '../../firebase';
import {
  getSalesHistory,
  getCashCheckDate,
  getCashCheckHistory,
  setCashCheckDate,
  setCashCheckHistory,
} from '../../utils/fetchFunctions';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { PAYMENT_METHODS } from '../../constants/enums';
import { useNavigate } from 'react-router-dom';
import MyDatePicker from '../../utils/datePicker';
import { useRecoilValue } from 'recoil';
import { dateState } from '../../atoms';
import { CONFIRM_MESSAGES, ERROR_MESSAGES } from '../../constants/messages';
import QUERY_KEYS from '../../constants/queryKeys';

const CashCheckRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  width: 100%;
  margin-top: 10px;
  span {
    text-align: center;
    width: 100px;
    margin: 0 10px;
  }
  input {
    width: 80px;
    border-radius: 5px;
    text-align: center;
  }
`;

const CashCheckTableContainer = styled(TableContainer)`
  height: 65%;
`;

export default function CashCheck() {
  const methods = useForm<ICashCheckForm>({
    defaultValues: {
      reserveCash: 0,
      '1000': 0,
      '5000': 0,
      '10000': 0,
      '50000': 0,
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });
  const uid = auth.currentUser?.uid ?? '';
  const date = useRecoilValue(dateState);
  const [criteriaDate, setCriteriaDate] = useState(date);
  const { data: salesHistory } = useQuery<ISalesHistory[]>({
    queryKey: [QUERY_KEYS.salesHistory, date],
    queryFn: () => getSalesHistory(uid, date),
  });
  const { data: todayCashCheckHistory } = useQuery<ICashCheckForm[]>({
    queryKey: [QUERY_KEYS.cashCheck, date],
    queryFn: () => getCashCheckHistory(uid, date),
  });
  const { data: cashCheckHistory } = useQuery<ICashCheckForm[]>({
    queryKey: [QUERY_KEYS.cashCheck, criteriaDate],
    queryFn: () => getCashCheckHistory(uid, criteriaDate),
  });
  const { data: cashCheckDates } = useQuery<string[]>({
    queryKey: [QUERY_KEYS.cashCheckDates],
    queryFn: () => getCashCheckDate(uid),
  });
  const queryClient = useQueryClient();
  const [cashSalesAmount, setCashSalesAmount] = useState(0);
  const [expectedAmount, setExpectedAmount] = useState(0);
  const [countedAmount, setCountedAmount] = useState(0);
  const [correct, setCorrect] = useState(false);
  const { control, watch, handleSubmit } = methods;
  const values = watch(['1000', '5000', '10000', '50000', 'reserveCash']);
  const [thousand, fiveThousand, tenThousand, fiftyThousand, reserveCash] = values;
  const [newCashCheckNumber, setNewCashCheckNumber] = useState(1);
  const navigate = useNavigate();

  const cashCheckMutation = useMutation({
    mutationFn: setCashCheckHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cashCheck, date] });
      !cashCheckDates?.includes(date) && cashCheckDateMutation.mutate(uid);
      navigate('/');
    },
  });
  const cashCheckDateMutation = useMutation({
    mutationFn: setCashCheckDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cashCheckDates] });
    },
  });

  useEffect(() => {
    const newestNumber =
      (todayCashCheckHistory &&
        todayCashCheckHistory?.length > 0 &&
        todayCashCheckHistory[todayCashCheckHistory.length - 1]?.number + 1) ||
      1;
    setNewCashCheckNumber(newestNumber);
    todayCashCheckHistory &&
      todayCashCheckHistory?.length > 0 &&
      methods.reset({
        ...methods,
        reserveCash: todayCashCheckHistory[todayCashCheckHistory.length - 1]?.reserveCash ?? 0,
      });
  }, [todayCashCheckHistory]);

  useEffect(() => {
    const cashSalesHistory = salesHistory?.filter((sales) => sales.method === PAYMENT_METHODS.Cash);
    const newCashSalesAmount = cashSalesHistory?.reduce((acc, sales) => acc + sales.chargedAmount, 0) ?? 0;
    setCashSalesAmount(newCashSalesAmount);
  }, [salesHistory]);

  useEffect(() => {
    const newCountedAmount = thousand * 1000 + fiveThousand * 5000 + tenThousand * 10000 + fiftyThousand * 50000;
    setCountedAmount(newCountedAmount);
    setCorrect(newCountedAmount === expectedAmount);
  }, [values, expectedAmount]);

  useEffect(() => {
    const newExpectedAmount = cashSalesAmount + +reserveCash;
    setExpectedAmount(newExpectedAmount);
  }, [cashSalesAmount, reserveCash]);

  const submitCashCheck = (data: ICashCheckForm) => {
    if (confirm(CONFIRM_MESSAGES.saveCashCheck)) {
      const cashCheck = {
        time: formatter.formatTime(new Date()),
        date: formatter.formatDate(new Date()),
        '1000': +data['1000'],
        '5000': +data['5000'],
        '10000': +data['10000'],
        '50000': +data['50000'],
        reserveCash: +data.reserveCash,
        number: newCashCheckNumber,
        cashSalesAmount,
        expectedAmount,
        countedAmount,
        correct,
      };
      try {
        if (!(thousand || fiveThousand || tenThousand || fiftyThousand)) return alert(ERROR_MESSAGES.cashCheckInput);
        cashCheckMutation.mutate({ uid, date, cashCheck });
      } catch (e) {}
    } else navigate('/');
  };

  return (
    <>
      <Background />
      <WideModalComponent onSubmit={handleSubmit(submitCashCheck)}>
        <WideModalContainer>
          <ModalHeader>
            <h2>현금점검 입력</h2>
          </ModalHeader>
          <CashCheckRow>
            <span>준비금</span>
            <span>현금 판매 금액</span>
            <span>예상 현금</span>
            <span>실제 현금</span>
            <span>일치 여부</span>
            <span>1,000</span>
            <span>5,000</span>
            <span>10,000</span>
            <span>50,000</span>
          </CashCheckRow>
          <CashCheckRow>
            <span>
              <Controller
                name="reserveCash"
                control={control}
                render={({ field: { onChange, value } }) => <input onChange={onChange} value={value} />}
              />
            </span>
            <span>{formatter.formatNumber(cashSalesAmount)}</span>
            <span>{formatter.formatNumber(expectedAmount)}</span>
            <span>{formatter.formatNumber(countedAmount)}</span>
            <span>{correct ? 'O' : 'X'}</span>
            <span>
              <Controller
                name="1000"
                control={control}
                render={({ field: { onChange, value } }) => <input onChange={onChange} value={value} />}
              />
            </span>
            <span>
              <Controller
                name="5000"
                control={control}
                render={({ field: { onChange, value } }) => <input onChange={onChange} value={value} />}
              />
            </span>
            <span>
              <Controller
                name="10000"
                control={control}
                render={({ field: { onChange, value } }) => <input onChange={onChange} value={value} />}
              />
            </span>
            <span>
              <Controller
                name="50000"
                control={control}
                render={({ field: { onChange, value } }) => <input onChange={onChange} value={value} />}
              />
            </span>
          </CashCheckRow>
          <ModalHeader>
            <h2>현금점검 내역</h2>
          </ModalHeader>
          <MyDatePicker
            includedDatesArray={cashCheckDates?.map((date) => new Date(date)) ?? []}
            setDate={setCriteriaDate}
          />
          <CashCheckTableContainer>
            <TableWithBorder>
              <TableHeader>
                <tr>
                  <th>시간</th>
                  <th>준비금</th>
                  <th>현금 판매 금액</th>
                  <th>예상 현금</th>
                  <th>실제 현금</th>
                  <th>일치 여부</th>
                  <th>1,000</th>
                  <th>5,000</th>
                  <th>10,000</th>
                  <th>50,000</th>
                </tr>
              </TableHeader>
              <tbody>
                {cashCheckHistory?.map((cashCheck, index) => {
                  return (
                    <tr key={index}>
                      <td>{cashCheck.time}</td>
                      <td>{formatter.formatNumber(cashCheck.reserveCash)}</td>
                      <td>{formatter.formatNumber(cashCheck.cashSalesAmount)}</td>
                      <td>{formatter.formatNumber(cashCheck.expectedAmount)}</td>
                      <td>{formatter.formatNumber(cashCheck.countedAmount)}</td>
                      <td>{cashCheck.correct ? 'O' : 'X'}</td>
                      <td>{cashCheck['1000']}</td>
                      <td>{cashCheck['5000']}</td>
                      <td>{cashCheck['10000']}</td>
                      <td>{cashCheck['50000']}</td>
                    </tr>
                  );
                })}
              </tbody>
            </TableWithBorder>
          </CashCheckTableContainer>
        </WideModalContainer>
        <SubmitButtonsContainer>
          <SubmitButton>확인</SubmitButton>
          <CancelButton></CancelButton>
        </SubmitButtonsContainer>
      </WideModalComponent>
    </>
  );
}
