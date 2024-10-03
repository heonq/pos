import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../utils/firebaseApi';
import QUERY_KEYS from '../constants/queryKeys';

const useProductsAndCategories = (uid: string) => {
  const {
    data: products,
    isLoading: productsAreLoading,
    isError: productsLoadingError,
    refetch: refetchProducts,
  } = useQuery({
    queryKey: [QUERY_KEYS.products],
    queryFn: () => getProducts(uid),
  });

  const {
    data: categories,
    isLoading: categoriesAreLoading,
    isError: categoriesLoadingError,
    refetch: refetchCategories,
  } = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: () => getCategories(uid),
    enabled: !!products,
  });

  return {
    products,
    categories,
    isLoading: productsAreLoading || categoriesAreLoading,
    productsLoadingError,
    categoriesLoadingError,
    refetchProducts,
    refetchCategories,
  };
};

export default useProductsAndCategories;
