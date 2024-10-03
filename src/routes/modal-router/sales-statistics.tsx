import React from 'react';
import { Link } from 'react-router-dom';
import {
  MediumModalContainer,
  ModalHeader,
  PlusRowButtonContainer,
  SalesStatisticTable,
  SalesStatisticTableContainer,
  TableHeader,
} from '../../components/formComponents/FormContainerComponents';
import { Background, CloseButton, MediumModalComponent } from '../../components/Modal';
import { SalesStatisticTableRow } from '../../components/formComponents/salesStatisticTableRow';
import { auth } from '../../firebase';
import { useInfiniteQuery } from '@tanstack/react-query';
import { getMultipleSalesHistory } from '../../utils/firebaseApi';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';
import { useEffect, useState } from 'react';
import useSalesDates from '../../hooks/useSalesDates';
import { SalesStatisticTableSkeleton } from '../../skeletons/salesStatisticTable';
import QUERY_KEYS from '../../constants/queryKeys';

export default function SalesStatistics() {
  const uid = auth.currentUser?.uid ?? '';
  const [descSortedDates, setSortedDates] = useState<string[]>([]);
  const { salesDates } = useSalesDates(uid);
  const DATES_PER_PAGE = 50;
  const [showSkeleton, setShowSkeleton] = useState(false);
  const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } = useInfiniteQuery<
    ISalesHistory[][],
    Error
  >({
    queryKey: [QUERY_KEYS.salesHistory],
    enabled: !!descSortedDates.length,
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      const dateArray =
        descSortedDates &&
        [...descSortedDates].slice((Number(pageParam) - 1) * DATES_PER_PAGE, DATES_PER_PAGE * Number(pageParam));
      return getMultipleSalesHistory(uid, dateArray);
    },
    getNextPageParam: (lastPage, pages, lastPageParam) => {
      const hasMore = lastPage.length === DATES_PER_PAGE && salesDates?.length !== pages.length * DATES_PER_PAGE;
      return hasMore ? Number(lastPageParam) + 1 : undefined;
    },
  });

  useEffect(() => {
    setShowSkeleton(false);
    const timer = setTimeout(() => {
      if (isLoading || isFetchingNextPage) setShowSkeleton(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [data, isLoading, isFetchingNextPage]);

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
          <SalesStatisticTableContainer>
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
                {data?.pages.flat().map((data: ISalesHistory[]) => (
                  <SalesStatisticTableRow key={data[0].date} salesHistory={data} />
                ))}
                {showSkeleton && (isLoading || isFetchingNextPage) ? <SalesStatisticTableSkeleton /> : null}
              </tbody>
            </SalesStatisticTable>
            {hasNextPage ? (
              <PlusRowButtonContainer>
                <button type="button" onClick={() => fetchNextPage()}>
                  +
                </button>
              </PlusRowButtonContainer>
            ) : null}
          </SalesStatisticTableContainer>
        </MediumModalContainer>
      </MediumModalComponent>
    </>
  );
}
