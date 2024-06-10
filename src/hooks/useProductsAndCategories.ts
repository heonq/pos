import { useQuery } from '@tanstack/react-query';
import { getProducts, getCategories } from '../utils/fetchFunctions';

const useProductsAndCategories = (uid: string) => {
  const { data: products, isLoading: productsAreLoading } = useQuery({
    queryKey: ['products'],
    queryFn: () => getProducts(uid),
  });

  const { data: categories, isLoading: categoriesAreLoading } = useQuery({
    queryKey: ['categories'],
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
