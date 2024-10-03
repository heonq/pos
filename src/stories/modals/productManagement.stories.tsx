import { Meta, StoryFn } from '@storybook/react/*';
import ProductManagement from '../../routes/modal-router/product-management';
import { Container } from './container';

export default {
  title: 'Modal/ProductManagement',
  component: ProductManagement,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} as Meta<typeof ProductManagement>;

export const Default: StoryFn<typeof ProductManagement> = () => <ProductManagement />;
