import { ExpandButtonContainer, Button, HiddenButtonContainer } from './base-components';

interface ViewModeManagementMenusProp {
  onViewModeMenuClick(): void;
  onViewModeSelect(mode: 'category' | 'total'): void;
  viewMode: string;
  showViewModeMenu: boolean;
}

export default function ViewModeManagementMenus({
  onViewModeMenuClick,
  onViewModeSelect,
  viewMode,
  showViewModeMenu,
}: ViewModeManagementMenusProp) {
  return (
    <>
      <ExpandButtonContainer>
        <Button onClick={onViewModeMenuClick}>{viewMode === 'category' ? '카테고리 보기' : '전체보기'}</Button>
        {showViewModeMenu ? (
          <HiddenButtonContainer>
            <Button onClick={() => onViewModeSelect('category')}>카테고리 보기</Button>
            <Button onClick={() => onViewModeSelect('total')}>전체보기</Button>
          </HiddenButtonContainer>
        ) : null}
      </ExpandButtonContainer>
    </>
  );
}
