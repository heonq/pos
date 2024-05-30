import { useFormContext } from 'react-hook-form';
import { IProductForm, IProductRegistration } from '../../Interfaces/DataInterfaces';
import { ITableRowProps } from '../../Interfaces/PropsInterfaces';
import { ERROR_MESSAGES } from '../../constants/enums';
import validator from '../../utils/validator';
import styled from 'styled-components';

export const ErrorMessage = styled.div`
  margin-top: 5px;
  font-size: 11px;
  color: red;
  &.big {
    font-size: 18px;
  }
`;

export const ProductRegistrationTableRow = ({
  field,
  index,
  remove,
  categories,
  removable,
}: ITableRowProps<IProductForm>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<IProductRegistration>();

  return (
    <tr key={index}>
      <td>
        <input
          type="text"
          {...register(`products.${index}.name`, {
            required: ERROR_MESSAGES.blankName,
            validate: (value: string) => {
              if (!validator.validateBlankName(value)) return ERROR_MESSAGES.blankName;
              if (!validator.validateNameTrim(value)) return ERROR_MESSAGES.trimName;
            },
          })}
          defaultValue={field.name}
        />
        <ErrorMessage>{errors?.products?.[index] && errors?.products?.[index]?.name?.message}</ErrorMessage>
      </td>
      <td>
        <input
          type="number"
          {...register(`products.${index}.price`, {
            required: ERROR_MESSAGES.shouldBeInt,
            validate: (value: number) => {
              if (!validator.validateInteger(value)) return ERROR_MESSAGES.shouldBeInt;
            },
          })}
          defaultValue={field.price}
        />
        <ErrorMessage>{errors?.products?.[index] && errors?.products?.[index]?.price?.message}</ErrorMessage>
      </td>
      <td>
        <input type="text" {...register(`products.${index}.barcode`)} defaultValue={field.barcode} />
      </td>
      <td>
        <select {...register(`products.${index}.category`)} defaultValue={field.category}>
          {categories.map((category, index) => (
            <option key={index} value={category.number}>
              {category.name}
            </option>
          ))}
        </select>
      </td>
      <td>
        <select {...register(`products.${index}.display`)} defaultValue={field.display}>
          <option value="전시">전시</option>
          <option value="숨김">숨김</option>
        </select>
      </td>
      <td>
        <button
          type="button"
          onClick={() => {
            if (removable) remove(index);
          }}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};
