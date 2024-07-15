import styled from 'styled-components';

export const BigModalContainer = styled.div`
  height: 85%;
  width: 85%;
`;

export const SmallModalContainer = styled.div`
  height: 75%;
  width: 70%;
`;

export const WideModalContainer = styled.div`
  height: 85%;
  width: 95%;
`;

export const MediumModalContainer = styled.div`
  height: 80%;
  width: 85%;
`;

export const TableContainer = styled.div`
  height: 85%;
  width: 100%;
  overflow: auto;
`;

export const SalesStatisticTableContainer = styled(TableContainer)`
  height: 100%;
`;

export const Table = styled.table`
  min-width: 100%;
  border-spacing: 0;
  border-collapse: collapse;
  input {
    height: 25px;
    border-radius: 5px;
    padding: 0 10px;
  }
  th,
  td {
    vertical-align: middle;
    padding: 10px 5px;
    border-top: solid;
    border-color: rgb(200, 200, 200);
    text-align: center;
    border-bottom: none;
  }
  th {
    height: 30px;
    border-style: none;
    box-sizing: border-box;
  }
`;

export const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  background-color: white;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  outline: 1px solid transparent;
  font-weight: 700;
`;

export const TableWithBorder = styled(Table)`
  tr {
    width: 100%;
  }
  th {
    min-width: 100px;
    background-color: rgb(240, 240, 240);
  }
  th,
  td {
    border: 0.5px solid rgb(200, 200, 200);
  }
`;

export const SalesStatisticTable = styled(TableWithBorder)`
  td {
    width: 20%;
  }
`;

export const SalesHistoryTable = styled(TableWithBorder)`
  th:nth-child(4) {
    min-width: 250px;
  }

  th:nth-child(1),
  th:nth-child(7),
  th:nth-child(8) {
    min-width: 50px;
  }
`;

export const PlusRowButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    border-style: none;
    font-size: 20px;
  }
`;

export const ErrorMessage = styled.div`
  margin-top: 5px;
  font-size: 11px;
  color: red;
  &.big {
    font-size: 18px;
  }
`;

export const ModalHeader = styled.div`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;
