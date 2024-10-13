import { useMutation } from '@tanstack/react-query';
import { historyApi } from '../apis/history';
import useSetSalesDatesMutation from './useSetSalesDatesMutation';

const useSetSalesHistoryMutation = (uid: string, date: string, salesDates: string[]) => {
  const salesDatesMutation = useSetSalesDatesMutation();
  const setSalesHistoryMutation = useMutation({
    mutationFn: historyApi.setSalesHistory,
    onSuccess: () => {
      !salesDates?.includes(date) && salesDatesMutation.mutate(uid);
    },
    scope: {
      id: 'salesHistoryAndQuantity',
    },
  });
  return setSalesHistoryMutation;
};

export default useSetSalesHistoryMutation;
