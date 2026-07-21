import type React from "react";
import { useTranslation } from "react-i18next";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { ProductMainImage } from "../../products/components/ProductMainImage";
import { Text } from "../../../components/Text";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import styled from "styled-components";

const ItemRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.background};
  position: relative;
`;

const QuantityBadge = styled.div`
  position: absolute;
  top: 0;
  inset-inline-start: 0;
  html[dir="rtl"] & {
    transform: translate(50%, -50%);
  }
  html[dir="ltr"] & {
    transform: translate(-50%, -50%);
  }
  background: ${({ theme }) => theme.colors.primary};
  color: ${({ theme }) => theme.colors.onPrimary};
  aspect-ratio: 1 / 1;
  font-size: ${({ theme }) => `calc(${theme.typography.small} / 1.2)`};
  width: 1.5rem;
  padding: 2px;
  letter-spacing: -1px;
  border-radius: ${({ theme }) => theme.radius.circle};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
`;

const ItemMain = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
`;

const ItemTotals = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
  white-space: nowrap;
`;

type OrderItemReadCardProps = {
  item: OrderItem;
};

export const OrderItemReadCard: React.FC<OrderItemReadCardProps> = ({
  item,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const lineTotal = item.finalSalePriceAtPurchase * item.quantity;

  return (
    <ItemRow key={item.productId}>
      <QuantityBadge>× {item.quantity}</QuantityBadge>

      <ProductMainImage
        url={item.productMainImage}
        width="4rem"
        borderRadius={"md"}
      />

      <ItemMain>
        <Text fontWeight="600">{item.productName}</Text>

        <Text color="textSecondary" fontSize="small">
          {t("orders.general.items.item.price", {
            quantity: item.quantity,
            price: stringWithCurrencyCode(
              settings.currency,
              item.finalSalePriceAtPurchase,
            ),
            discount:
              item?.discountAtPurchase?.type === "PERCENTAGE"
                ? `${item.discountAtPurchase.value}%`
                : stringWithCurrencyCode(
                    settings.currency,
                    item?.discountAtPurchase?.value,
                  ),
          })}
        </Text>
      </ItemMain>

      <ItemTotals>
        <Text fontWeight="600">
          {stringWithCurrencyCode(settings.currency, lineTotal)}
        </Text>

        <Text
          color={item.totalProfitAtPurchase > 0 ? "success" : "error"}
          fontSize="small"
        >
          {t("orders.general.items.item.profit", {
            totalProfit: `${item.totalProfitAtPurchase > 0 ? "+" : ""}${stringWithCurrencyCode(
              settings.currency,
              item.totalProfitAtPurchase,
            )}`,
          })}
        </Text>
      </ItemTotals>
    </ItemRow>
  );
};
