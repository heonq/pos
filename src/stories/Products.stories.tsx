import Products from '../components/Products';
import { Meta, StoryFn } from '@storybook/react/*';
import styled from 'styled-components';
import { products, categories } from '../mocks/mockData';

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

const template: StoryFn<typeof Products> = (args) => <Products {...args} />;

export const Default = template.bind({});

Default.args = {
  products,
  categories,
  isLoading: false,
  productsLoadingError: false,
  categoriesLoadingError: false,
  refetchProducts: () => console.log(products),
  refetchCategories: () => console.log(products),
  viewMode: 'category',
};
