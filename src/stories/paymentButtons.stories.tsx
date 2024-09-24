import { Meta, StoryFn } from '@storybook/react/*';
import Payment from '../components/Payment';
import { ShoppingCartContainer } from '../routes/home';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';
import { shoppingCartAtom } from '../atoms';
import { expect, within, userEvent } from '@storybook/test';
import { PAYMENT_METHODS } from '../constants/enums';
import { shoppingCartProducts } from './dummyData';
import ShoppingCart from '../components/ShoppingCart';

const Container = styled.div`
  width: 1280px;
  height: 700px;
`;

export default {
  title: 'Main/Payment',
  component: Payment,
  tags: ['autodocs'],
  decorators: [
    (Story) => {
      return (
        <RecoilRoot
          initializeState={({ set }) => {
            set(shoppingCartAtom, shoppingCartProducts);
          }}
        >
          <div className="forWhat2"></div>
          <Container>
            <ShoppingCartContainer>
              <ShoppingCart></ShoppingCart>
              <Story />
            </ShoppingCartContainer>
          </Container>
        </RecoilRoot>
      );
    },
  ],
} as Meta<typeof Payment>;

const Template: StoryFn<typeof Payment> = () => <Payment />;

export const Default = Template.bind({});

export const Interaction = Template.bind({});

Interaction.play = async ({ canvasElement }) => {
  const { getByTestId, queryByTestId, getByText } = within(canvasElement);
  const { name, quantity } = shoppingCartProducts[0];
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
  const amountSpanRef = getByTestId('amount');
  const paymentMethods = Object.values(PAYMENT_METHODS);
  const paymentButtonRefs = paymentMethods.map((method) => getByText(method));
  expect(amountSpanRef.innerText).toBe('100,000');
  await userEvent.click(getByText('초기화'));
  expect(amountSpanRef.innerText).toBe('0');
};
