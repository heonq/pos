import styled from 'styled-components';

export const BigModalContainer = styled.div`
  height: 85%;
  width: 85%;
`;

export const TableContainer = styled.div`
  height: 85%;
  width: 100%;
  overflow: auto;
`;

export const Table = styled.table`
  min-width: 850px;
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
`;

export const TableHeader = styled.thead`
  position: sticky;
  top: 0;
  background-color: white;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  outline: 1px solid transparent;
  font-weight: 700;
  th {
    height: 30px;
    border-style: none;
    box-sizing: border-box;
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
