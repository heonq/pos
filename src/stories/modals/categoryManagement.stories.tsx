import { Meta, StoryFn } from '@storybook/react/*';
import CategoryManagement from '../../routes/modal-router/category-management';
import { Container } from './container';

export default {
  title: 'Modal/CategoryManagement',
  component: CategoryManagement,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} as Meta<typeof CategoryManagement>;

export const Default: StoryFn<typeof CategoryManagement> = () => <CategoryManagement />;
