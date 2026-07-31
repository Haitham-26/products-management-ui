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
import camelCase from "lodash/camelCase";

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
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  &:not(:first-child) {
    margin-top: ${({ theme }) => theme.spacing.md};
    padding-top: ${({ theme }) => theme.spacing.md};
    border-top: 1px solid ${({ theme }) => theme.colors.border};
  }
`;

const TotalsColumn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 2px;
`;

const StrikethroughText = styled(Text)`
  text-decoration: line-through;
`;

const LTRText = styled(Text)`
  html[dir="rtl"] & {
    direction: ltr;
    text-align: end;
  }
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

  const hasReturns = (order.returnedItems?.length ?? 0) > 0;

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
            {t(`orders.status.${camelCase(order.status)}`)}
          </StatusBadge>
        </OrderTitleContainer>

        <Section>
          <Text fontWeight="bold">
            {t("orders.general.customerInfo.title")}
          </Text>
          <DataGrid>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerName")}
              </Text>
              <Text>{order.customerName}</Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerEmail")}
              </Text>
              <LTRText fontStyle={!order.customerEmail ? "italic" : undefined}>
                {order.customerEmail || "_"}
              </LTRText>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerPhone")}
              </Text>
              <LTRText fontStyle={!order.customerPhone ? "italic" : undefined}>
                {order.customerPhone || "_"}
              </LTRText>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("orders.fields.customerAddress")}
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
              <OrderItemReadCard
                key={item.productId}
                item={item}
                order={order}
              />
            ))}
          </OrderLineItemsWrapper>
          <SummaryBox>
            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalRevenue")}
              </Text>
              <TotalsColumn>
                {hasReturns ? (
                  <StrikethroughText color="textSecondary" fontSize="small">
                    {stringWithCurrencyCode(
                      settings.currency,
                      order.totalRevenue,
                    )}
                  </StrikethroughText>
                ) : null}
                <Text fontWeight="600">
                  {stringWithCurrencyCode(settings.currency, order.netRevenue)}
                </Text>
              </TotalsColumn>
            </SummaryRow>

            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalProfit")}
              </Text>
              <TotalsColumn>
                {hasReturns ? (
                  <StrikethroughText color="textSecondary" fontSize="small">
                    {stringWithCurrencyCode(
                      settings.currency,
                      order.totalProfit,
                    )}
                  </StrikethroughText>
                ) : null}
                <Text
                  color={order.netProfit > 0 ? "success" : "error"}
                  fontWeight="600"
                >
                  {stringWithCurrencyCode(settings.currency, order.netProfit)}
                </Text>
              </TotalsColumn>
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
              {t("common.creationDate")}
            </Text>
            <Text>{formatDate(order.createdAt, true, settings.timeZone)}</Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
