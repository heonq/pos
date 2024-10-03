import { Meta, StoryFn } from '@storybook/react/*';
import DiscountModal from '../../routes/modal-router/discount';
import { Container } from './container';

export default {
  title: 'Modal/DiscountModal',
  component: DiscountModal,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
} as Meta<typeof DiscountModal>;

export const Default: StoryFn<typeof DiscountModal> = () => <DiscountModal />;
