import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { IProductManagement, IProductMGMTForm } from '../../Interfaces/DataInterfaces';
import { ITableRowProps } from '../../Interfaces/PropsInterfaces';
import { ERROR_MESSAGES } from '../../constants/enums';
import validator from '../../utils/validator';
import { ErrorMessage } from './FormContainerComponents';

export const ProductManagementRow = ({ field, index, remove, categories }: ITableRowProps<IProductMGMTForm>) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<IProductManagement>();

  const handleCheckboxChange = (checked: boolean) => {
    setValue(`products.${index}.checked`, checked);
  };

  return (
    <tr key={index}>
      <td>
        <Controller
          name={`products.${index}.checked`}
          control={control}
          defaultValue={field.checked}
          render={({ field: { onChange, value } }) => (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked);
                handleCheckboxChange(e.target.checked);
              }}
            />
          )}
        />
      </td>
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
      <td>{field.salesQuantity}</td>
      <td>
        <button
          type="button"
          onClick={() => {
            remove(field.number);
          }}
        >
          삭제
        </button>
      </td>
    </tr>
  );
};
