import { Meta, StoryFn } from '@storybook/react/*';
import CashCheck from '../../routes/modal-router/cash-check';
import { Container } from './container';
import { cashCheckHistoryMock, salesHistoryMock } from '../../mocks/storybookMock';

export default {
  title: 'Modal/CashCheck',
  component: CashCheck,
  decorators: [
    (Story) => {
      salesHistoryMock();
      cashCheckHistoryMock();
      return (
        <Container>
          <Story />
        </Container>
      );
    },
  ],
} as Meta<typeof CashCheck>;

export const Default: StoryFn<typeof CashCheck> = () => <CashCheck />;
