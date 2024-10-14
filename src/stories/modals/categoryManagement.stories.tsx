import { Meta, StoryFn } from '@storybook/react/*';
import CategoryManagement from '../../routes/modal-router/category-management';
import { Container } from './container';
import { getProductsAndCategoriesMock, manageProductsAndCategoriesMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/CategoryManagement',
  component: CategoryManagement,
  decorators: [
    (Story) => {
      getProductsAndCategoriesMock();
      manageProductsAndCategoriesMock();
      return (
        <Container>
          <Story />
        </Container>
      );
    },
  ],
} as Meta<typeof CategoryManagement>;

export const Default: StoryFn<typeof CategoryManagement> = () => <CategoryManagement />;
