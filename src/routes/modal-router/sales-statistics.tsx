import { Link } from 'react-router-dom';
import {
  MediumModalContainer,
  ModalHeader,
  PlusRowButtonContainer,
  TableContainer,
  TableHeader,
  TableWithBorder,
} from '../../components/formComponents/FormContainerComponents';
import { Background, CloseButton, MediumModalComponent } from '../../components/Modal';
import { SalesStatisticTableRow } from '../../components/formComponents/salesStatisticTableRow';
import { auth } from '../../firebase';
import { useQuery, useInfiniteQuery } from 'react-query';
import { getMultipleSalesHistory, getSalesDate } from '../../utils/fetchFunctions';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';
import { useState } from 'react';

export default function SalesStatistics() {
  const uid = auth.currentUser?.uid ?? '';
  const [descSortedDates, setSortedDates] = useState<string[]>([]);
  const { data: salesDates } = useQuery<string[]>('salesDates', () => getSalesDate(uid), {
    onSuccess: (data) => {
      const sortedDates = [...data].sort((a, b) => {
        if (a < b) return 1;
        if (a > b) return -1;
        return 0;
      });
      setSortedDates(sortedDates);
    },
  });
  const { data, fetchNextPage, hasNextPage } = useInfiniteQuery<ISalesHistory[][], Error>(
    'salesHistory',
    ({ pageParam = 1 }) => {
      const datesPerPage = 50;
      const dateArray =
        descSortedDates && [...descSortedDates].slice((pageParam - 1) * datesPerPage, datesPerPage * pageParam);
      return getMultipleSalesHistory(uid, dateArray);
    },
    {
      enabled: !!salesDates,
      getNextPageParam: (lastPage, pages) => {
        const datesPerPage = 50;
        const hasMore = lastPage.length === datesPerPage && salesDates?.length !== pages.length * datesPerPage;
        return hasMore ? pages.length + 1 : undefined;
      },
    },
  );
  return (
    <>
      <Background />
      <MediumModalComponent>
        <MediumModalContainer>
          <ModalHeader>
            <h2>판매통계</h2>
            <Link to="/">
              <CloseButton>X</CloseButton>
            </Link>
          </ModalHeader>
          <TableContainer>
            <TableWithBorder>
              <TableHeader>
                <tr>
                  <th>날짜</th>
                  <th>총 판매액</th>
                  <th>카드 판매액</th>
                  <th>현금 판매액</th>
                  <th>계좌이체 판매액</th>
                </tr>
              </TableHeader>
              <tbody>
                {data?.pages.flat().map((data: ISalesHistory[], index) => (
                  <SalesStatisticTableRow key={index} salesHistory={data} />
                ))}
              </tbody>
            </TableWithBorder>
            {hasNextPage ? (
              <PlusRowButtonContainer>
                <button type="button" onClick={() => fetchNextPage()}>
                  +
                </button>
              </PlusRowButtonContainer>
            ) : null}
          </TableContainer>
        </MediumModalContainer>
      </MediumModalComponent>
    </>
  );
}
