/* eslint-disable no-restricted-globals */
import { useSetRecoilState } from 'recoil';
import { auth } from '../../firebase';
import { ISalesHistoryRowProps } from '../../Interfaces/PropsInterfaces';
import { setSalesHistory, updateSalesHistory } from '../../utils/fetchFunctions';
import formatter from '../../utils/formatter';
import { salesNumberAtom } from '../../atoms';
import React, { useState } from 'react';
import { CONFIRM_MESSAGES, ERROR_MESSAGES } from '../../constants/enums';
import { useMutation, useQueryClient } from 'react-query';

export const SalesHistoryTableRow = ({ index, products, salesHistory, salesNumber }: ISalesHistoryRowProps) => {
  const uid = auth.currentUser?.uid ?? '';
  const date = formatter.formatDate(new Date());
  const setSalesNumber = useSetRecoilState(salesNumberAtom);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(salesHistory.note);
  const queryClient = useQueryClient();
  const mutationTodayHistory = useMutation(setSalesHistory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['salesHistory', date]);
    },
  });
  const mutationRowHistory = useMutation(updateSalesHistory, {
    onSuccess: () => {
      queryClient.invalidateQueries(['salesHistory', salesHistory.date]);
    },
  });

  const refund = () => {
    if (salesHistory.refund) return alert(ERROR_MESSAGES.refundExist);
    if (!confirm(CONFIRM_MESSAGES.refundSalesHistory)) return;
    const updateData = {
      ...salesHistory,
      number: salesNumber + 1,
      date: formatter.formatDate(new Date()),
      time: formatter.formatTime(new Date()),
      note: `${salesHistory.date} ${salesHistory.number}번 환불`,
      chargedAmount: -salesHistory.chargedAmount,
      totalAmount: -salesHistory.totalAmount,
      refund: true,
      products: salesHistory.products.map((product) => {
        return { ...product, quantity: -product.quantity };
      }),
    };
    try {
      mutationRowHistory.mutate({
        uid,
        date: salesHistory.date,
        number: salesHistory.number.toString(),
        updateData: { refund: true },
      });
      mutationTodayHistory.mutate({ uid, date, salesHistory: updateData });
      setSalesNumber((value) => value + 1);
    } catch (e) {
      if (e instanceof Error) alert(e.message);
    }
  };

  const handleEditing = () => {
    setEditing((prev) => !prev);
    editing && updateNote();
  };

  const updateNote = () => {
    if (note === salesHistory.note) return;
    const newNote = { note };
    try {
      mutationRowHistory.mutate({
        uid,
        date: salesHistory.date,
        number: salesHistory.number.toString(),
        updateData: newNote,
      });
    } catch (e) {
      if (e instanceof Error) alert(e.message);
    }
  };

  return (
    <tr key={index}>
      <td>{salesHistory.number}</td>
      <td>{formatter.formatNumber(salesHistory.chargedAmount)}</td>
      <td>{salesHistory.method}</td>
      <td>{editing ? <input value={note} onChange={(e) => setNote(e.target.value)}></input> : note}</td>
      <td>{salesHistory.date}</td>
      <td>{salesHistory.time}</td>
      <td>
        <button onClick={refund}>환불</button>
      </td>
      <td>
        <button onClick={handleEditing}>{editing ? '확인' : '수정'}</button>
      </td>
      {products.map((product) => {
        const quantity =
          salesHistory?.products?.find((productSold) => productSold.number === product.number)?.quantity ?? 0;
        return <td key={product.number}>{quantity}</td>;
      })}
    </tr>
  );
};
