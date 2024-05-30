import React, { useEffect, useState } from 'react';
import { ModalComponent, Background, SubmitButton } from '../../components/Modal';
import styled from 'styled-components';
import { DISCOUNT_TYPE } from '../../constants/enums';
import { useRecoilValue, useSetRecoilState } from 'recoil';
import { paymentInfoSelector } from '../../atoms';
import formatter from '../../utils/formatter';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import { IDiscountForm } from '../../Interfaces/DataInterfaces';

const DiscountContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: center;
  height: 500px;
  font-size: 18px;
  line-height: 25px;
  margin-top: 50px;
`;

const SelectDiscountTypeSection = styled.div`
  display: flex;
`;

const DiscountInfoSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const DiscountInputSection = styled.div`
  position: relative;
  margin-top: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  span {
    position: absolute;
    right: 0px;
    height: 35px;
    font-size: 20px;
    line-height: 35px;
  }
`;

const DiscountValueInput = styled.input`
  height: 30px;
  width: 150px;
  border-width: 0.1px;
  font-size: 20px;
  text-align: right;
`;

const DiscountAmountSection = styled.div`
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const DiscountReasonSection = styled.div`
  margin-top: 50px;
  width: 300px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  input {
    height: 30px;
    width: 150px;
    border-width: 0.1px;
    font-size: 20px;
    text-align: right;
  }
`;

export default function DiscountModal() {
  const { register, handleSubmit, watch, setValue, control } = useForm<IDiscountForm>();
  const watchDiscountValue = watch('discountValue', 0);
  const watchNote = watch('note', '');
  const watchDiscountType = watch('discountType', DISCOUNT_TYPE.percentage);
  const [discountAmount, setDiscountAmount] = useState(0);
  const { totalAmount } = useRecoilValue(paymentInfoSelector);
  const [chargedAmount, setChargedAmount] = useState(totalAmount);
  const setPaymentInfo = useSetRecoilState(paymentInfoSelector);
  const navigate = useNavigate();

  const onSubmitClick = (data: IDiscountForm) => {
    setPaymentInfo((prev) => {
      const newNote = `할인 금액 : ${formatter.formatNumber(discountAmount)}원 할인 사유 : ${data.note}`;
      return { ...prev, ...data, method: '', discountAmount, chargedAmount, note: newNote };
    });
    navigate('/');
  };

  useEffect(() => {
    setValue('discountValue', 0);
  }, [watchDiscountType, setValue]);

  useEffect(() => {
    updateDiscountAmount();
    limitDiscountValue();
    setChargedAmount(totalAmount - discountAmount);
  }, [watchDiscountValue, watchDiscountType, totalAmount, discountAmount]);

  useEffect(() => {
    if (totalAmount === 0) navigate('/');
  }, [totalAmount, navigate]);

  const updateDiscountAmount = () => {
    const newDiscountAmount =
      watchDiscountType === DISCOUNT_TYPE.percentage
        ? Math.floor(watchDiscountValue * 0.01 * totalAmount)
        : watchDiscountValue;
    setDiscountAmount(newDiscountAmount);
  };

  const limitDiscountValue = () => {
    if (watchDiscountType === DISCOUNT_TYPE.percentage && watchDiscountValue > 100) setValue('discountValue', 100);
    if (watchDiscountType === DISCOUNT_TYPE.amount && watchDiscountValue > totalAmount)
      setValue('discountValue', totalAmount);
  };

  return (
    <>
      <Background />
      <ModalComponent className="small" onSubmit={handleSubmit(onSubmitClick)}>
        <DiscountContainer>
          <SelectDiscountTypeSection>
            <div>
              <input
                {...register('discountType')}
                type="radio"
                id="percentage-type"
                value={DISCOUNT_TYPE.percentage}
                defaultChecked
              />
              <label htmlFor="percentage-type">할인율 적용</label>
            </div>
            <div>
              <input {...register('discountType')} type="radio" id="amount-type" value={DISCOUNT_TYPE.amount} />
              <label htmlFor="amount-type">금액 적용</label>
            </div>
          </SelectDiscountTypeSection>
          <DiscountInfoSection>
            <DiscountInputSection>
              <Controller
                name="discountValue"
                control={control}
                render={({ field }) => (
                  <DiscountValueInput {...field} onChange={(e) => field.onChange(+e.currentTarget.value)} />
                )}
              />
              <span>{watchDiscountType === DISCOUNT_TYPE.percentage ? '%' : '원'}</span>
            </DiscountInputSection>
            <DiscountAmountSection>
              <span>할인 전 금액 : {formatter.formatNumber(totalAmount)}원</span>
              <span>할인 금액 : {formatter.formatNumber(discountAmount)}원</span>
              <span>할인 후 금액 : {formatter.formatNumber(totalAmount - discountAmount)}원</span>
            </DiscountAmountSection>
            <DiscountReasonSection>
              <div>할인 사유</div>
              <input
                {...register('note')}
                type="text"
                onChange={(e: React.FormEvent<HTMLInputElement>) => setValue('note', e.currentTarget.value)}
                value={watchNote}
              />
            </DiscountReasonSection>
          </DiscountInfoSection>
          <SubmitButton type="submit" disabled={watchNote === '' || watchDiscountValue === 0} />
        </DiscountContainer>
      </ModalComponent>
    </>
  );
}
