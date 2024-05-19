import { useSetRecoilState } from 'recoil';
import styled from 'styled-components';
import { shoppingCartSelector } from '../../atoms';
import { IProduct, IShoppingCartProduct } from '../../Interfaces/DataInterfaces';
import formatter from '../../utils/formatter';
import { IProductButtonProps } from '../../Interfaces/PropsInterfaces';

const Button = styled.button`
  flex: 0 0 auto;
  width: 173px;
  height: 70px;
  border-style: none;
  border-width: 0.5px;
  scroll-snap-align: start;
  text-align: center;
  cursor: pointer;
  line-height: 35px;
  background-color: rgb(248, 248, 248);
  border-radius: 5px;
  :hover {
    filter: brightness(0.9);
    cursor: pointer;
  }
`;

export default function ProductButton({ product }: IProductButtonProps) {
  const setShoppingCart = useSetRecoilState<IShoppingCartProduct[]>(shoppingCartSelector);

  const addToShoppingCart = ({ name, number, price }: IProduct) => {
    setShoppingCart((prevCart) => {
      const updatedCart = prevCart.map((product) => {
        return product.number === number ? { ...product, quantity: product.quantity + 1 } : product;
      });
      if (!prevCart.find((product) => product.number === number)) {
        return [...prevCart, { name, number, quantity: 1, price }];
      }
      return updatedCart;
    });
  };

  return (
    <Button onClick={() => addToShoppingCart(product)}>
      {product.name}
      <br />
      {formatter.formatNumber(product.price)}
    </Button>
  );
}
