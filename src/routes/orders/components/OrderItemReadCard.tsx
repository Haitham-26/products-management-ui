import type React from "react";
import { useTranslation } from "react-i18next";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { ProductMainImage } from "../../products/components/ProductMainImage";
import { Text } from "../../../components/Text";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import styled from "styled-components";
import { Breakpoints } from "../../../theme/Breakpoints";

const ItemRow = styled.div`
  display: flex;
  align-items: flex-start;
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

  width: 1.5rem;
  aspect-ratio: 1;
  border-radius: ${({ theme }) => theme.radius.circle};

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
    <ItemRow>
      <QuantityBadge>{item.quantity}</QuantityBadge>

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
      </ItemContent>
    </ItemRow>
  );
};
