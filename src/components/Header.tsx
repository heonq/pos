import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { viewModeAtom } from '../atoms';
import ViewModeManagementMenus from './header-components/product-management-menus';
import ModalButtons from './header-components/modal-buttons';
import SalesNumberAndProfile from './header-components/sales-number-and-profile';
import { HeaderComponent } from './header-components/base-components';

export default function Header() {
  const [showViewModeMenu, setShowViewModeMenu] = useState(false);
  const [showProductMenu, setShowProductMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [viewMode, setViewMode] = useRecoilState(viewModeAtom);

  const onViewModeMenuClick = () => {
    setShowViewModeMenu((current) => !current);
    setShowProductMenu(false);
    setShowProfileMenu(false);
  };
  const onProductMenuClick = () => {
    setShowProductMenu((current) => !current);
    setShowViewModeMenu(false);
    setShowProfileMenu(false);
  };

  const onViewModeSelect = (mode: 'category' | 'total') => {
    setViewMode(mode);
    setShowViewModeMenu(false);
    setShowProfileMenu(false);
  };

  const onProfileClick = () => {
    setShowProfileMenu((current) => !current);
    setShowProductMenu(false);
    setShowViewModeMenu(false);
  };

  const viewModeManagementMenuProps = {
    onViewModeMenuClick,
    onViewModeSelect,
    viewMode,
    showViewModeMenu,
  };

  const modalButtonsProps = {
    onProductMenuClick,
    showProductMenu,
  };

  const salesNumberAndProfileProps = {
    onProfileClick,
    showProfileMenu,
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
