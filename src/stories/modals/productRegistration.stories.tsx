import { Meta, StoryFn } from '@storybook/react/*';
import ProductRegistration from '../../routes/modal-router/product-registration';
import { Container } from './container';
import { addProductAndCategoryMock, getProductsAndCategoriesMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/ProductRegistration',
  component: ProductRegistration,
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
} as Meta<typeof ProductRegistration>;

export const Default: StoryFn<typeof ProductRegistration> = () => <ProductRegistration />;
