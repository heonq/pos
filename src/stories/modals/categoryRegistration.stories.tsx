import { Meta, StoryFn } from '@storybook/react/*';
import CategoryRegistration from '../../routes/modal-router/category-registration';
import { Container } from './container';

export default {
  title: 'Modal/CategoryRegistration',
  component: CategoryRegistration,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} as Meta<typeof CategoryRegistration>;

export const Default: StoryFn<typeof CategoryRegistration> = () => <CategoryRegistration />;
