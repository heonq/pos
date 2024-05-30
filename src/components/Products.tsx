import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewModeAtom } from '../atoms';
import { fetchProducts, fetchCategories } from '../utils/fetchFunctions';
import { auth } from '../firebase';
import { useQuery } from 'react-query';
import { ICategory, IProduct } from '../Interfaces/DataInterfaces';
import CategoryMode from './product-components/category-mode';
import { IProductProps } from '../Interfaces/PropsInterfaces';
import TotalMode from './product-components/total-mode';

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
  const { data: products, isLoading: productIsLoading } = useQuery<IProduct[]>('products', () => fetchProducts(uid));
  const { data: categories, isLoading: categoryIsLoading } = useQuery<ICategory[]>('categories', () =>
    fetchCategories(uid),
  );

  const displayingProducts = products?.filter((product) => product.display);
  const categoriesContainsProduct = categories?.filter((category) =>
    displayingProducts?.some((product) => category.number === product.category),
  );

  const props: IProductProps = { products: displayingProducts ?? [], categories: categoriesContainsProduct ?? [] };
  const isLoading = productIsLoading || categoryIsLoading;

  return (
    <ProductsContainer>
      {isLoading ? null : viewMode === 'category' ? <CategoryMode {...props} /> : <TotalMode {...props} />}
    </ProductsContainer>
  );
}
