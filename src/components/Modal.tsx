import styled from "styled-components";

export const ModalComponent = styled.div`
  width: 1000px;
  height: 820px;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  z-index: 1000;
  background-color: white;
  justify-content: start;
  box-shadow: 15px 15px 15px rgba(69, 69, 69, 0.5);
  border-radius: 10px;
  top: 50px;
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
