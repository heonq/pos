import {
  WideModalContainer,
  ModalHeader,
  TableContainer,
  TableHeader,
  WideTable,
} from '../../components/formComponents/FormContainerComponents';
import { ModalComponent, Background, CloseButton } from '../../components/Modal';
import { Link } from 'react-router-dom';
import { useQuery } from 'react-query';
import { IProduct, ISalesHistory } from '../../Interfaces/DataInterfaces';
import { fetchProducts, fetchSalesHistory, getSalesDate } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import MyDatePicker from '../../utils/datePicker';
import formatter from '../../utils/formatter';
import { SalesHistoryTableRow } from '../../components/formComponents/salesHistoryTableRow';
import { useRecoilValue } from 'recoil';
import { salesNumberAtom } from '../../atoms';

export default function SalesHistory() {
  const uid = auth.currentUser?.uid ?? '';
  const { data: products } = useQuery<IProduct[]>('products', () => fetchProducts(uid));
  const [criteriaDate, setCriteriaDate] = useState(formatter.formatDate(new Date()));
  const { data: salesDates } = useQuery<string[]>('salesDates', () => getSalesDate(uid));
  const { data: salesHistory, refetch: salesHistoryRefetch } = useQuery<ISalesHistory[]>(
    ['salesHistory', criteriaDate],
    () => fetchSalesHistory(uid, criteriaDate),
  );
  const salesNumber = useRecoilValue(salesNumberAtom);

  const [dates, setDates] = useState([new Date()]);
  useEffect(() => {
    setDates(salesDates?.map((date) => new Date(date)) ?? [new Date()]);
  }, [salesDates]);

  return (
    <>
      <Background />
      <ModalComponent className="wide" as="div">
        <WideModalContainer>
          <ModalHeader>
            <h2>판매내역</h2>
            <Link to="/">
              <CloseButton>X</CloseButton>
            </Link>
          </ModalHeader>
          <MyDatePicker setDate={setCriteriaDate} includedDatesArray={dates} />
          <TableContainer>
            <WideTable>
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
                      refetch={salesHistoryRefetch}
                    />
                  ))}
              </tbody>
            </WideTable>
          </TableContainer>
        </WideModalContainer>
      </ModalComponent>
    </>
  );
}
