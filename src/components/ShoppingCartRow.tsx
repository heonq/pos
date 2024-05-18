import styled from 'styled-components';
import { IShoppingCartProduct } from '../Interfaces/DataInterfaces';
import formatter from '../utils/formatter';
import { useRecoilState } from 'recoil';
import { shoppingCartAtom } from '../atoms';

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
  const [shoppingCart, setShoppingCart] = useRecoilState(shoppingCartAtom);

  const minusQuantity = (number: number) => {
    if (shoppingCart.find((product) => product.number === number)?.quantity === 1) return deleteFromCart(number);
    setShoppingCart((prevCart) => {
      return prevCart.map((product) => {
        return number === product.number ? { ...product, quantity: product.quantity - 1 } : product;
      });
    });
  };

  const plusQuantity = (number: number) => {
    setShoppingCart((prevCart) => {
      return prevCart.map((product) => {
        return number === product.number ? { ...product, quantity: product.quantity + 1 } : product;
      });
    });
  };

  const deleteFromCart = (number: number) => {
    setShoppingCart((prevCart) => {
      return prevCart.filter((product) => product.number !== number);
    });
  };

  return (
    <CartRow>
      <CartProduct>
        {name}
        <br />
        {formatter.formatNumber(price * quantity)}원
      </CartProduct>
      <QuantityBox>
        <QuantityButton onClick={() => minusQuantity(number)}>-</QuantityButton>
        <div>{quantity}</div>
        <QuantityButton onClick={() => plusQuantity(number)}>+</QuantityButton>
        <DeleteButton onClick={() => deleteFromCart(number)}>x</DeleteButton>
      </QuantityBox>
    </CartRow>
  );
}
