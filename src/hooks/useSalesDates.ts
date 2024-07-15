import { useQuery } from '@tanstack/react-query';
import { getSalesDate } from '../utils/fetchFunctions';
import QUERY_KEYS from '../constants/queryKeys';

const useSalesDates = (uid: string) => {
  const { data: salesDates } = useQuery<string[]>({
    queryKey: [QUERY_KEYS.salesDates],
    queryFn: () => getSalesDate(uid),
  });
  return { salesDates };
};

export default useSalesDates;
