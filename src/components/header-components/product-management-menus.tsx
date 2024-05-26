import { ViewModeManagementMenusProp } from '../../Interfaces/PropsInterfaces';
import { ExpandButtonContainer, Button, HiddenButtonContainer } from './base-components';

export default function ViewModeManagementMenus({
  onViewModeMenuClick,
  onViewModeSelect,
  viewMode,
  viewModeMenuVisible,
}: ViewModeManagementMenusProp) {
  return (
    <>
      <ExpandButtonContainer>
        <Button onClick={onViewModeMenuClick}>{viewMode === 'category' ? '카테고리 보기' : '전체보기'}</Button>
        {viewModeMenuVisible ? (
          <HiddenButtonContainer>
            <Button onClick={() => onViewModeSelect('category')}>카테고리 보기</Button>
            <Button onClick={() => onViewModeSelect('total')}>전체보기</Button>
          </HiddenButtonContainer>
        ) : null}
      </ExpandButtonContainer>
    </>
  );
}
