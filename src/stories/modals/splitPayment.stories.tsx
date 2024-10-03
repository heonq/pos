import { Meta, StoryFn } from '@storybook/react/*';
import SplitPaymentModal from '../../routes/modal-router/splitPayment';
import { Container } from './container';

export default {
  title: 'Modal/SplitPaymentModal',
  component: SplitPaymentModal,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
} as Meta<typeof SplitPaymentModal>;

export const Default: StoryFn<typeof SplitPaymentModal> = () => <SplitPaymentModal />;
