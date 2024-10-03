import { Meta, StoryFn } from '@storybook/react/*';
import SalesHistory from '../../routes/modal-router/sales-history';
import { Container } from './container';

export default {
  title: 'Modal/SalesHistory',
  component: SalesHistory,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
} as Meta<typeof SalesHistory>;

export const Default: StoryFn<typeof SalesHistory> = () => <SalesHistory />;
