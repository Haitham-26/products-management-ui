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
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small};
`;

const StyledButton = styled(Button)`
  width: 2rem;
  height: 2rem;
  margin-inline-start: auto;
  margin-top: ${({ theme }) => theme.spacing.md};
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
            {"Item's quantity in the order"}: {maxAllowedReturnCount}
          </Text>
        </ItemInfo>
      </InfoContainer>

      <ItemInputs>
        <Controller
          control={control}
          name={`items.${index}.totalReturnedCount`}
          rules={{
            required: true,
            min: {
              value: 1,
              message: "Return quantity must be at least 1.",
            },
            max: {
              value: maxAllowedReturnCount,
              message: `Return quantity must be less than or equal to the item's quantity in the order (${maxAllowedReturnCount}).`,
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              title="Total return quantity"
              info="The total quantity of this item that should be returned (It includes the restocked quantity)."
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
              errorMessage={totalReturnedCountError?.message}
            />
          )}
        />

        <Controller
          control={control}
          name={`items.${index}.restockedCount`}
          rules={{
            required: true,
            min: {
              value: 0,
              message: "Restock quantity must be at least 0.",
            },
            max: {
              value: watchedItem.totalReturnedCount,
              message: `Restock quantity must be less than or equal to the total return quantity (${watchedItem.totalReturnedCount}).`,
            },
          }}
          render={({ field: { value, onChange } }) => (
            <Input
              title="Restock quantity"
              info="The quantity that should be added back to the product's quantity (if the product exists)."
              min={0}
              max={watchedItem.totalReturnedCount}
              value={value}
              onChange={(val) => onChange(val ?? 0)}
              type="number"
              valid={!restockedCountError}
              errorMessage={restockedCountError?.message}
            />
          )}
        />

        <Tooltip title={t("common.remove")}>
          <StyledButton variant="danger" icon={faTrashCan} onClick={onRemove} />
        </Tooltip>
      </ItemInputs>

      {hasError ? (
        totalReturnedCountError ? (
          <ErrorText>* {totalReturnedCountError.message}</ErrorText>
        ) : restockedCountError ? (
          <ErrorText>* {restockedCountError.message}</ErrorText>
        ) : null
      ) : null}
    </ItemRow>
  );
};
