import { Meta, StoryFn } from '@storybook/react/*';
import CategoryRegistration from '../../routes/modal-router/category-registration';
import { Container } from './container';
import { addProductAndCategoryMock, getProductsAndCategoriesMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/CategoryRegistration',
  component: CategoryRegistration,
  decorators: [
    (Story) => {
      getProductsAndCategoriesMock();
      addProductAndCategoryMock();
      return (
        <Container>
          <Story />
        </Container>
      );
    },
  ],
} as Meta<typeof CategoryRegistration>;

export const Default: StoryFn<typeof CategoryRegistration> = () => <CategoryRegistration />;
