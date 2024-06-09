import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewModeAtom } from '../atoms';
import { getProducts, getCategories } from '../utils/fetchFunctions';
import { auth } from '../firebase';
import { useQuery } from 'react-query';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';
import CategoryMode from './product-components/category-mode';
import { IProductProps } from '../Interfaces/PropsInterfaces';
import TotalMode from './product-components/total-mode';
import { useState } from 'react';

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
  const uid = auth.currentUser?.uid || '';
  const [categoriesContainsProduct, setCategoriesContainsProduct] = useState<ICategory[]>([]);
  const [displayingProducts, setDisplayingProducts] = useState<IProduct[]>([]);
  const { data: products, isLoading: productIsLoading } = useQuery<IProduct[]>('products', () => getProducts(uid), {
    onSuccess: (data) => {
      setDisplayingProducts(data.filter((product) => product.display));
    },
  });
  const { isLoading: categoryIsLoading } = useQuery<ICategory[]>('categories', () => getCategories(uid), {
    enabled: !!products,
    onSuccess: (data) => {
      const sortedCategory =
        data
          ?.filter(
            (category) =>
              category.display && displayingProducts?.some((product) => category.number === product.category),
          )
          .sort((a, b) => a.number - b.number) ?? [];
      setCategoriesContainsProduct(sortedCategory);
    },
  });

  const props: IProductProps = { products: displayingProducts ?? [], categories: categoriesContainsProduct ?? [] };
  const isLoading = productIsLoading || categoryIsLoading;

  return (
    <ProductsContainer>
      {isLoading ? null : viewMode === 'category' ? <CategoryMode {...props} /> : <TotalMode {...props} />}
    </ProductsContainer>
  );
}
