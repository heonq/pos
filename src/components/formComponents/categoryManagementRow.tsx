import React from 'react';
import { ICategoryTableRowProps } from '../../Interfaces/PropsInterfaces';
import { ICategoryManagement, ICategoryMGMTForm } from '../../Interfaces/DataInterfaces';
import { Controller, useFormContext } from 'react-hook-form';
import { ERROR_MESSAGES } from '../../constants/enums';
import validator from '../../utils/validator';
import { ErrorMessage } from './FormContainerComponents';

export const CategoryManagementRow = ({ field, index, remove }: ICategoryTableRowProps<ICategoryMGMTForm>) => {
  const {
    register,
    formState: { errors },
    control,
    setValue,
  } = useFormContext<ICategoryManagement>();

  const handleCheckBoxChange = (checked: boolean) => {
    setValue(`categories.${index}.checked`, checked);
  };

  return (
    <tr key={index}>
      <td>
        <Controller
          name={`categories.${index}.checked`}
          control={control}
          defaultValue={field.checked}
          render={({ field: { onChange, value } }) => (
            <input
              type="checkbox"
              checked={value}
              onChange={(e) => {
                onChange(e.target.checked);
                handleCheckBoxChange(e.target.checked);
              }}
            />
          )}
        />
      </td>
      <td>
        <input
          type="text"
          {...register(`categories.${index}.name`, {
            required: ERROR_MESSAGES.blankName,
            validate: (value: string) => {
              if (!validator.validateBlankName(value)) return ERROR_MESSAGES.blankName;
              if (!validator.validateNameTrim(value)) return ERROR_MESSAGES.trimName;
            },
          })}
          defaultValue={field.name}
        />
        <ErrorMessage>{errors?.categories?.[index] && errors?.categories?.[index]?.name?.message}</ErrorMessage>
      </td>
      <td>
        <select {...register(`categories.${index}.display`)} defaultValue={field.display}>
          <option value="전시">전시</option>
          <option value="숨김">숨김</option>
        </select>
      </td>
      <td>
        <button type="button" onClick={() => remove(field.number)}>
          삭제
        </button>
      </td>
    </tr>
  );
};
