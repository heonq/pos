import { useRecoilValue } from 'recoil';
import styled from 'styled-components';
import { viewModeAtom } from '../atoms';
import { auth } from '../firebase';
import CategoryMode from './product-components/category-mode';
import TotalMode from './product-components/total-mode';
import { useEffect, useMemo, useState } from 'react';
import useProductsAndCategories from '../hooks/useProductsAndCategories';
import { CategoryModeSkeleton } from '../skeletons/product';
import { ReloadIcon } from './ReloadIcon';

const ProductsContainer = styled.div`
  width: 75%;
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  min-height: inherit;
  background-color: white;
  padding: 20px;
  border-radius: ${(props) => props.theme.borderRadius};
  box-shadow: ${(props) => props.theme.boxShadow};
  margin-right: 20px;
`;

export default function Products() {
  const viewMode = useRecoilValue(viewModeAtom);
  const uid = auth.currentUser?.uid ?? '';
  const {
    products,
    categories,
    isLoading,
    productsLoadingError,
    categoriesLoadingError,
    refetchProducts,
    refetchCategories,
  } = useProductsAndCategories(uid);
  const [showSkeleton, setShowSkeleton] = useState(true);

  useEffect(() => {
    setShowSkeleton(false);
    const timer = setTimeout(() => {
      if (isLoading) setShowSkeleton(true);
    }, 1000);
    return () => clearInterval(timer);
  }, [isLoading, products]);

  const props = useMemo(
    () => ({
      products: products ?? [],
      categories: categories ?? [],
    }),
    [products, categories],
  );

  const reload = () => {
    if (productsLoadingError) refetchProducts();
    if (!productsLoadingError && categoriesLoadingError) refetchCategories();
  };

  const renderContent = () => {
    if (isLoading && showSkeleton) return <CategoryModeSkeleton />;
    if (productsLoadingError || categoriesLoadingError) return <ReloadIcon reload={reload} />;
    if (!isLoading) {
      return viewMode === 'category' ? <CategoryMode {...props} /> : <TotalMode {...props} />;
    }
    return null;
  };

  return <ProductsContainer>{renderContent()}</ProductsContainer>;
}
