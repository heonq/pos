import { Meta, StoryFn } from '@storybook/react/*';
import SalesStatistics from '../../routes/modal-router/sales-statistics';
import { Container } from './container';
import { salesHistoryMock, salesStatisticMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/SalesStatistics',
  component: SalesStatistics,
  decorators: [
    (Story) => {
      salesHistoryMock();
      salesStatisticMock();
      return (
        <Container>
          <Story />
        </Container>
      );
    },
  ],
} as Meta<typeof SalesStatistics>;

export const Default: StoryFn<typeof SalesStatistics> = () => <SalesStatistics />;
