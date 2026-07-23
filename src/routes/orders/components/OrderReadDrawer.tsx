import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Text } from "../../../components/Text";
import type { Order } from "../../../model/order/types/Order";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useTranslation } from "react-i18next";
import type { ThemeType } from "../../../theme/theme";
import { OrderItemReadCard } from "./OrderItemReadCard";
import { formatDate } from "../../../utils/Date";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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
  border-top: 2.5px solid ${({ theme }) => theme.colors.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const OrderLineItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding-top: ${({ theme }) => theme.spacing.md};
  margin-top: ${({ theme }) => theme.spacing.xs};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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
            {order.items.map((item) => (
              <OrderItemReadCard key={item.productId} item={item} />
            ))}
          </OrderLineItemsWrapper>

          <SummaryBox>
            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalAmount")}
              </Text>
              <Text fontWeight="600">
                {stringWithCurrencyCode(settings.currency, order.totalAmount)}
              </Text>
            </SummaryRow>

            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalProfit")}
              </Text>
              <Text
                color={order.totalProfit > 0 ? "success" : "error"}
                fontWeight="600"
              >
                {stringWithCurrencyCode(settings.currency, order.totalProfit)}
              </Text>
            </SummaryRow>
          </SummaryBox>
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

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.filters.creationDate.title")}
            </Text>
            <Text>{formatDate(order.createdAt, true, settings.timeZone)}</Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
