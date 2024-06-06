/* eslint-disable no-restricted-globals */
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import {
  Background,
  BigModalComponent,
  CancelButton,
  SubmitButton,
  SubmitButtonsContainer,
} from '../../components/Modal';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { ICategory, IProduct, IProductManagement } from '../../Interfaces/DataInterfaces';
import { deleteData, fetchCategories, fetchProducts, updateChangedData } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import {
  BigModalContainer,
  TableContainer,
  TableHeader,
  Table,
} from '../../components/formComponents/FormContainerComponents';
import { ProductManagementRow } from '../../components/formComponents/productManagementRow';
import React, { useEffect, useState } from 'react';
import validator from '../../utils/validator';
import { CONFIRM_MESSAGES, DISPLAY_OPTIONS, ERROR_MESSAGES, SELECTED_MANAGEMENT_OPTIONS } from '../../constants/enums';
import { ErrorMessage } from '../../components/formComponents/FormContainerComponents';
import { useResetRecoilState } from 'recoil';
import { shoppingCartSelector } from '../../atoms';

const ManagementButtonsContainer = styled.div`
  display: flex;
  justify-content: end;
  * {
    margin-right: 5px;
  }
`;

const CategorySelectBackground = styled.div`
  background-color: black;
  opacity: 0.5;
  z-index: 540;
  width: 100%;
  height: 100%;
  position: absolute;
`;

const CategorySelectContainer = styled.div`
  width: 350px;
  height: 200px;
  position: absolute;
  z-index: 550;
  left: calc(50% - 200px);
  top: calc(50% - 100px);
  background-color: white;
  box-shadow: ${(props) => props.theme.boxShadow};
  border-radius: 6px;
  display: flex;
  justify-content: center;
`;

const CategorySelect = styled.select`
  position: relative;
  top: 30%;
`;

export default function ProductManagement() {
  const uid = auth.currentUser?.uid ?? '';
  const { data: products } = useQuery<IProduct[]>('products', () => fetchProducts(uid));
  const { data: categories } = useQuery<ICategory[]>('categories', () => fetchCategories(uid));
  const [categoryCriteria, setCategoryCriteria] = useState(0);
  const [displayCriteria, setDisplayCriteira] = useState('전체');
  const [productsToDisplay, setProductsToDisplay] = useState(products);
  const [categorySelectDisplay, setCategorySelectDisplay] = useState(false);
  const [isAllChecked, setAllChecked] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(categories?.[0]?.number ?? 1);
  const navigate = useNavigate();
  const resetShoppingCart = useResetRecoilState(shoppingCartSelector);
  const queryClient = useQueryClient();

  const mutation = useMutation(updateChangedData, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const methods = useForm<IProductManagement>({
    defaultValues: {
      products: products?.map((product) => {
        return {
          checked: false,
          number: product.number,
          name: product.name,
          price: product.price,
          barcode: product.barcode,
          category: product.category,
          display: product.display ? DISPLAY_OPTIONS.show : DISPLAY_OPTIONS.hide,
          salesQuantity: product.salesQuantity,
        };
      }),
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue,
  } = methods;
  const { fields } = useFieldArray({
    control,
    name: 'products',
  });
  const watchedProduct = watch('products');

  useEffect(() => {
    setProductsToDisplay(products);
  }, [products]);

  useEffect(() => {
    if (productsToDisplay) {
      methods.reset({
        products: productsToDisplay.map((product) => ({
          checked: false,
          number: product.number,
          name: product.name,
          price: product.price,
          barcode: product.barcode,
          category: product.category,
          display: product.display ? '전시' : '숨김',
          salesQuantity: product.salesQuantity,
        })),
      });
    }
  }, [productsToDisplay]);

  const onSearchClick = () => {
    let filteredProducts = products ?? [];
    if (categoryCriteria !== 0) {
      filteredProducts = filteredProducts.filter((product) => product.category === categoryCriteria);
    }
    if (displayCriteria !== '전체') {
      filteredProducts = filteredProducts.filter(
        (product) => product.display === (displayCriteria === DISPLAY_OPTIONS.show),
      );
    }
    setProductsToDisplay(filteredProducts);
  };

  const onCheck = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setAllChecked(checked);
    fields.forEach((_, index) => {
      setValue(`products.${index}.checked`, checked);
    });
  };

  const uncheckEverything = () => {
    fields.forEach((_, index) => {
      setValue(`products.${index}.checked`, false);
    });
    setAllChecked(false);
  };

  const findChanges = (original: IProduct, changed: IProduct): Partial<IProduct> => {
    const changes: Partial<IProduct> = {};
    const keys = Object.keys(changed);
    keys.forEach((key) => {
      if (original[key] !== changed[key]) {
        changes[key] = changed[key];
      }
    });
    return changes;
  };

  const onSubmit = (data: IProductManagement) => {
    if (handleProductNames(data) && handleBarcodes(data)) {
      handleSubmitChanges(data);
    }
  };

  const getDatasWithoutChecked = (data: IProductManagement) => {
    return data.products.map((product) => {
      const newData = {
        ...product,
        display: product.display === DISPLAY_OPTIONS.show,
        price: +product.price,
        category: +product.category,
      };
      delete newData.checked;
      return newData;
    });
  };

  const handleSubmitChanges = (data: IProductManagement) => {
    const productsWithoutChecked = getDatasWithoutChecked(data);
    const changedArray = productsWithoutChecked.map((product, index) => {
      return products && findChanges(products?.[index], productsWithoutChecked?.[index]);
    });
    const changedProductNumbers = changedArray
      .map((changed, index) => {
        if (changed && Object.keys(changed).length > 0) return watchedProduct[index].number;
        return undefined;
      })
      .filter((number): number is number => number !== undefined);
    const changedArrayFiltered = changedArray.filter(
      (changed): changed is Partial<IProduct> => changed !== undefined && Object.keys(changed).length > 0,
    );

    try {
      if (changedArrayFiltered.length) {
        mutation.mutate({
          uid,
          numberArray: changedProductNumbers,
          changedData: changedArrayFiltered,
          type: 'products',
        });
      }
      navigate('/');
      resetShoppingCart();
    } catch (e) {
      if (e instanceof Error) {
        setError('otherError', { type: 'manual', message: e.message });
      }
    }
  };

  const confirmDelete = (salesQuantities: number[]) => {
    const ok = confirm(CONFIRM_MESSAGES.deleteSelectedProduct);
    if (!ok) return false;
    if (salesQuantities.some((salesQuantity) => salesQuantity > 0)) {
      alert(ERROR_MESSAGES.cantDeleteProduct);
      return false;
    }
    return true;
  };

  const deleteCheckedProduct = () => {
    const salesQuantities = watchedProduct.filter((product) => product.checked).map((product) => product.salesQuantity);
    if (!confirmDelete(salesQuantities)) return;
    const checkedNumbers = watchedProduct.filter((product) => product.checked).map((product) => product.number);
    deleteData({ uid, numbers: checkedNumbers, type: 'products' });
  };

  const deleteProduct = (number: number) => {
    const targetProduct = watchedProduct?.find((product) => product.number === number);
    if (targetProduct && !confirmDelete([targetProduct.salesQuantity])) return;
    targetProduct && deleteData({ uid, numbers: [number], type: 'products' });
  };

  const handleProductNames = (data: IProductManagement) => {
    const productNames = data?.products?.map((product) => product.name);
    const duplicatedProducts = validator.validateDuplicatedNames(productNames).join(',');
    if (duplicatedProducts.length) {
      setError('namesError', { type: 'manual', message: ERROR_MESSAGES.duplicatedName + duplicatedProducts });
      return false;
    }
    return true;
  };

  const handleBarcodes = (data: IProductManagement) => {
    const barcodes = data?.products?.map((product) => product.barcode);
    const duplicatedBarcodes = validator.validateBarcodes(barcodes).filter((barcode) => barcode !== '');
    const duplicatedProducts = data?.products
      .filter((product) => duplicatedBarcodes.includes(product.barcode))
      .map((product) => product.name)
      .join(',');
    if (duplicatedProducts.length) {
      setError('barcodesError', { type: 'manual', message: ERROR_MESSAGES.duplicatedBarcode + duplicatedProducts });
      return false;
    }
    return true;
  };

  const handleCheckedProducts = (e: React.FormEvent<HTMLSelectElement>) => {
    const option = e.currentTarget.value;
    const checked = watchedProduct.some((product) => product.checked);
    if (!checked) return alert(ERROR_MESSAGES.selectProduct);
    if (option === SELECTED_MANAGEMENT_OPTIONS.show || option === SELECTED_MANAGEMENT_OPTIONS.hide)
      handleDisplay(option);
    if (option === SELECTED_MANAGEMENT_OPTIONS.changeCategory) showSelectCategory();
    if (option === SELECTED_MANAGEMENT_OPTIONS.delete) deleteCheckedProduct();
  };

  const handleDisplay = (option: string) => {
    const ok = confirm(CONFIRM_MESSAGES.changeSelectedProductDisplay);
    ok &&
      fields.forEach((field, index) => {
        if (watchedProduct[index].checked) {
          setValue(`products.${index}.display`, option);
        }
      });
    uncheckEverything();
  };

  const showSelectCategory = () => {
    const ok = confirm(CONFIRM_MESSAGES.changeSelectedProductCategory);
    ok && setCategorySelectDisplay(true);
  };

  const turnOffSelectCategory = () => {
    uncheckEverything();
    setCategorySelectDisplay(false);
  };

  const handleCategorySubmit = () => {
    const targetIndexArray = watchedProduct
      .map((product, index) => {
        if (product.checked) return index;
        return undefined;
      })
      .filter((index) => index !== undefined);
    targetIndexArray.forEach((index) => setValue(`products.${index}.category`, selectedCategory));
    turnOffSelectCategory();
  };

  return (
    <>
      <Background />
      <FormProvider {...methods}>
        <BigModalComponent onSubmit={handleSubmit(onSubmit)}>
          {categorySelectDisplay ? (
            <>
              <CategorySelectBackground />
              <CategorySelectContainer>
                <CategorySelect
                  defaultValue={categories?.[0].number}
                  onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                    setSelectedCategory(+e.currentTarget.value);
                  }}
                >
                  {categories?.map((category) => {
                    return (
                      <option key={category.number} value={category.number}>
                        {category.name}
                      </option>
                    );
                  })}
                </CategorySelect>
                <SubmitButtonsContainer>
                  <SubmitButton type="button" onClick={handleCategorySubmit}>
                    확인
                  </SubmitButton>
                  <button onClick={turnOffSelectCategory}>취소</button>
                </SubmitButtonsContainer>
              </CategorySelectContainer>
            </>
          ) : null}
          <BigModalContainer>
            <div>
              <h2>상품관리</h2>
            </div>
            <ManagementButtonsContainer>
              <select
                onChange={(e: React.FormEvent<HTMLSelectElement>) => {
                  handleCheckedProducts(e);
                  e.currentTarget.value = 'default';
                }}
              >
                <option value="default" hidden>
                  선택한 상품 수정하기
                </option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.delete}>선택한 상품 삭제</option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.show}>선택한 상품 전시</option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.hide}>선택한 상품 숨기기</option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.changeCategory}>선택한 상품 카테고리 변경</option>
              </select>
              <select onChange={(e: React.FormEvent<HTMLSelectElement>) => setCategoryCriteria(+e.currentTarget.value)}>
                <option value={0}>전체카테고리</option>
                {categories?.map((category, index) => (
                  <option key={index} value={category.number}>
                    {category.name}
                  </option>
                ))}
              </select>
              <select onChange={(e: React.FormEvent<HTMLSelectElement>) => setDisplayCriteira(e.currentTarget.value)}>
                <option value={DISPLAY_OPTIONS.all}>전체 전시 상태</option>
                <option value={DISPLAY_OPTIONS.show}>전시</option>
                <option value={DISPLAY_OPTIONS.hide}>숨김</option>
              </select>
              <button type="button" onClick={onSearchClick}>
                검색
              </button>
            </ManagementButtonsContainer>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <th>
                      <input type="checkbox" onChange={onCheck} checked={isAllChecked} />
                    </th>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>바코드</th>
                    <th>카테고리</th>
                    <th>전시여부</th>
                    <th>판매량</th>
                    <th>삭제</th>
                  </tr>
                </TableHeader>
                <tbody>
                  {fields.map((field, index) => (
                    <ProductManagementRow
                      key={field.id}
                      field={field}
                      index={index}
                      remove={deleteProduct}
                      categories={categories ?? []}
                      removable={false}
                    />
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </BigModalContainer>
          <ErrorMessage className="big">{errors?.namesError && errors?.namesError?.message}</ErrorMessage>
          <ErrorMessage className="big">{errors?.barcodesError && errors?.barcodesError?.message}</ErrorMessage>
          <ErrorMessage className="big">{errors?.otherError && errors?.otherError?.message}</ErrorMessage>
          <SubmitButtonsContainer>
            <SubmitButton type="submit" onClick={() => clearErrors(['namesError', 'barcodesError'])}>
              확인
            </SubmitButton>
            <CancelButton></CancelButton>
          </SubmitButtonsContainer>
        </BigModalComponent>
      </FormProvider>
    </>
  );
}
