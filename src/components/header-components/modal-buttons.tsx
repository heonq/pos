import { Link } from 'react-router-dom';
import { Button, ButtonsContainer, ExpandButtonContainer, HiddenButtonContainer } from './base-components';
import { IModalMenuButtonsProps } from '../../Interfaces/PropsInterfaces';

export default function ModalButtons({ onProductMenuClick, productMenuVisible }: IModalMenuButtonsProps) {
  return (
    <>
      <ButtonsContainer>
        <ExpandButtonContainer>
          <Button onClick={onProductMenuClick}>상품관리 메뉴</Button>
          {productMenuVisible ? (
            <HiddenButtonContainer>
              <Link to="/product-registration">
                <Button>상품 등록</Button>
              </Link>
              <Link to="/product-management">
                <Button>상품 관리</Button>
              </Link>
              <Link to="/category-registration">
                <Button>카테고리 등록</Button>
              </Link>
              <Link to="/category-management">
                <Button>카테고리 관리</Button>
              </Link>
            </HiddenButtonContainer>
          ) : null}
        </ExpandButtonContainer>
        <Link to="sales-history">
          <Button>판매내역</Button>
        </Link>
        <Link to="cash-check">
          <Button>현금점검</Button>
        </Link>
        <Link to="sales-statistics">
          <Button>판매통계</Button>
        </Link>
      </ButtonsContainer>
    </>
  );
}
