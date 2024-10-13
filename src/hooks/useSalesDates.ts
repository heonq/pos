import { useQuery } from '@tanstack/react-query';
import { historyApi } from '../apis/history';
import QUERY_KEYS from '../constants/queryKeys';

const useSalesDates = (uid: string) => {
  const { data: salesDates } = useQuery<string[]>({
    queryKey: [QUERY_KEYS.salesDates],
    queryFn: () => historyApi.getSalesDate(uid),
  });
  return { salesDates };
};

export default useSalesDates;
