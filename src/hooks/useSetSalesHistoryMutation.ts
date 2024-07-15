import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSalesHistory } from '../utils/fetchFunctions';
import useSetSalesDatesMutation from './useSetSalesDatesMutation';
import QUERY_KEYS from '../constants/queryKeys';

const useSetSalesHistoryMutation = (uid: string, date: string, salesDates: string[]) => {
  const queryClient = useQueryClient();
  const salesDatesMutation = useSetSalesDatesMutation();
  const setSalesHistoryMutation = useMutation({
    mutationFn: setSalesHistory,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesHistory, date] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesHistory] });
      !salesDates?.includes(date) && salesDatesMutation.mutate(uid);
    },
    scope: {
      id: 'salesHistoryAndQuantity',
    },
  });
  return setSalesHistoryMutation;
};

export default useSetSalesHistoryMutation;
