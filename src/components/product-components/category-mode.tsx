import styled from 'styled-components';
import ProductButton from './product-button';
import { IProductProps } from '../../Interfaces/PropsInterfaces';
import { Fragment } from 'react/jsx-runtime';
import { useMemo } from 'react';

export const CategoryHeader = styled.div`
  margin-bottom: 5px;
  font-size: 15px;
  height: 20px;
`;

export const ScrollContainer = styled.div`
  width: 100%;
  display: flex;
  overflow-x: scroll;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
  margin-bottom: 20px;
  button {
    margin-right: 10px;
  }
`;

export default function CategoryMode({ categories, products }: IProductProps) {
  const { categoriesWithProduct, productToDisplay } = useMemo(() => {
    const categoriesWithProduct = categories.filter(
      (category) =>
        category.display && products.some((product) => product.display && product.category === category.number),
    );
    const productToDisplay = categoriesWithProduct.map((category) => {
      return products.filter((product) => product.category === category.number && product.display);
    });
    return { categoriesWithProduct, productToDisplay };
  }, [categories, products]);

  return (
    <>
      {categoriesWithProduct.map((category, index) => {
        return (
          <Fragment key={`category-${category.number}`}>
            <CategoryHeader>{category.name}</CategoryHeader>
            <ScrollContainer>
              {productToDisplay[index].map((product) => (
                <ProductButton key={`product-${product.number}`} product={product} />
              ))}
            </ScrollContainer>
          </Fragment>
        );
      })}
    </>
  );
}
