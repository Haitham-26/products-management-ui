import type React from "react";
import { Input } from "../../../components/Input";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons/faTrashCan";
import { Button } from "../../../components/Button";
import { Text } from "../../../components/Text";
import { useTranslation } from "react-i18next";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { ProductMainImage } from "../../products/components/ProductMainImage";
import { Controller, useFormContext } from "react-hook-form";
import styled from "styled-components";
import type { CreateReturnDto } from "../../../model/return/dto/CreateReturnDto";
import { Tooltip } from "antd";
import { Breakpoints } from "../../../theme/Breakpoints";

const ItemRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const InfoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ItemInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
`;

const ItemInputs = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${Breakpoints.SM}) {
    flex-direction: row;
  }
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small};
  margin-top: -${({ theme }) => theme.spacing.xs};
`;

const StyledButton = styled(Button)`
  width: 2rem;
  height: 2rem;
  padding-inline: ${({ theme }) => theme.spacing.md};
  margin-inline-start: auto;
`;

const SmallScreenButton = styled(StyledButton)`
  @media (min-width: ${Breakpoints.SM}) {
    display: none;
  }
`;

const LargeScreenButton = styled(StyledButton)`
  margin-top: auto;

  @media (max-width: ${Breakpoints.SM}) {
    display: none;
  }
`;

type ReturnCreateItemProps = {
  orderItem: OrderItem;
  index: number;
  onRemove: VoidFunction;
};

export const ReturnCreateItem: React.FC<ReturnCreateItemProps> = ({
  orderItem,
  index,
  onRemove,
}) => {
  const { t } = useTranslation();
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<CreateReturnDto>();

  if (!orderItem) {
    return null;
  }
  const watchedItem = watch(`items.${index}`);

  const maxAllowedReturnCount = orderItem.quantity;

  const totalReturnedCountError = errors.items?.[index]?.totalReturnedCount;
  const restockedCountError = errors.items?.[index]?.restockedCount;

  const hasError = totalReturnedCountError || restockedCountError;

  return (
    <ItemRow>
      <InfoContainer>
        {!orderItem.productMainImage ? (
          <ProductMainImage url={orderItem.productMainImage} width={"3rem"} />
        ) : null}

        <ItemInfo>
          <Text fontWeight="600">{orderItem.productName}</Text>
          <Text color="textSecondary" fontSize="small">
            {t("returns.create-edit.order.items.item.originalQty", {
              qty: orderItem.quantity,
            })}
          </Text>
        </ItemInfo>
      </InfoContainer>

      <ItemInputs>
        <Controller
          control={control}
          name={`items.${index}.totalReturnedCount`}
          rules={{
            required: t("errors.general.required"),
            min: {
              value: 1,
              message: t(
                "returns.create-edit.order.items.item.totalReturnQty.errors.min",
                { min: 1 },
              ),
            },
            max: {
              value: maxAllowedReturnCount,
              message: t(
                "returns.create-edit.order.items.item.totalReturnQty.errors.max",
                { max: maxAllowedReturnCount },
              ),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              title={t(
                "returns.create-edit.order.items.item.totalReturnQty.title",
              )}
              info={t(
                "returns.create-edit.order.items.item.totalReturnQty.info",
              )}
              min={1}
              max={maxAllowedReturnCount}
              value={value}
              onChange={(e) => {
                const numericValue = Number(e.target.value);

                const newValue = Math.min(numericValue, maxAllowedReturnCount);

                onChange(newValue);

                if (watchedItem.restockedCount > newValue) {
                  setValue(`items.${index}.restockedCount`, newValue);
                }
              }}
              type="number"
              valid={!totalReturnedCountError}
              required
            />
          )}
        />

        <Controller
          control={control}
          name={`items.${index}.restockedCount`}
          rules={{
            required: t("errors.general.required"),
            min: {
              value: 0,
              message: t(
                "returns.create-edit.order.items.item.restockQty.errors.min",
                { min: 0 },
              ),
            },
            max: {
              value: watchedItem.totalReturnedCount,
              message: t(
                "returns.create-edit.order.items.item.restockQty.errors.max",
                { max: watchedItem.totalReturnedCount },
              ),
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              title={t("returns.create-edit.order.items.item.restockQty.title")}
              info={t("returns.create-edit.order.items.item.restockQty.info")}
              min={0}
              max={watchedItem.totalReturnedCount}
              value={value}
              onChange={(e) => onChange(Number(e.currentTarget.value ?? 0))}
              type="number"
              valid={!restockedCountError}
            />
          )}
        />

        <Tooltip title={t("common.remove")}>
          <LargeScreenButton
            variant="danger"
            icon={faTrashCan}
            onClick={onRemove}
          />
        </Tooltip>
      </ItemInputs>

      {hasError ? (
        totalReturnedCountError ? (
          <ErrorText>* {totalReturnedCountError.message}</ErrorText>
        ) : restockedCountError ? (
          <ErrorText>* {restockedCountError.message}</ErrorText>
        ) : null
      ) : null}

      <Tooltip title={t("common.remove")}>
        <SmallScreenButton
          variant="danger"
          icon={faTrashCan}
          onClick={onRemove}
        />
      </Tooltip>
    </ItemRow>
  );
};
