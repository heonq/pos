import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewModeAtom } from '../atoms';
import { auth } from '../firebase';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';
import CategoryMode from './product-components/category-mode';
import TotalMode from './product-components/total-mode';
import { useEffect, useState } from 'react';
import useProductsAndCategories from '../hooks/useProductsAndCategories';

const ProductsContainer = styled.div`
  width: 75%;
  height: 100%;
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
  overflow-y: scroll;
  min-height: inherit;
  position: relative;
  background-color: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.boxShadow};
  margin-right: 20px;
`;

export default function Products() {
  const viewMode = useRecoilValue(viewModeAtom);
  const uid = auth.currentUser?.uid ?? '';
  const [categoriesContainsProduct, setCategoriesContainsProduct] = useState<ICategory[]>([]);
  const [displayingProducts, setDisplayingProducts] = useState<IProduct[]>([]);
  const { products, categories, isLoading } = useProductsAndCategories(uid);

  useEffect(() => {
    products && setDisplayingProducts(products.filter((product) => product.display));
  }, [products]);

  useEffect(() => {
    const sortedCategory =
      categories
        ?.filter(
          (category) => category.display && displayingProducts?.some((product) => category.number === product.category),
        )
        .sort((a, b) => a.number - b.number) ?? [];
    setCategoriesContainsProduct(sortedCategory);
    setDisplayingProducts((prev) =>
      prev.filter((product) => sortedCategory.some((category) => category.number === product.category)),
    );
  }, [categories]);

  const props = { products: displayingProducts, categories: categoriesContainsProduct };

  return (
    <ProductsContainer>
      {isLoading ? null : viewMode === 'category' ? <CategoryMode {...props} /> : <TotalMode {...props} />}
    </ProductsContainer>
  );
}
