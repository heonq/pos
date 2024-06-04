import styled from 'styled-components';
import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import formatter from './formatter';

const DatePickerContainer = styled.div`
  display: flex;
  justify-content: end;
  margin: 15px 0;
  input {
    border-radius: 6px;
    height: 25px;
    width: 75px;
  }
`;

const MyDatePicker = ({ includedDatesArray, setDate }: { includedDatesArray: Date[]; setDate(date: string): void }) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());

  const handleChange = (date: Date) => {
    setSelectedDate(date);
    setDate(formatter.formatDate(date));
  };

  return (
    <DatePickerContainer>
      <DatePicker selected={selectedDate} onChange={handleChange} includeDates={includedDatesArray} />
    </DatePickerContainer>
  );
};

export default MyDatePicker;
