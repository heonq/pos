import Products from '../components/Products';
import { Meta, StoryFn } from '@storybook/react/*';
import styled from 'styled-components';

const Wrapper = styled.div`
  top: 30px;
  position: relative;
  margin: 0 auto;
  width: 1280px;
  height: 700px;
`;

export default {
  title: 'Main/Products',
  component: Products,
  tags: ['autodocs'],
  decorators: (Story) => (
    <Wrapper>
      <Story />
    </Wrapper>
  ),
} as Meta<typeof Products>;

export const Default: StoryFn<typeof Products> = () => <Products />;
