import { Meta, StoryFn } from '@storybook/react/*';
import SalesStatistics from '../../routes/modal-router/sales-statistics';
import { Container } from './container';

export default {
  title: 'Modal/SalesStatistics',
  component: SalesStatistics,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Container>
      <Story />
    </Container>
  ),
} as Meta<typeof SalesStatistics>;

export const Default: StoryFn<typeof SalesStatistics> = () => <SalesStatistics />;
