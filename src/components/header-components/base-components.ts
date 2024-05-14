import styled from 'styled-components';

export const HeaderComponent = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
`;

export const ExpandButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;

export const HiddenButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  z-index: 500;
  top: 100%;
  position: absolute;
  box-shadow: ${(props) => props.theme.boxShadow};
  background-color: ${(props) => props.theme.elementBgColor};
  border-radius: ${(props) => props.theme.borderRadius};
  right: 0;
  button {
    box-shadow: none;
    margin: 0;
  }
`;

export const Button = styled.button`
  width: 150px;
  line-height: 40px;
  border-radius: 6px;
  border-style: none;
  background-color: ${(props) => props.theme.elementBgColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  padding: 0;
  cursor: pointer;
`;

export const PaymentNumber = styled.div`
  width: 100px;
  height: 40px;
  line-height: 20px;
  font-size: 13px;
  border-style: none;
  box-shadow: ${(props) => props.theme.boxShadow};
  background-color: ${(props) => props.theme.elementBgColor};
  border-radius: ${(props) => props.theme.borderRadius};
  text-align: center;
`;

export const ProfileMenu = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: ${(props) => props.theme.elementBgColor};
  box-shadow: ${(props) => props.theme.boxShadow};
  cursor: pointer;
  svg {
    width: 30px;
    height: 30px;
  }
`;
