/* eslint-disable no-restricted-globals */
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { auth } from '../../firebase';
import { ISalesHistoryRowProps } from '../../Interfaces/PropsInterfaces';
import { updateSalesHistory } from '../../utils/fetchFunctions';
import formatter from '../../utils/formatter';
import { dateState, salesNumberAtom } from '../../atoms';
import React, { useState } from 'react';
import { CONFIRM_MESSAGES, ERROR_MESSAGES } from '../../constants/enums';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import useSetSalesHistoryMutation from '../../hooks/useSetSalesHistoryMutation';
import QUERY_KEYS from '../../constants/queryKeys';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';

export const SalesHistoryTableRow = ({
  index,
  products,
  salesHistories,
  salesNumber,
  salesDates,
}: ISalesHistoryRowProps) => {
  const uid = auth.currentUser?.uid ?? '';
  const salesHistory = salesHistories[index];
  const date = useRecoilValue(dateState);
  const setSalesNumber = useSetRecoilState(salesNumberAtom);
  const [editing, setEditing] = useState(false);
  const [note, setNote] = useState(salesHistory.note);
  const queryClient = useQueryClient();
  const mutationTodayHistory = useSetSalesHistoryMutation(uid, date, salesDates ?? []);
  const mutationRowHistory = useMutation({
    mutationFn: updateSalesHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesHistory, salesHistory.date] });
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
    const newSalesHistories = salesHistories.map((salesHistory, idx) => {
      if (idx === index) {
        return {
          ...salesHistory,
          refund: true,
          note: `${salesHistory.note} ${updateData.date} ${updateData.time} 환불`.trim(),
        };
      }
      return salesHistory;
    }) as ISalesHistory[];
    mutationRowHistory.mutate(
      {
        uid,
        updateData: newSalesHistories,
      },
      {
        onSuccess: () => {
          mutationTodayHistory.mutate({ uid, salesHistory: updateData });
          setSalesNumber((value) => value + 1);
          queryClient.setQueryData([QUERY_KEYS.salesHistory, newSalesHistories[0].date], newSalesHistories);
          queryClient.setQueryData([QUERY_KEYS.salesHistory, date], (before: ISalesHistory[]) => {
            return [...before, updateData];
          });
        },
        onError: (e) => alert(e.message),
      },
    );
  };

  const handleEditing = () => {
    setEditing((prev) => !prev);
    editing && updateNote();
  };

  const updateNote = () => {
    if (note === salesHistory.note) return;
    const newSalesHistories = [...salesHistories];
    newSalesHistories[index].note = note;
    mutationRowHistory.mutate(
      {
        uid,
        updateData: newSalesHistories,
      },
      {
        onSuccess: () => {
          queryClient.setQueryData([QUERY_KEYS.salesHistory], newSalesHistories);
        },
      },
    );
  };

  return (
    <tr key={index}>
      <td>{salesHistory.number}</td>
      <td>{formatter.formatNumber(salesHistory.chargedAmount)}</td>
      <td>{salesHistory.method}</td>
      <td>{editing ? <input value={note} onChange={(e) => setNote(e.target.value)}></input> : salesHistory.note}</td>
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
