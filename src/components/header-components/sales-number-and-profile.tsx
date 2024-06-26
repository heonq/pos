import { useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import {
  Button,
  ButtonsContainer,
  ExpandButtonContainer,
  HiddenButtonContainer,
  PaymentNumber,
  ProfileMenu,
} from './base-components';
import { useRecoilValue } from 'recoil';
import { salesNumberAtom } from '../../atoms';
import { ISalesNumberAndProfileProps } from '../../Interfaces/PropsInterfaces';
import { useQueryClient } from '@tanstack/react-query';

export default function SalesNumberAndProfile({ onProfileClick, profileMenuVisible }: ISalesNumberAndProfileProps) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const logOut = async () => {
    await auth.signOut();
    queryClient.clear();
    navigate('/login');
  };
  const salesNumber = useRecoilValue(salesNumberAtom);

  return (
    <ButtonsContainer>
      <PaymentNumber>
        판매번호
        <br />
        {salesNumber}
      </PaymentNumber>
      <ExpandButtonContainer>
        <ProfileMenu onClick={onProfileClick}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
            <path
              fillRule="evenodd"
              d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
              clipRule="evenodd"
            />
          </svg>
        </ProfileMenu>
        {profileMenuVisible ? (
          <HiddenButtonContainer>
            <Button onClick={logOut}>로그아웃</Button>
          </HiddenButtonContainer>
        ) : null}
      </ExpandButtonContainer>
    </ButtonsContainer>
  );
}
