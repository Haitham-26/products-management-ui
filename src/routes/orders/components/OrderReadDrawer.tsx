import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Text } from "../../../components/Text";
import type { Order } from "../../../model/order/types/Order";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { ProductMainImage } from "../../products/components/ProductMainImage";
import { useTranslation } from "react-i18next";
import type { ThemeType } from "../../../theme/theme";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const OrderTitleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;

  p:first-child {
    direction: ltr;
  }
`;

const StatusBadge = styled.span<{ status: Order["status"] }>`
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, status }) =>
    theme.colors[status.toLowerCase() as keyof ThemeType["colors"]]};
  color: ${({ theme }) => theme.colors.surface};
  width: fit-content;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderLineItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

const OrderLineItem = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border}40;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    border-bottom: none;
  }
`;

const ItemInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const ItemTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 600;
`;

const PriceColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4px;
`;

const ItemTotal = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const DiscountBadge = styled.span`
  font-size: 0.7rem;
  background: ${({ theme }) => theme.colors.error}15;
  color: ${({ theme }) => theme.colors.error};
  padding: 2px 6px;
  border-radius: 4px;
  font-weight: 600;
  width: fit-content;
`;

const GrandTotalSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin-top: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const TotalAmount = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
`;

type Props = {
  open: boolean;
  onClose: VoidFunction;
  order: Order | null;
};

export const OrderReadDrawer: React.FC<Props> = ({
  open = false,
  onClose,
  order,
}) => {
  const { t } = useTranslation();
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  if (!order) {
    return null;
  }

  const renderDiscount = (item: Order["items"][0]) => {
    if (!item.discountAtPurchase || !item.discountAtPurchase.value) {
      return null;
    }

    const { type, value } = item.discountAtPurchase;

    const label = t("orders.read.items.discount", {
      discount:
        type === ProductDiscountTypes.PERCENTAGE
          ? `${value}%`
          : stringWithCurrencyCode(settings.currency, value),
    });

    return <DiscountBadge>{label}</DiscountBadge>;
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("orders.read.title")}
      size="large"
    >
      <FormContainer>
        <OrderTitleContainer>
          <Text fontWeight="bold" fontSize="subtitle">
            #{order.identifier}
          </Text>
          <StatusBadge status={order.status}>
            {t(`orders.status.${order.status.toLowerCase()}`)}
          </StatusBadge>
        </OrderTitleContainer>

        <Section>
          <Text fontWeight="bold">
            {t("orders.general.customerInfo.title")}
          </Text>
          <DataGrid>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerName", "Name")}
              </Text>
              <Text>{order.customerName}</Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerEmail", "Email")}
              </Text>
              <Text fontStyle={!order.customerEmail ? "italic" : undefined}>
                {order.customerEmail || "_"}
              </Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerPhone", "Phone")}
              </Text>
              <Text fontStyle={!order.customerPhone ? "italic" : undefined}>
                {order.customerPhone || "_"}
              </Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerAddress", "Phone")}
              </Text>
              <Text fontStyle={!order.customerAddress ? "italic" : undefined}>
                {order.customerAddress || "_"}
              </Text>
            </DataItem>
          </DataGrid>
        </Section>

        <Section>
          <Text fontWeight="bold">{t("orders.general.items.title")}</Text>

          <OrderLineItemsWrapper>
            {order.items.map((item, index) => (
              <OrderLineItem key={`${item.productId}-${index}`}>
                <ItemInfo>
                  <ItemTitle>
                    <ProductMainImage
                      url={item.productMainImage}
                      width="2rem"
                    />
                    <Text fontWeight="600">{item.productName}</Text>
                  </ItemTitle>
                  <Text fontSize="small" color="textSecondary">
                    {`${item.quantity} × ${stringWithCurrencyCode(
                      settings.currency,
                      item.priceAtPurchase,
                    )}`}
                  </Text>
                </ItemInfo>

                <PriceColumn>
                  <ItemTotal>
                    {stringWithCurrencyCode(
                      settings.currency,
                      item.finalPrice * item.quantity,
                    )}
                  </ItemTotal>
                  {renderDiscount(item)}
                </PriceColumn>
              </OrderLineItem>
            ))}
          </OrderLineItemsWrapper>

          <GrandTotalSection>
            <Text fontWeight="600">{t("orders.fields.totalAmount")}</Text>
            <TotalAmount>
              {stringWithCurrencyCode(settings.currency, order.totalAmount)}
            </TotalAmount>
          </GrandTotalSection>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.note")}
            </Text>
            <Text fontStyle={!order.note?.length ? "italic" : undefined}>
              {order.note || "_"}
            </Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
