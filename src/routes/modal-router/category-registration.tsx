import { FormProvider, useFieldArray, useForm } from 'react-hook-form';
import {
  ErrorMessage,
  ModalHeader,
  PlusRowButtonContainer,
  SmallModalContainer,
  Table,
  TableContainer,
  TableHeader,
} from '../../components/formComponents/FormContainerComponents';
import {
  Background,
  CancelButton,
  SmallModalComponent,
  SubmitButton,
  SubmitButtonsContainer,
} from '../../components/Modal';
import { ICategory, ICategoryRegistration } from '../../Interfaces/DataInterfaces';
import { auth } from '../../firebase';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { setData } from '../../utils/fetchFunctions';
import { useNavigate } from 'react-router-dom';
import { CategoryRegistrationRow } from '../../components/formComponents/categoryRegistrationRow';
import validator from '../../utils/validator';
import { ERROR_MESSAGES } from '../../constants/enums';
import useProductsAndCategories from '../../hooks/useProductsAndCategories';
import QUERY_KEYS from '../../constants/queryKeys';
import { BUTTON_MESSAGES } from '../../constants/messages';

export default function CategoryRegistration() {
  const uid = auth.currentUser?.uid ?? '';
  const queryClient = useQueryClient();
  const { categories } = useProductsAndCategories(uid);
  const { mutate: mutateCategory, isPending } = useMutation({
    mutationFn: setData,
  });

  const methods = useForm<ICategoryRegistration>({
    defaultValues: {
      categories: [{ name: '', display: '전시' }],
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
  } = methods;
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'categories',
  });
  const navigate = useNavigate();

  const onSubmit = (data: ICategoryRegistration) => {
    const newestCategoryNumber = (categories && categories?.sort((a, b) => b.number - a.number)[0].number + 1) ?? 1;
    const categoryData = data.categories.map((category, index) => {
      return { ...category, display: category.display === '전시', number: newestCategoryNumber + index };
    });
    handleCategoriesNames(data) && handleSetCategories(categoryData);
  };

  const handleCategoriesNames = (data: ICategoryRegistration) => {
    const categoryNames = [...data.categories, ...(categories ?? [])].map((category) => category.name);
    const duplicatedCategoryNames = validator.validateDuplicatedNames(categoryNames).join(',');
    if (duplicatedCategoryNames.length) {
      setError('namesError', { type: 'manual', message: ERROR_MESSAGES.duplicatedName + duplicatedCategoryNames });
      return false;
    }
    return true;
  };

  const handleSetCategories = (data: ICategory[]) => {
    mutateCategory(
      { uid, data },
      {
        onSuccess: () => {
          queryClient.setQueryData([QUERY_KEYS.categories], (before: ICategory[]) => {
            return [...before, ...data];
          });
          navigate('/');
        },
        onError: (e) => {
          if (e instanceof Error) {
            setError('otherError', { type: 'manual', message: e.message });
          }
        },
      },
    );
  };

  return (
    <>
      <Background />
      <FormProvider {...methods}>
        <SmallModalComponent onSubmit={handleSubmit(onSubmit)}>
          <SmallModalContainer>
            <ModalHeader>
              <h2>카테고리 등록</h2>
            </ModalHeader>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <th>카테고리 이름</th>
                    <th>전시여부</th>
                    <th>삭제</th>
                  </tr>
                </TableHeader>
                <tbody>
                  {fields.map((field, index) => {
                    return (
                      <CategoryRegistrationRow
                        key={field.id}
                        field={field}
                        index={index}
                        remove={remove}
                        removable={fields.length > 1}
                      ></CategoryRegistrationRow>
                    );
                  })}
                </tbody>
              </Table>
              <PlusRowButtonContainer>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      display: '전시',
                    })
                  }
                >
                  +
                </button>
              </PlusRowButtonContainer>
            </TableContainer>
          </SmallModalContainer>
          <ErrorMessage className="big">{errors?.namesError && errors?.namesError.message}</ErrorMessage>
          <ErrorMessage className="big"></ErrorMessage>
          <SubmitButtonsContainer>
            <SubmitButton disabled={isPending} onClick={() => clearErrors(['namesError', 'otherError'])}>
              {isPending ? BUTTON_MESSAGES.pending : BUTTON_MESSAGES.cancel}
            </SubmitButton>
            <CancelButton />
          </SubmitButtonsContainer>
        </SmallModalComponent>
      </FormProvider>
    </>
  );
}
