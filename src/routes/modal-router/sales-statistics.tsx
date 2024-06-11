import React from 'react';
import { Link } from 'react-router-dom';
import {
  MediumModalContainer,
  ModalHeader,
  PlusRowButtonContainer,
  SalesStatisticTable,
  TableContainer,
  TableHeader,
} from '../../components/formComponents/FormContainerComponents';
import { Background, CloseButton, MediumModalComponent } from '../../components/Modal';
import { SalesStatisticTableRow } from '../../components/formComponents/salesStatisticTableRow';
import { auth } from '../../firebase';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getMultipleSalesHistory } from '../../utils/fetchFunctions';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';
import { useEffect, useState } from 'react';
import useSalesDates from '../../hooks/useSalesDates';
import { SalesStatisticTableSkeleton } from '../../skeletons/salesStatisticTable';

export default function SalesStatistics() {
  const uid = auth.currentUser?.uid ?? '';
  const [descSortedDates, setSortedDates] = useState<string[]>([]);
  const { salesDates } = useSalesDates(uid);
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery<ISalesHistory[][], Error>({
    queryKey: ['salesHistory'],
    enabled: !!descSortedDates.length,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const datesPerPage = 50;
      const dateArray =
        descSortedDates &&
        [...descSortedDates].slice((Number(pageParam) - 1) * datesPerPage, datesPerPage * Number(pageParam));
      return getMultipleSalesHistory(uid, dateArray);
    },
    getNextPageParam: (lastPage, pages) => {
      const datesPerPage = 50;
      const hasMore = lastPage.length === datesPerPage && salesDates?.length !== pages.length * datesPerPage;
      return hasMore ? pages.length + 1 : undefined;
    },
  });

  useEffect(() => {
    const sortedDates = [...(salesDates ?? [])].sort((a, b) => {
      if (a < b) return 1;
      if (a > b) return -1;
      return 0;
    });
    setSortedDates(sortedDates);
  }, [salesDates]);

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
            <SalesStatisticTable>
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
                {isLoading ? <SalesStatisticTableSkeleton /> : null}
              </tbody>
            </SalesStatisticTable>
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
