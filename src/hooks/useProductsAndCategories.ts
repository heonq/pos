import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../utils/fetchFunctions';
import QUERY_KEYS from '../constants/queryKeys';

const useProductsAndCategories = (uid: string) => {
  const { data: products, isLoading: productsAreLoading } = useQuery({
    queryKey: [QUERY_KEYS.products],
    queryFn: () => getProducts(uid),
  });

  const { data: categories, isLoading: categoriesAreLoading } = useQuery({
    queryKey: [QUERY_KEYS.categories],
    queryFn: () => getCategories(uid),
    enabled: !!products,
  });

  return {
    products,
    categories,
    isLoading: productsAreLoading || categoriesAreLoading,
  };
};

export default useProductsAndCategories;
