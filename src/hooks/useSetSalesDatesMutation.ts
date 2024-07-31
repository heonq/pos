import { useMutation } from '@tanstack/react-query';
import { setSalesDate } from '../utils/fetchFunctions';

const useSetSalesDatesMutation = () => {
  const setSalesDatesMutation = useMutation({
    mutationFn: setSalesDate,
  });
  return setSalesDatesMutation;
};

export default useSetSalesDatesMutation;
