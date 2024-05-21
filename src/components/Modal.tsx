import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { IButtonsProps } from '../Interfaces/PropsInterfaces';

export const ModalComponent = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: 1000;
  background-color: white;
  justify-content: start;
  box-shadow: 15px 15px 15px rgba(69, 69, 69, 0.5);
  border-radius: 10px;
  &.small {
    width: 500px;
    height: 500px;
    top: 200px;
  }
  &.big {
    width: 1000px;
    height: 820px;
    top: 38px;
  }
  &.wide {
    width: 1300px;
    height: 820px;
    top: 38px;
  }
`;

export const Background = styled.div`
  position: absolute;
  background-color: hsl(0, 0%, 0%);
  z-index: 999;
  margin: 0;
  width: 100vw;
  height: 100vh;
  opacity: 0.5;
`;

export const CloseButton = styled.button`
  height: 30px;
  width: 30px;
  background-color: transparent;
  font-size: 20px;
  border: none;
`;

export const SubmitButtonsContainer = styled.div`
  position: absolute;
  bottom: 30px;
  width: 280px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    font-size: 18px;
    width: 130px;
    height: 50px;
    border-width: 0px;
    cursor: pointer;
    border-radius: 5px;
  }
`;

export const SubmitButton = styled.button`
  background-color: blue;
  color: white;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

export function SubmitButtons({ disable }: IButtonsProps) {
  return (
    <SubmitButtonsContainer>
      <SubmitButton disabled={disable}>확인</SubmitButton>
      <Link to="/">
        <button>취소</button>
      </Link>
    </SubmitButtonsContainer>
  );
}
