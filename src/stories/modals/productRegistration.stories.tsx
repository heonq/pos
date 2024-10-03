import { Meta, StoryFn } from '@storybook/react/*';
import ProductRegistration from '../../routes/modal-router/product-registration';
import { Container } from './container';

export default {
  title: 'Modal/ProductRegistration',
  component: ProductRegistration,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} as Meta<typeof ProductRegistration>;

export const Default: StoryFn<typeof ProductRegistration> = () => <ProductRegistration />;
