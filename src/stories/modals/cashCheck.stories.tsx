import { Meta, StoryFn } from '@storybook/react/*';
import CashCheck from '../../routes/modal-router/cash-check';
import { Container } from './container';

export default {
  title: 'Modal/CashCheck',
  component: CashCheck,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
} as Meta<typeof CashCheck>;

export const Default: StoryFn<typeof CashCheck> = () => <CashCheck />;
