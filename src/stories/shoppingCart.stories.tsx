import ShoppingCart from '../components/ShoppingCart';
import { RecoilRoot } from 'recoil';
import { shoppingCartAtom } from '../atoms';
import { Meta, StoryFn } from '@storybook/react/*';
import styled from 'styled-components';
import { within, userEvent, expect } from '@storybook/test';

const Container = styled.div`
  width: 315px;
  height: 800px;
`;

const products = [
  {
    number: 1,
    name: 'product 1',
    price: 50000,
    quantity: 1,
  },
  {
    number: 2,
    name: 'product 2',
    price: 50000,
    quantity: 1,
  },
];

export default {
  title: 'Main/ShoppingCart',
  component: ShoppingCart,
  tags: ['autodocs'],
  args: { products },
  argTypes: { products: { control: 'array' } },
  decorators: [
    (Story) => (
      <RecoilRoot
        initializeState={({ set }) => {
          set(shoppingCartAtom, products);
        }}
      >
        <Container>
          <Story />
        </Container>
      </RecoilRoot>
    ),
  ],
} as Meta<typeof ShoppingCart>;

const Template: StoryFn<typeof ShoppingCart> = () => <ShoppingCart />;

export const Default = Template.bind({});

export const Interaction = Template.bind({});

Interaction.play = async ({ canvasElement }) => {
  const { getByTestId, queryByTestId } = within(canvasElement);
  const { name, quantity } = products[0];
  const quantityRef = getByTestId(`${name}-quantity`);
  const priceRef = getByTestId(`${name}-price`);
  expect(getByTestId(name)).toBeInTheDocument();
  await userEvent.click(getByTestId(`${name}-plus-button`));
  expect(quantityRef.innerText).toBe(quantity + 1 + '');
  expect(priceRef.innerText).toBe('100,000원');
  await userEvent.click(getByTestId(`${name}-minus-button`));
  expect(quantityRef.innerText).toBe(quantity + '');
  expect(priceRef.innerText).toBe('50,000원');
  await userEvent.click(getByTestId(`${name}-delete-button`));
  expect(queryByTestId(name)).not.toBeInTheDocument();
};
