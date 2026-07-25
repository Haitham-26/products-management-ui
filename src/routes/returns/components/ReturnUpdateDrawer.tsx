import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Trans, useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { faReceipt } from "@fortawesome/free-solid-svg-icons/faReceipt";

import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useAppToast } from "../../../components/toast/useAppToast";
import type { GetReturnsDto } from "../../../model/return/dto/GetReturnsDto";
import { returnActions } from "../../../redux/return/returns.slice";
import { buildReturnsParams } from "../utils/returnUtils";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { stringWithCurrencyCode } from "../../../utils/String";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { ReturnItemReadCard } from "./ReturnItemReadCard";
import type { Return } from "../../../model/return/types/Return";
import type { UpdateReturnDto } from "../../../model/return/dto/UpdateReturnDto";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FormSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const OrderItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  p {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ItalicSpan = styled.span`
  font-style: italic;
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-top: ${({ theme }) => theme.spacing.xs};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

type ReturnUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  filters: Partial<GetReturnsDto>;
  returnRecord: Return;
};

export const ReturnUpdateDrawer: React.FC<ReturnUpdateDrawerProps> = ({
  open = false,
  onClose,
  filters,
  returnRecord,
}) => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const { control, handleSubmit, getValues, reset } =
    useForm<UpdateReturnDto>();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onUpdate = async () => {
    try {
      setLoading(true);

      const dto = getValues();

      await dispatch(returnActions.updateReturn(dto)).unwrap();

      setSearchParams(buildReturnsParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
      Toast.success(t("returns.edit.success"));
    } catch (e) {
      Toast.apiError(e);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && returnRecord) {
      reset({
        returnId: returnRecord._id,
        returnReason: returnRecord.returnReason,
      });
    }
  }, [open, returnRecord, reset]);

  if (!returnRecord) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title={`${t("returns.edit.title")} - ${returnRecord.orderIdentifier}`}
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onUpdate)}
          editMode
        />
      }
    >
      <FormContainer>
        <FormSection>
          <SectionLabel>
            <Icon icon={faBook} />
            <Text>{t("returns.create-edit.reason.title")}</Text>
          </SectionLabel>

          <Controller
            control={control}
            name="returnReason"
            rules={{ required: t("errors.general.required") }}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                title={t("returns.create-edit.reason.input.title")}
                required
                valid={!error}
                errorMessage={error?.message}
                {...field}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faReceipt} />
            <Text>
              <Trans
                i18nKey={"returns.edit.items.title"}
                components={[<ItalicSpan />]}
              />
            </Text>
          </SectionLabel>

          <OrderItemsWrapper>
            {returnRecord.items.map((item) => (
              <ReturnItemReadCard item={item} key={item.productId} />
            ))}
          </OrderItemsWrapper>

          <SummaryBox>
            <SummaryRow>
              <Text color="textSecondary">
                {t("returns.fields.totalReturnRevenue")}
              </Text>
              <Text fontWeight="600" color={"error"}>
                {stringWithCurrencyCode(
                  settings.currency,
                  returnRecord.totalReturnRevenue,
                )}
              </Text>
            </SummaryRow>

            <SummaryRow>
              <Text color="textSecondary">
                {t("returns.fields.totalReturnProfit")}
              </Text>
              <Text color={"error"} fontWeight="600">
                {stringWithCurrencyCode(
                  settings.currency,
                  returnRecord.totalReturnProfit,
                )}
              </Text>
            </SummaryRow>
          </SummaryBox>
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
