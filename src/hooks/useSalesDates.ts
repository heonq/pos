import { useQuery } from '@tanstack/react-query';
import { getSalesDate } from '../utils/fetchFunctions';

const useSalesDates = (uid: string) => {
  const { data: salesDates } = useQuery<string[]>({
    queryKey: ['salesDates'],
    queryFn: () => getSalesDate(uid),
  });
  return { salesDates };
};

export default useSalesDates;
