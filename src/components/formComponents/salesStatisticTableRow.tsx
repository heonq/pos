import React, { useEffect, useState } from 'react';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';
import { PAYMENT_METHODS } from '../../constants/enums';
import formatter from '../../utils/formatter';

export const SalesStatisticTableRow = ({ salesHistory }: { salesHistory: ISalesHistory[] }) => {
  const [totalAmount, setTotalAmount] = useState(0);
  const [cardAmount, setCardAmount] = useState(0);
  const [transferAmount, setTransferAmount] = useState(0);
  const [cashAmount, setCashAmount] = useState(0);

  const sumAmount = (salesHistory: ISalesHistory[], filterBy: PAYMENT_METHODS) => {
    const filteredSalesHistory = salesHistory.filter((salesData) => salesData.method === filterBy) ?? [];
    return filteredSalesHistory && filteredSalesHistory.reduce((acc, salesData) => acc + salesData.chargedAmount, 0);
  };

  useEffect(() => {
    setCardAmount(sumAmount(salesHistory ?? [], PAYMENT_METHODS.Card));
    setTransferAmount(sumAmount(salesHistory ?? [], PAYMENT_METHODS.Transfer));
    setCashAmount(sumAmount(salesHistory ?? [], PAYMENT_METHODS.Cash));
  }, [salesHistory]);

  useEffect(() => {
    setTotalAmount(cardAmount + transferAmount + cashAmount);
  }, [cardAmount, transferAmount, cashAmount]);

  return (
    <tr>
      <td>{salesHistory[0].date}</td>
      <td>{formatter.formatNumber(totalAmount)}</td>
      <td>{formatter.formatNumber(cardAmount)}</td>
      <td>{formatter.formatNumber(cashAmount)}</td>
      <td>{formatter.formatNumber(transferAmount)}</td>
    </tr>
  );
};
