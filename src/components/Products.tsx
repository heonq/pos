import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewModeAtom } from '../atoms';
import { auth } from '../firebase';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';
import CategoryMode from './product-components/category-mode';
import TotalMode from './product-components/total-mode';
import { useEffect, useState } from 'react';
import useProductsAndCategories from '../hooks/useProductsAndCategories';
import { CategoryModeSkeleton } from '../skeletons/product';

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
  const [displayingCategories, setDisplayingCategories] = useState<ICategory[]>([]);
  const [displayingProducts, setDisplayingProducts] = useState<IProduct[]>([]);
  const { products, categories, isLoading } = useProductsAndCategories(uid);

  useEffect(() => {
    products && setDisplayingProducts(products?.filter((product) => product.display));
  }, [products]);

  useEffect(() => {
    categories && setDisplayingCategories(categories?.filter((category) => category.display));
  }, [categories]);

  const props = { products: displayingProducts, categories: displayingCategories };

  return (
    <ProductsContainer>
      {isLoading ? (
        <CategoryModeSkeleton />
      ) : viewMode === 'category' ? (
        <CategoryMode {...props} />
      ) : (
        <TotalMode {...props} />
      )}
    </ProductsContainer>
  );
}
