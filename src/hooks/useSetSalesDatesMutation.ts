import { useMutation } from '@tanstack/react-query';
import { historyApi } from '../apis/history';

const useSetSalesDatesMutation = () => {
  const setSalesDatesMutation = useMutation({
    mutationFn: historyApi.setSalesDate,
  });
  return setSalesDatesMutation;
};

export default useSetSalesDatesMutation;
