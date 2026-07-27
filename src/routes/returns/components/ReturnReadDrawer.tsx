import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Text } from "../../../components/Text";
import type { Return } from "../../../model/return/types/Return";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useTranslation } from "react-i18next";
import { ReturnItemReadCard } from "./ReturnItemReadCard";
import { formatDate } from "../../../utils/Date";
import camelCase from "lodash/camelCase";
import { ReturnStatus } from "../../../model/return/types/ReturnStatus.enum";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
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

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};

  ${DataItem}:last-child:nth-child(odd) {
    grid-column: 1 / -1;
  }
`;

const ReturnItemsWrapper = styled.div`
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
  returnRecord: Return | null;
};

export const ReturnReadDrawer: React.FC<Props> = ({
  open = false,
  onClose,
  returnRecord,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  if (!returnRecord) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("returns.read.title")}
      size="large"
    >
      <FormContainer>
        <Section>
          <Text fontWeight="bold">{t("returns.general.details.title")}</Text>

          <DataGrid>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("common.order")}
              </Text>
              <Text>{returnRecord.orderIdentifier}</Text>
            </DataItem>

            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("common.status")}
              </Text>

              <Text
                color={
                  returnRecord.status === ReturnStatus.CANCELED
                    ? "error"
                    : "success"
                }
              >
                {t(`returns.fields.status.${camelCase(returnRecord.status)}`)}
              </Text>
            </DataItem>

            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("returns.fields.returnReason")}
              </Text>

              <Text>{returnRecord.returnReason}</Text>
            </DataItem>
          </DataGrid>
        </Section>

        <Section>
          <Text fontWeight="bold">{t("returns.general.items.title")}</Text>

          <ReturnItemsWrapper>
            {returnRecord.items.map((item) => (
              <ReturnItemReadCard key={item.productId} item={item} />
            ))}
          </ReturnItemsWrapper>

          <SummaryBox>
            <SummaryRow>
              <Text color="textSecondary">
                {t("returns.fields.totalReturnRevenue")}
              </Text>

              <Text fontWeight="600" color="error">
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
        </Section>

        <Section>
          <DataGrid>
            {returnRecord.returnedAt ? (
              <DataItem>
                <Text fontSize="small" color="textSecondary" fontWeight="bold">
                  {t("returns.fields.returnedAt")}
                </Text>
                <Text>
                  {formatDate(returnRecord.returnedAt, true, settings.timeZone)}
                </Text>
              </DataItem>
            ) : null}

            {returnRecord.canceledAt ? (
              <DataItem>
                <Text fontSize="small" color="textSecondary" fontWeight="bold">
                  {t("returns.fields.canceledAt")}
                </Text>
                <Text>
                  {formatDate(returnRecord.canceledAt, true, settings.timeZone)}
                </Text>
              </DataItem>
            ) : null}
          </DataGrid>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
