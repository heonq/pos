import React from 'react';
import { useRecoilState } from 'recoil';
import {
  productMenuDisplaySelector,
  profileMenuDisplaySelector,
  viewModeAtom,
  viewModeMenuDisplaySelector,
} from '../atoms';
import ViewModeManagementMenus from './header-components/product-management-menus';
import ModalButtons from './header-components/modal-buttons';
import SalesNumberAndProfile from './header-components/sales-number-and-profile';
import { HeaderComponent } from './header-components/base-components';

export default function Header() {
  const [viewMode, setViewMode] = useRecoilState(viewModeAtom);
  const [viewModeMenuVisible, setViewModeMenuVisible] = useRecoilState(viewModeMenuDisplaySelector);
  const [productMenuVisible, setProductMenuVisible] = useRecoilState(productMenuDisplaySelector);
  const [profileMenuVisible, setProfileMenuVisible] = useRecoilState(profileMenuDisplaySelector);

  const onViewModeMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewModeMenuVisible((value) => !value);
  };
  const onProductMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProductMenuVisible((value) => !value);
  };

  const onViewModeSelect = (mode: 'category' | 'total') => {
    setViewMode(mode);
  };

  const onProfileClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setProfileMenuVisible((value) => !value);
  };

  const viewModeManagementMenuProps = {
    onViewModeMenuClick,
    onViewModeSelect,
    viewMode,
    viewModeMenuVisible,
  };

  const modalButtonsProps = {
    onProductMenuClick,
    productMenuVisible,
  };

  const salesNumberAndProfileProps = {
    onProfileClick,
    profileMenuVisible,
  };

  return (
    <>
      <HeaderComponent>
        <ViewModeManagementMenus {...viewModeManagementMenuProps} />
        <ModalButtons {...modalButtonsProps} />
        <SalesNumberAndProfile {...salesNumberAndProfileProps} />
      </HeaderComponent>
    </>
  );
}
