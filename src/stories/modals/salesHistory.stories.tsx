import { Meta, StoryFn } from '@storybook/react/*';
import SalesHistory from '../../routes/modal-router/sales-history';
import { Container } from './container';
import { getProductsAndCategoriesMock, salesHistoryMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/SalesHistory',
  component: SalesHistory,
  decorators: [
    (Story) => {
      getProductsAndCategoriesMock();
      salesHistoryMock();
      return (
        <Container>
          <Story />
        </Container>
      );
    },
  ],
} as Meta<typeof SalesHistory>;

export const Default: StoryFn<typeof SalesHistory> = () => <SalesHistory />;
