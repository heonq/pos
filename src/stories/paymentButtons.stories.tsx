import { Meta, StoryFn } from '@storybook/react/*';
import Payment from '../components/Payment';
import { ShoppingCartContainer } from '../routes/home';
import styled from 'styled-components';
import { RecoilRoot } from 'recoil';
import { shoppingCartAtom } from '../atoms';
import { expect, within, userEvent } from '@storybook/test';
import { jest } from '@storybook/jest';
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
  const mockPrompt = jest.fn(() => '기타결제 사유');
  const originalPrompt = window.prompt;
  window.prompt = mockPrompt;

  const { getByTestId, queryByTestId, getByText } = within(canvasElement);
  const { name, quantity } = shoppingCartProducts[0];
  const quantityRef = getByTestId(`${name}-quantity`);
  const productPriceRef = getByTestId(`${name}-amount`);
  const totalAmountRef = getByTestId('amount');

  // 장바구니에 상품이 담기는지 확인한다.
  expect(getByTestId(name)).toBeInTheDocument();
  expect(totalAmountRef.innerText).toBe('100,000');

  // 수량 추가 버튼을 누를 경우 수량과 가격이 증가한다.
  await userEvent.click(getByTestId(`${name}-plus-button`));
  expect(quantityRef.innerText).toBe(quantity + 1 + '');
  expect(productPriceRef.innerText).toBe('100,000원');
  expect(totalAmountRef.innerText).toBe('150,000');

  // 수량 감소 버튼을 누를 경우 수량과 가격이 감소한다.
  await userEvent.click(getByTestId(`${name}-minus-button`));
  expect(quantityRef.innerText).toBe(quantity + '');
  expect(productPriceRef.innerText).toBe('50,000원');
  expect(totalAmountRef.innerText).toBe('100,000');

  // 삭제 버튼을 누를 경우 상품이 삭제된다.
  await userEvent.click(getByTestId(`${name}-delete-button`));
  expect(queryByTestId(name)).not.toBeInTheDocument();
  expect(totalAmountRef.innerText).toBe('50,000');

  // 결제수단 버튼을 누르면 버튼이 활성화된다.
  const paymentMethods = Object.values(PAYMENT_METHODS);
  const paymentButtonRefs = paymentMethods
    .map((method) => getByText(method))
    .filter((button) => button.innerText !== '분할결제' && button.innerText !== '할인적용');

  for (const button of paymentButtonRefs) {
    await userEvent.click(button);
    if (button.innerText === '기타결제') {
      expect(mockPrompt).toHaveBeenCalled();
    }
    expect(button).toHaveStyle('background-color:rgb(0,0,255);color:rgb(255,255,255)');
  }

  // 결제완료 버튼을 누르면 모두 초기화된다.
  await userEvent.click(getByText('결제완료'));
  const shoppingCart = getByTestId('shopping-cart');
  const paymentMethodButtonContainer = getByTestId('payment-method-buttons-container');
  expect(totalAmountRef.innerText).toBe('0');
  expect(shoppingCart.childElementCount).toBe(0);
  expect(paymentMethodButtonContainer.querySelectorAll('.selected').length).toBe(0);

  window.prompt = originalPrompt;
};
