import TotalMode from '../../components/product-components/total-mode';
import { Meta, StoryFn } from '@storybook/react/*';
import { expect, within } from '@storybook/test';
import { categories, products } from '../dummyData';

export default {
  title: 'Product/Total Mode',
  component: TotalMode,
  tags: ['autodocs'],
  argTypes: {
    products: {
      control: 'object',
      description:
        '{ <br/>name : string, <br/> number : number, <br/> price : number <br/> category : number, <br/> display : boolean, <br/> barcode : string <br/> salesQuantity : number<br/>}',
    },
    categories: {
      control: 'object',
      description: '{<br/>name : string,<br/>number:number,<br/>display : boolean<br/>}',
    },
  },
  args: {
    products,
    categories,
  },
} as Meta<typeof TotalMode>;

const Template: StoryFn<typeof TotalMode> = (args) => <TotalMode {...args} />;

export const Default = Template.bind({});

export const WithHiddenCategory = Template.bind({});

WithHiddenCategory.args = {
  products: [
    ...products,
    { name: 'product 3', number: 3, price: 50000, category: 3, display: true, salesQuantity: 1, barcode: '' },
  ],
  categories: [...categories, { name: '카테고리2', number: 3, display: false }],
};
WithHiddenCategory.play = async ({ canvasElement }) => {
  const { queryByTestId } = within(canvasElement);
  await expect(queryByTestId('product 3')).not.toBeInTheDocument();
};

export const WithShowingCategory = Template.bind({});
WithShowingCategory.args = {
  products: [
    ...products,
    { name: 'product 3', number: 3, price: 50000, category: 3, display: true, salesQuantity: 1, barcode: '' },
  ],
  categories: [...categories, { name: '카테고리2', number: 3, display: true }],
};
WithShowingCategory.play = async ({ canvasElement }) => {
  const { getByTestId } = within(canvasElement);
  await expect(getByTestId('product 3')).toBeInTheDocument();
};
