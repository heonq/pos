import { useMutation, useQueryClient } from '@tanstack/react-query';
import { setSalesDate } from '../utils/fetchFunctions';

const useSetSalesDatesMutation = () => {
  const queryClient = useQueryClient();
  const setSalesDatesMutation = useMutation({
    mutationFn: setSalesDate,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['salesDates'] });
    },
  });
  return setSalesDatesMutation;
};

export default useSetSalesDatesMutation;
