import styled from 'styled-components';
import ProductButton from './product-button';
import { IProductProps } from '../../Interfaces/PropsInterfaces';
import { Fragment } from 'react/jsx-runtime';
import { useEffect, useState } from 'react';
import { ICategory } from '../../Interfaces/DataInterfaces';

const CategoryHeader = styled.div`
  margin-bottom: 5px;
  font-size: 15px;
`;

const ScrollContainer = styled.div`
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
  const [categoriesWithProduct, setCategoriesWithProduct] = useState<ICategory[]>([]);
  useEffect(() => {
    setCategoriesWithProduct(
      categories.filter((category) => products.some((product) => product.category === category.number)),
    );
  }, [products, categories]);

  return (
    <>
      {categoriesWithProduct.map((category, index) => {
        return (
          <Fragment key={'Fragment' + index}>
            <CategoryHeader key={index}>{category.name}</CategoryHeader>
            <ScrollContainer key={'scrollContainer' + index}>
              {products
                .filter((product) => product.category === category.number)
                .map((product, i) => (
                  <ProductButton key={'button' + i} product={product} />
                ))}
            </ScrollContainer>
          </Fragment>
        );
      })}
    </>
  );
}
