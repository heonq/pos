import Header from '../components/Header';
import { Meta, StoryFn } from '@storybook/react/*';
import styled from 'styled-components';

const Container = styled.div`
  width: 1280px;
  height: 300px;
`;

export default {
  title: 'Main/Header',
  component: Header,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <Container>
        <Story />
      </Container>
    ),
  ],
} as Meta<typeof Header>;

export const Default: StoryFn<typeof Header> = () => <Header />;
