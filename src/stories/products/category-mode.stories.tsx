import CategoryMode from '../../components/product-components/category-mode';
import { Meta, StoryFn } from '@storybook/react/*';
import { categories, products } from '../dummyData';

export default {
  title: 'Product/Category Mode',
  component: CategoryMode,
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
} as Meta<typeof CategoryMode>;

const Template: StoryFn<typeof CategoryMode> = (args) => <CategoryMode {...args} />;

export const Default = Template.bind({});
Default.args = {
  products,
  categories,
};
