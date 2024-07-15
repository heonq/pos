import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSalesDate } from '../utils/fetchFunctions';
import QUERY_KEYS from '../constants/queryKeys';

const useSetSalesDatesMutation = () => {
  const queryClient = useQueryClient();
  const setSalesDatesMutation = useMutation({
    mutationFn: setSalesDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesDates] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.salesHistory] });
    },
  });
  return setSalesDatesMutation;
};

export default useSetSalesDatesMutation;
