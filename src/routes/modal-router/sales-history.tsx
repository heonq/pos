import {
  WideModalContainer,
  ModalHeader,
  TableContainer,
  TableHeader,
  SalesHistoryTable,
} from '../../components/formComponents/FormContainerComponents';
import { Background, CloseButton, WideModalComponent } from '../../components/Modal';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ISalesHistory } from '../../Interfaces/DataInterfaces';
import { getSalesHistory } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import MyDatePicker from '../../utils/datePicker';
import formatter from '../../utils/formatter';
import { SalesHistoryTableRow } from '../../components/formComponents/salesHistoryTableRow';
import { useRecoilValue } from 'recoil';
import { salesNumberAtom } from '../../atoms';
import useProductsAndCategories from '../../hooks/useProductsAndCategories';
import useSalesDates from '../../hooks/useSalesDates';

export default function SalesHistory() {
  const uid = auth.currentUser?.uid ?? '';
  const { products } = useProductsAndCategories(uid);
  const [criteriaDate, setCriteriaDate] = useState(formatter.formatDate(new Date()));
  const { salesDates } = useSalesDates(uid);
  const { data: salesHistory } = useQuery<ISalesHistory[]>({
    queryKey: ['salesHistory', criteriaDate],
    queryFn: () => getSalesHistory(uid, criteriaDate),
  });
  const salesNumber = useRecoilValue(salesNumberAtom);

  const [dates, setDates] = useState([new Date()]);
  useEffect(() => {
    setDates(salesDates?.map((date) => new Date(date)) ?? [new Date()]);
  }, [salesDates]);

  return (
    <>
      <Background />
      <WideModalComponent as="div">
        <WideModalContainer>
          <ModalHeader>
            <h2>판매내역</h2>
            <Link to="/">
              <CloseButton>X</CloseButton>
            </Link>
          </ModalHeader>
          <MyDatePicker setDate={setCriteriaDate} includedDatesArray={dates} />
          <TableContainer>
            <SalesHistoryTable>
              <TableHeader>
                <tr>
                  <th>번호</th>
                  <th>판매금액</th>
                  <th>결제수단</th>
                  <th>비고</th>
                  <th>날짜</th>
                  <th>시간</th>
                  <th>환불</th>
                  <th>수정</th>
                  {products?.map((product, index) => (
                    <th key={index}>{product.name}</th>
                  ))}
                </tr>
              </TableHeader>
              <tbody>
                {products &&
                  salesHistory?.map((history, index) => (
                    <SalesHistoryTableRow
                      key={index}
                      index={index}
                      products={products}
                      salesHistory={history}
                      salesNumber={salesNumber}
                      salesDates={salesDates ?? []}
                    />
                  ))}
              </tbody>
            </SalesHistoryTable>
          </TableContainer>
        </WideModalContainer>
      </WideModalComponent>
    </>
  );
}
