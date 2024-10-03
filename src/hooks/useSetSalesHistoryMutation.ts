import { useMutation } from '@tanstack/react-query';
import { setSalesHistory } from '../utils/firebaseApi';
import useSetSalesDatesMutation from './useSetSalesDatesMutation';

const useSetSalesHistoryMutation = (uid: string, date: string, salesDates: string[]) => {
  const salesDatesMutation = useSetSalesDatesMutation();
  const setSalesHistoryMutation = useMutation({
    mutationFn: setSalesHistory,
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
