import React from 'react';
import { useFormContext } from 'react-hook-form';
import { ICategoryTableRowProps } from '../../Interfaces/PropsInterfaces';
import { ICategoryForm, ICategoryRegistration } from '../../Interfaces/DataInterfaces';
import { ERROR_MESSAGES } from '../../constants/enums';
import validator from '../../utils/validator';
import { ErrorMessage } from './FormContainerComponents';

export const CategoryRegistrationRow = ({ field, index, remove, removable }: ICategoryTableRowProps<ICategoryForm>) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<ICategoryRegistration>();

  return (
    <tr key={index}>
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
        <ErrorMessage>{errors?.categories && errors?.categories?.[index]?.name?.message}</ErrorMessage>
      </td>
      <td>
        <select {...register(`categories.${index}.display`, {})} defaultValue={field.display}>
          <option value="전시">전시</option>
          <option value="숨김">숨김</option>
        </select>
      </td>
      <td>
        <button type="button" onClick={() => removable && remove(index)}>
          삭제
        </button>
      </td>
    </tr>
  );
};
