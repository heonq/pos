import styled from 'styled-components';
import { IShoppingCartProduct } from '../Interfaces/DataInterfaces';
import formatter from '../utils/formatter';
import { useSetRecoilState } from 'recoil';
import { shoppingCartAtom } from '../atoms';
import { useCallback } from 'react';

const CartRow = styled.div`
  height: 90px;
  display: flex;
  flex-direction: row;
  align-items: center;
  border-width: 0px;
  margin: 10px;
  background-color: rgb(248, 248, 248);
  border-radius: ${(props) => props.theme.borderRadius};
`;

const CartProduct = styled.div`
  width: 70%;
  height: 100%;
  text-align: center;
  line-height: 45px;
`;

const QuantityBox = styled.div`
  width: 30%;
  height: 100%;
  text-align: center;
  line-height: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  overflow: visible;
  border: none;
`;

const QuantityButton = styled.button`
  font-size: 20px;
  width: 50%;
  background-color: transparent;
  border: none;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  position: absolute;
  right: 310%;
  top: 5%;
  cursor: pointer;
  font-size: 18px;
  width: 18px;
  height: 18px;
  line-height: 18px;
  background-color: transparent;
  border: none;
`;

export default function ShoppingCartRow({ number, name, price, quantity }: IShoppingCartProduct) {
  const setShoppingCart = useSetRecoilState(shoppingCartAtom);

  const updateQuantity = useCallback(
    (number: number, change: number) => {
      setShoppingCart((prevCart) => {
        return prevCart
          .map((product) =>
            number === product.number ? { ...product, quantity: Math.max(product.quantity + change, 0) } : product,
          )
          .filter((product) => product.quantity > 0);
      });
    },
    [setShoppingCart],
  );

  const minusQuantity = useCallback(() => updateQuantity(number, -1), [number, updateQuantity]);
  const plusQuantity = useCallback(() => updateQuantity(number, 1), [number, updateQuantity]);
  const deleteFromCart = useCallback(() => updateQuantity(number, -quantity), [number, quantity, updateQuantity]);

  return (
    <CartRow data-testid={name}>
      <CartProduct>
        <span data-testid={`${name}-name`}>{name}</span>
        <br />
        <span data-testid={`${name}-amount`}>{formatter.formatNumber(price * quantity)}원</span>
      </CartProduct>
      <QuantityBox>
        <QuantityButton data-testid={`${name}-minus-button`} onClick={minusQuantity}>
          -
        </QuantityButton>
        <div data-testid={`${name}-quantity`}>{quantity}</div>
        <QuantityButton data-testid={`${name}-plus-button`} onClick={plusQuantity}>
          +
        </QuantityButton>
        <DeleteButton data-testid={`${name}-delete-button`} onClick={deleteFromCart}>
          x
        </DeleteButton>
      </QuantityBox>
    </CartRow>
  );
}
