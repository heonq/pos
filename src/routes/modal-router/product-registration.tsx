import styled from 'styled-components';
import { ModalComponent, Background, SubmitButtonsContainer } from '../../components/Modal';
import { useForm, useFieldArray, FormProvider } from 'react-hook-form';
import { useQuery } from 'react-query';
import { ICategory, IProduct, IProductRegistration } from '../../Interfaces/DataInterfaces';
import { addProduct, fetchCategories, fetchProducts } from '../../utils/fetchFunctions';
import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import validator from '../../utils/validator';
import { MESSAGES } from '../../Interfaces/enums';
import { Link, useNavigate } from 'react-router-dom';
import { ErrorMessage, ProductRegistrationTableRow } from '../../components/formComponents/productRegistrationRow';

const ProductRegistrationContainer = styled.div`
  height: 85%;
  width: 85%;
`;

const ProductRegistrationTableContainer = styled.div`
  height: 90%;
  width: 100%;
  overflow: auto;
`;

const ProductRegistrationTable = styled.table`
  border-spacing: 0;
  border-collapse: collapse;
  input {
    height: 25px;
    border-radius: 5px;
    padding: 0;
    padding-left: 10px;
    padding-right: 10px;
  }
  th,
  td {
    min-width: 100px;
    padding: 10px;
    border-top: solid;
    border-color: rgb(200, 200, 200);
    text-align: center;
    border-bottom: none;
  }
`;

const ProductRegstrationHeader = styled.thead`
  position: sticky;
  top: 0;
  background-color: white;
  box-shadow: 0 5px 5px rgba(0, 0, 0, 0.1);
  outline: 1px solid transparent;
  font-weight: 700;
  th {
    height: 30px;
    border-style: none;
    box-sizing: border-box;
  }
`;

const PlusRowButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  button {
    margin-top: 20px;
    margin-bottom: 20px;
    width: 35px;
    height: 35px;
    border-radius: 35px;
    border-style: none;
    font-size: 20px;
  }
`;

export default function ProductRegistration() {
  const [removable, setRemovable] = useState(false);
  const uid = auth.currentUser?.uid ?? '';
  const { data: products, refetch: productRefetch } = useQuery<IProduct[]>('products', () => fetchProducts(uid));

  const { data: categories } = useQuery<ICategory[]>('categories', () => fetchCategories(uid));

  const methods = useForm<IProductRegistration>({
    defaultValues: {
      products: [
        { name: '', price: 0, barcode: '', category: categories?.[0].number.toString() ?? '', display: '전시' },
      ],
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

  useEffect(() => {
    fields.length > 1 ? setRemovable(true) : setRemovable(false);
  }, [fields.length]);

  const onSubmit = (data: IProductRegistration) => {
    if (handleProductNames(data) && handleProductBarcodes(data)) {
      handleProductSubmit(data);
    }
  };

  const handleProductSubmit = async (data: IProductRegistration) => {
    const productNumber = (products && [...products].sort((a, b) => b.number - a.number)[0].number + 1) || 1;
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
    newProducts.forEach((product) => addProduct(uid, product));
    navigate('/');
    productRefetch();
  };

  const handleProductNames = (data: IProductRegistration) => {
    const productNames = products?.map((product) => product.name) ?? [];
    const registeringNames = data?.products?.map((product) => product.name);
    const duplicatedNames = validator.validateDuplicatedNames([...productNames, ...registeringNames]);
    if (duplicatedNames.length) {
      setError('namesError', { type: 'manual', message: MESSAGES.duplicatedName + duplicatedNames.join(',') });
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
        message: MESSAGES.duplicatedBarcode + [...new Set(duplicatedProducts)]?.join(','),
      });
      return false;
    }
    return true;
  };

  return (
    <>
      <Background />
      <FormProvider {...methods}>
        <ModalComponent className="big" onSubmit={handleSubmit(onSubmit)}>
          <ProductRegistrationContainer>
            <div>
              <h2>상품등록</h2>
            </div>
            <ProductRegistrationTableContainer>
              <ProductRegistrationTable>
                <ProductRegstrationHeader>
                  <tr>
                    <th>상품명</th>
                    <th>가격</th>
                    <th>바코드</th>
                    <th>카테고리</th>
                    <th>전시여부</th>
                    <th>삭제</th>
                  </tr>
                </ProductRegstrationHeader>
                <tbody>
                  {fields.map((field, index) => (
                    <ProductRegistrationTableRow
                      key={field.id}
                      field={field}
                      index={index}
                      remove={remove}
                      categories={categories ?? []}
                      removable={removable}
                    />
                  ))}
                </tbody>
              </ProductRegistrationTable>
              <PlusRowButtonContainer>
                <button
                  type="button"
                  onClick={() =>
                    append({
                      name: '',
                      price: 0,
                      barcode: '',
                      category: categories?.[0].number.toString()!,
                      display: '전시',
                    })
                  }
                >
                  +
                </button>
              </PlusRowButtonContainer>
            </ProductRegistrationTableContainer>
          </ProductRegistrationContainer>
          <ErrorMessage className="big">{errors?.namesError && errors?.namesError?.message}</ErrorMessage>
          <ErrorMessage className="big">{errors?.barcodeError && errors?.barcodeError?.message}</ErrorMessage>
          <SubmitButtonsContainer>
            <button onClick={() => clearErrors(['barcodeError', 'namesError'])} type="submit" className="submit">
              확인
            </button>
            <Link to="/">
              <button>취소</button>
            </Link>
          </SubmitButtonsContainer>
        </ModalComponent>
      </FormProvider>
    </>
  );
}
