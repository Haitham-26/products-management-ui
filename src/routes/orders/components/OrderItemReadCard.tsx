import type React from "react";
import { useTranslation } from "react-i18next";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { ProductMainImage } from "../../products/components/ProductMainImage";
import { Text } from "../../../components/Text";
import type { Order } from "../../../model/order/types/Order";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import styled from "styled-components";
import { Breakpoints } from "../../../theme/Breakpoints";

const ItemRow = styled.div<{ muted?: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
  opacity: ${({ muted }) => (muted ? 0.7 : 1)};
`;

const QuantityBadge = styled.div<{ $hasReturn?: boolean }>`
  position: absolute;
  top: 0;
  inset-inline-start: 0;

  html[dir="rtl"] & {
    transform: translate(50%, -50%);
  }

  html[dir="ltr"] & {
    transform: translate(-50%, -50%);
  }

  background: ${({ theme, $hasReturn }) =>
    $hasReturn ? theme.colors.warning : theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};

  min-width: 1.5rem;
  height: 1.5rem;
  padding: 0 4px;
  border-radius: ${({ theme }) => theme.radius.full};

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: ${({ theme }) => `calc(${theme.typography.small} / 1.2)`};
  font-weight: 600;
  letter-spacing: -1px;
`;

const ItemContent = styled.div`
  flex: 1;
  min-width: 0;

  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${Breakpoints.SM}) {
    flex-direction: column;
    gap: ${({ theme }) => theme.spacing.sm};
  }
`;

const ItemMain = styled.div`
  flex: 1;
  min-width: 0;

  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const ItemTotals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: center;
  gap: 2px;
  white-space: nowrap;

  @media (max-width: ${Breakpoints.SM}) {
    align-items: flex-start;
    padding-top: ${({ theme }) => theme.spacing.xs};
    border-top: 1px dashed ${({ theme }) => theme.colors.border};
  }
`;

const StrikethroughText = styled(Text)`
  text-decoration: line-through;
`;

type OrderItemReadCardProps = {
  item: OrderItem;
  order: Order;
};

export const OrderItemReadCard: React.FC<OrderItemReadCardProps> = ({
  item,
  order,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const returnedQuantity =
    (order.returnedItems ?? []).find((r) => r.productId === item.productId)
      ?.returnedQuantity ?? 0;

  const hasReturn = returnedQuantity > 0;
  const netQuantity = Math.max(0, item.quantity - returnedQuantity);
  const isFullyReturned = hasReturn && netQuantity === 0;

  const originalLineTotal = item.finalSalePriceAtPurchase * item.quantity;
  const netLineTotal = item.finalSalePriceAtPurchase * netQuantity;

  const netLineProfit = item.profitAtPurchase * netQuantity;

  return (
    <ItemRow muted={isFullyReturned}>
      <QuantityBadge $hasReturn={hasReturn}>
        {hasReturn ? `${netQuantity}/${item.quantity}` : item.quantity}
      </QuantityBadge>

      <ProductMainImage
        url={item.productMainImage}
        width="4rem"
        borderRadius="md"
      />

      <ItemContent>
        <ItemMain>
          <Text fontWeight="600">{item.productName}</Text>

          <Text color="textSecondary" fontSize="small">
            {t(
              `orders.general.items.item.price${
                item.discountAtPurchase?.value ? "WithDiscount" : ""
              }`,
              {
                price: stringWithCurrencyCode(
                  settings.currency,
                  item.finalSalePriceAtPurchase,
                ),
                discount:
                  item.discountAtPurchase?.type === "PERCENTAGE"
                    ? `${item.discountAtPurchase.value}%`
                    : stringWithCurrencyCode(
                        settings.currency,
                        item.discountAtPurchase?.value,
                      ),
              },
            )}
          </Text>

          {hasReturn ? (
            <Text color="warning" fontSize="small" fontWeight="600">
              {isFullyReturned
                ? t("orders.general.items.item.fullyReturned")
                : t("orders.general.items.item.returned", {
                    count: returnedQuantity,
                  })}
            </Text>
          ) : null}
        </ItemMain>

        <ItemTotals>
          {hasReturn ? (
            <StrikethroughText color="textSecondary" fontSize="small">
              {stringWithCurrencyCode(settings.currency, originalLineTotal)}
            </StrikethroughText>
          ) : null}

          <Text
            fontWeight="600"
            color={isFullyReturned ? "textSecondary" : undefined}
          >
            {stringWithCurrencyCode(settings.currency, netLineTotal)}
          </Text>

          <Text
            color={
              isFullyReturned
                ? "textSecondary"
                : netLineProfit > 0
                  ? "success"
                  : "error"
            }
            fontSize="small"
            fontWeight={hasReturn ? "600" : "regular"}
          >
            {t("orders.general.items.item.profit", {
              totalProfit: `${
                netLineProfit > 0 ? "+" : ""
              }${stringWithCurrencyCode(settings.currency, netLineProfit)}`,
            })}
          </Text>
        </ItemTotals>
      </ItemContent>
    </ItemRow>
  );
};
