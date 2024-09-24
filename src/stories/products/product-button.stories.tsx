import ProductButton from '../../components/product-components/product-button';
import { RecoilRoot } from 'recoil';
import { Meta, StoryFn } from '@storybook/react';

const product = {
  name: 'product 1',
  number: 1,
  price: 50000,
  category: 1,
  display: true,
  barcode: '',
  salesQuantity: 1,
};

export default {
  title: 'Product/Product Button',
  component: ProductButton,
  tags: ['autodocs'],
  args: { product },
  argTypes: { product: { control: 'object' } },
} as Meta<typeof ProductButton>;

const Template: StoryFn<typeof ProductButton> = (args) => <ProductButton {...args} />;

export const Default = Template.bind({});
