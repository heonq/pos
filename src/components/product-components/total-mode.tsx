import styled from 'styled-components';
import ProductButton from './product-button';
import { IProductProps } from '../../Interfaces/PropsInterfaces';
import { useMemo } from 'react';

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
  const productsToDisplay = useMemo(() => {
    const displayingCategories = categories.filter((category) => category.display).map((category) => category.number);
    return products.filter((product) => displayingCategories.includes(product.category) && product.display);
  }, [products, categories]);

  return (
    <>
      <TotalViewModeContainer>
        {productsToDisplay.map((product) => (
          <ProductButton key={`product-${product.number}`} product={product} />
        ))}
      </TotalViewModeContainer>
    </>
  );
}
