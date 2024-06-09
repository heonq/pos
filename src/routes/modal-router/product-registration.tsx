import { Background, SubmitButtonsContainer, BigModalComponent } from '../../components/Modal';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useQueryClient, useMutation, useQuery } from 'react-query';
import { ICategory, IProduct, IProductRegistration } from '../../Interfaces/DataInterfaces';
import { getProducts, setData } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import validator from '../../utils/validator';
import { ERROR_MESSAGES } from '../../constants/enums';
import { Link, useNavigate } from 'react-router-dom';
import { ProductRegistrationTableRow } from '../../components/formComponents/productRegistrationRow';
import { ErrorMessage } from '../../components/formComponents/FormContainerComponents';
import {
  BigModalContainer,
  PlusRowButtonContainer,
  Table,
  TableContainer,
  TableHeader,
} from '../../components/formComponents/FormContainerComponents';
import { useResetRecoilState } from 'recoil';
import { shoppingCartSelector } from '../../atoms';

export default function ProductRegistration() {
  const uid = auth.currentUser?.uid ?? '';
  const queryClient = useQueryClient();
  const { data: products } = useQuery<IProduct[]>('products', () => getProducts(uid));
  const categories = queryClient.getQueryData<ICategory[]>('categories');
  const resetShoppingCart = useResetRecoilState(shoppingCartSelector);

  const methods = useForm<IProductRegistration>({
    defaultValues: {
      products: [{ name: '', price: 0, barcode: '', category: Number(categories?.[0].number), display: '전시' }],
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
    name: 'products',
  });
  const navigate = useNavigate();
  const mutation = useMutation(setData, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });

  const onSubmit = (data: IProductRegistration) => {
    if (handleProductNames(data) && handleProductBarcodes(data)) {
      handleProductSubmit(data);
    }
  };

  const handleProductSubmit = (data: IProductRegistration) => {
    const productNumber = (products?.length && [...products].sort((a, b) => b.number - a.number)[0].number + 1) ?? 1;
    const newProducts = data.products.map((product, index) => {
      return {
        ...product,
        number: index + productNumber,
        salesQuantity: 0,
        price: +product.price,
        category: +product.category,
        display: product.display === '전시',
      };
    });
    try {
      mutation.mutate({ uid, data: newProducts });
      navigate('/');
      resetShoppingCart();
    } catch (e) {
      if (e instanceof Error) {
        setError('otherError', { type: 'manual', message: e.message });
      }
    }
  };

  const handleProductNames = (data: IProductRegistration) => {
    const productNames = products?.map((product) => product.name) ?? [];
    const registeringNames = data?.products?.map((product) => product.name);
    const duplicatedNames = validator.validateDuplicatedNames([...productNames, ...registeringNames]);
    if (duplicatedNames.length) {
      setError('namesError', { type: 'manual', message: ERROR_MESSAGES.duplicatedName + duplicatedNames.join(',') });
      return false;
    }
    return true;
  };

  const handleProductBarcodes = (data: IProductRegistration) => {
    const productBarcodes = products?.map((product) => product.barcode) ?? [];
    const registeringBarcodes = data?.products?.map((product) => product.barcode);
    const duplicatedBarcodes = validator.validateBarcodes([...productBarcodes, ...registeringBarcodes]);
    const duplicatedProducts =
      products &&
      [...products, ...data?.products]
        .filter((product) => duplicatedBarcodes.includes(product?.barcode))
        .map((product) => product.name);
    if (duplicatedBarcodes.length) {
      setError('barcodeError', {
        type: 'manual',
        message: ERROR_MESSAGES.duplicatedBarcode + [...new Set(duplicatedProducts)]?.join(','),
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Background />
      <FormProvider {...methods}>
        <BigModalComponent onSubmit={handleSubmit(onSubmit)}>
          <BigModalContainer>
            <div>
              <h2>상품등록</h2>
            </div>
            <TableContainer>
              <Table>
                <TableHeader>
                  <tr>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>바코드</th>
                    <th>카테고리</th>
                    <th>전시여부</th>
                    <th>삭제</th>
                  </tr>
                </TableHeader>
                <tbody>
                  {fields.map((field, index) => (
                    <ProductRegistrationTableRow
                      key={field.id}
                      field={field}
                      index={index}
                      remove={remove}
                      categories={categories ?? []}
                      removable={fields.length > 1}
                    />
                  ))}
                </tbody>
              </Table>
              <PlusRowButtonContainer>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      price: 0,
                      barcode: '',
                      category: categories?.[0].number ?? 1,
                      display: '전시',
                    })
                  }
                >
                  +
                </button>
              </PlusRowButtonContainer>
            </TableContainer>
          </BigModalContainer>
          <ErrorMessage className="big">{errors?.namesError && errors?.namesError?.message}</ErrorMessage>
          <ErrorMessage className="big">{errors?.barcodeError && errors?.barcodeError?.message}</ErrorMessage>
          <ErrorMessage className="big">{errors?.otherError && errors?.otherError.message}</ErrorMessage>
          <SubmitButtonsContainer>
            <button onClick={() => clearErrors(['barcodeError', 'namesError'])} type="submit" className="submit">
              확인
            </button>
            <Link to="/">
              <button>취소</button>
            </Link>
          </SubmitButtonsContainer>
        </BigModalComponent>
      </FormProvider>
    </>
  );
}
