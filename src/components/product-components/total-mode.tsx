import styled from 'styled-components';
import ProductButton from './product-button';
import { IProductProps } from '../../Interfaces/PropsInterfaces';

const TotalViewModeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export default function TotalMode({ categories, products }: IProductProps) {
  const productsInOrder = categories
    .map((category) =>
      products.filter((product) => {
        return product.category === category.number;
      }),
    )
    .flat();

  return (
    <>
      <TotalViewModeContainer>
        {productsInOrder.map((product, index) => (
          <ProductButton key={index} product={product} />
        ))}
      </TotalViewModeContainer>
    </>
  );
}
