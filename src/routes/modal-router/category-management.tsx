/* eslint-disable no-restricted-globals */
import styled from 'styled-components';
import { ModalComponent, Background, SubmitButtonsContainer, SubmitButton, CancelButton } from '../../components/Modal';
import {
  SmallModalContainer,
  Table,
  TableContainer,
  TableHeader,
} from '../../components/formComponents/FormContainerComponents';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ICategory, ICategoryManagement, IProduct } from '../../Interfaces/DataInterfaces';
import { deleteData, fetchCategories, fetchProducts, updateChangedData } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import { CategoryManagementRow } from '../../components/formComponents/categoryManagementRow';
import { CONFIRM_MESSAGES, DISPLAY_OPTIONS, ERROR_MESSAGES, SELECTED_MANAGEMENT_OPTIONS } from '../../constants/enums';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import validator from '../../utils/validator';

const SelectedManagingButtonContainer = styled.div`
  display: flex;
  justify-content: end;
`;

export default function CategoryManagement() {
  const [isAllChecked, setAllChecked] = useState(false);
  const uid = auth.currentUser?.uid ?? '';
  const productData = useQuery<IProduct[]>('products', () => fetchProducts(uid));
  const products = productData.data ?? [];
  const categoryData = useQuery<ICategory[]>('categories', () => fetchCategories(uid));
  const categories = categoryData.data ?? [];
  const categoryRefetch = categoryData.refetch;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const mutation = useMutation(updateChangedData, {
    onSuccess: () => {
      queryClient.invalidateQueries('categories');
    },
  });

  const methods = useForm<ICategoryManagement>({
    defaultValues: {
      categories: categories.map((category) => {
        return {
          checked: false,
          number: category.number,
          display: category.display ? DISPLAY_OPTIONS.show : DISPLAY_OPTIONS.hide,
          name: category.name,
        };
      }),
    },
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    control,
    setError,
    formState: { errors },
    clearErrors,
    handleSubmit,
    watch,
    setValue,
  } = methods;
  const { fields } = useFieldArray({
    control,
    name: `categories`,
  });

  useEffect(() => {
    methods.reset({
      categories: categories.map((category) => ({
        checked: false,
        number: category.number,
        name: category.name,
        display: category.display ? DISPLAY_OPTIONS.show : DISPLAY_OPTIONS.hide,
      })),
    });
  }, [categories]);

  const watchedCategories = watch('categories');

  const onSubmit = (data: ICategoryManagement) => {
    handleData(data);
  };

  const getDataWithoutChecked = (data: ICategoryManagement) => {
    return data.categories.map((category) => {
      const newData = {
        ...category,
        display: category.display === DISPLAY_OPTIONS.show,
      };
      delete newData.checked;
      return newData;
    });
  };

  const findChanges = (original: ICategory, changed: ICategory): Partial<ICategory> => {
    const changes: Partial<ICategory> = {};
    const keys = Object.keys(changed);
    keys.forEach((key) => {
      if (original[key] !== changed[key]) {
        changes[key] = changed[key];
      }
    });
    return changes;
  };

  const handleData = (data: ICategoryManagement) => {
    const categoriesWithountChecked = getDataWithoutChecked(data);
    const changedArray = categoriesWithountChecked.map((category, index) => {
      return category && findChanges(categories[index], categoriesWithountChecked[index]);
    });
    const changedCategoryNumbers = changedArray
      .map((changed, index) => {
        if (changed && Object.keys(changed).length > 0) return watchedCategories[index].number;
        return undefined;
      })
      .filter((number): number is number => number !== undefined);
    const changedArrayFiltered = changedArray.filter(
      (changed): changed is Partial<ICategory> => changed !== undefined && Object.keys(changed).length > 0,
    );
    handleCategoryName(data) && updateData(changedCategoryNumbers, changedArrayFiltered);
  };

  const updateData = (changedCategoryNumbers: number[], changedArrayFiltered: Partial<ICategory>[]) => {
    try {
      if (changedArrayFiltered.length) {
        mutation.mutate({
          uid,
          numberArray: changedCategoryNumbers,
          changedData: changedArrayFiltered,
          type: 'categories',
        });
      }
      categoryRefetch();
      navigate('/');
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const onSelectOption = (option: SELECTED_MANAGEMENT_OPTIONS) => {
    const selectedNumbers = watchedCategories.filter((category) => category.checked).map((category) => category.number);
    const selectedIndexArray = watchedCategories
      .map((category, index) => {
        if (category.checked) return index;
        return -1;
      })
      .filter((number) => number !== -1);
    if (selectedNumbers.length < 1) return alert(ERROR_MESSAGES.SelectCategory);
    if (option === SELECTED_MANAGEMENT_OPTIONS.delete) deleteCheckedCategories(selectedNumbers);
    if (option === SELECTED_MANAGEMENT_OPTIONS.hide || option === SELECTED_MANAGEMENT_OPTIONS.show)
      handleCategoryDisplay(selectedIndexArray, option);
    setAllChecked(false);
  };

  const confirmDelete = (selectedNumbers: number[]) => {
    const ok = confirm(CONFIRM_MESSAGES.deleteSelectedCategory);
    if (!ok) return false;
    const categoriesWithProduct = [...new Set(products.map((product) => product.category))];
    if (selectedNumbers.some((category) => categoriesWithProduct.includes(category))) {
      alert(ERROR_MESSAGES.cantDeleteCategory);
      return false;
    }
    return true;
  };

  const deleteCheckedCategories = (selectedNumbers: number[]) => {
    if (!confirmDelete(selectedNumbers)) return;
    try {
      deleteData({ uid, numbers: selectedNumbers, type: 'categories' });
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const deleteCategory = (number: number) => {
    if (!confirmDelete([number])) return;
    try {
      deleteData({ uid, numbers: [number], type: 'categories' });
    } catch (e) {
      if (e instanceof Error) console.log(e.message);
    }
  };

  const handleCategoryDisplay = (selectedIndexArray: number[], option: SELECTED_MANAGEMENT_OPTIONS) => {
    if (!confirm(CONFIRM_MESSAGES.changeSelectedCategoryDisplay)) return;
    selectedIndexArray.forEach((number) => setValue(`categories.${number}.display`, option));
  };

  const onCheckAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.currentTarget.checked;
    setAllChecked(checked);
  };

  useEffect(() => {
    fields.forEach((_, index) => setValue(`categories.${index}.checked`, isAllChecked));
  }, [isAllChecked]);

  const handleCategoryName = (data: ICategoryManagement) => {
    const categoryNames = data?.categories?.map((category) => category.name);
    const duplicatedNames = validator.validateDuplicatedNames(categoryNames).join(',');
    if (duplicatedNames.length) {
      setError('namesError', { type: 'manual', message: ERROR_MESSAGES.duplicatedName + duplicatedNames });
      return false;
    }
    return true;
  };

  return (
    <>
      <Background />
      <FormProvider {...methods}>
        <ModalComponent className="small" onSubmit={handleSubmit(onSubmit)}>
          <SmallModalContainer>
            <div>
              <h2>카테고리 관리</h2>
            </div>
            <SelectedManagingButtonContainer>
              <select
                onChange={(e) => {
                  onSelectOption(e.currentTarget.value as SELECTED_MANAGEMENT_OPTIONS);
                  e.currentTarget.value = 'default';
                }}
              >
                <option value="default" hidden>
                  선택한 카테고리 수정
                </option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.delete}>선택한 카테고리 삭제</option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.show}>선택한 카테고리 전시</option>
                <option value={SELECTED_MANAGEMENT_OPTIONS.hide}>선택한 카테고리 숨기기</option>
              </select>
            </SelectedManagingButtonContainer>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <th>
                      <input onChange={onCheckAll} checked={isAllChecked} type="checkbox"></input>
                    </th>
                    <th>카테고리 이름</th>
                    <th>전시여부</th>
                    <th>삭제</th>
                  </tr>
                </TableHeader>
                <tbody>
                  {fields.map((field, index) => (
                    <CategoryManagementRow
                      key={index}
                      field={field}
                      index={index}
                      remove={deleteCategory}
                    ></CategoryManagementRow>
                  ))}
                </tbody>
              </Table>
            </TableContainer>
          </SmallModalContainer>
          <SubmitButtonsContainer>
            <SubmitButton>확인</SubmitButton>
            <CancelButton />
          </SubmitButtonsContainer>
        </ModalComponent>
      </FormProvider>
    </>
  );
}
