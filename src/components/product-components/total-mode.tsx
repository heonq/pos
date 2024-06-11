import styled from 'styled-components';
import ProductButton from './product-button';
import { IProductProps } from '../../Interfaces/PropsInterfaces';

export const TotalViewModeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-content: baseline;
  button {
    margin-right: 10px;
    margin-bottom: 10px;
  }
`;

export default function TotalMode({ products, categories }: IProductProps) {
  const displayingCategories = categories.filter((category) => category.display).map((category) => category.number);
  return (
    <>
      <TotalViewModeContainer>
        {products
          .filter((product) => displayingCategories.includes(product.category))
          .map((product, index) => (
            <ProductButton key={index} product={product} />
          ))}
      </TotalViewModeContainer>
    </>
  );
}
