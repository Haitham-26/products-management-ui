import type React from "react";
import { Modal } from "../../../components/Modal";
import { Text } from "../../../components/Text";
import { Select } from "../../../components/Select";
import { useMemo, useState } from "react";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import { Button } from "../../../components/Button";
import styled from "styled-components";
import type { Order } from "../../../model/order/types/Order";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { orderActions } from "../../../redux/order/orders.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { buildOrdersParams } from "../utils/orderUtils";
import { useSearchParams } from "react-router-dom";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import i18n from "../../../i18n";
import { useAppToast } from "../../../components/toast/useAppToast";

const getRules = (t: TFunction) => [
  {
    status: [OrderStatus.PENDING, OrderStatus.CANCELED],
    hint: t("orders.manageStatus.rules.pending-canceled"),
  },
  {
    status: [OrderStatus.CANCELED, OrderStatus.PENDING],
    hint: t("orders.manageStatus.rules.canceled-pending"),
  },
  {
    status: [OrderStatus.PENDING, OrderStatus.CONFIRMED],
    hint: t("orders.manageStatus.rules.pending-confirmed"),
  },
];

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => theme.spacing.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  p:first-child {
    margin-bottom: ${({ theme }) => theme.spacing.sm};
  }
`;

const StatusLabel = styled.span<{ type: OrderStatus }>`
  font-weight: 600;
  color: ${({ theme, type }) =>
    theme.colors[type.toLowerCase() as keyof typeof theme.colors]};
  text-transform: capitalize;
`;

const RuleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  div {
    display: flex;
    align-items: center;
    gap: 4px;
  }
`;

const Hint = styled(Text)`
  font-size: 0.8rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface OrderManageStatusModalProps {
  open: boolean;
  onClose: () => void;
  order: Order | null;
  filters: Partial<GetOrdersDto>;
}

export const OrderManageStatusModal: React.FC<OrderManageStatusModalProps> = ({
  open = false,
  onClose,
  order,
  filters,
}) => {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const statusOptions = useMemo(() => {
    if (!order) {
      return [];
    }

    return Object.values(OrderStatus)
      .filter((s) => {
        if (s === order.status) {
          return false;
        }

        if (
          order.status === OrderStatus.CANCELED &&
          s === OrderStatus.CONFIRMED
        ) {
          return false;
        }

        return true;
      })
      .map((s) => ({ label: t(`orders.status.${s.toLowerCase()}`), value: s }));
  }, [order, t]);

  const localOnClose = () => {
    setStatus(null);
    onClose();
  };

  const onConfirm = async () => {
    if (!order || !status) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        orderActions.manageOrderStatus({
          orderId: order._id,
          status,
          userId,
        }),
      ).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });

      Toast.success(t("orders.manageStatus.success"));
      localOnClose();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={t("orders.manageStatus.title")}
      open={open}
      onCancel={localOnClose}
    >
      <Container>
        <InfoCard>
          <Text fontWeight={"bold"}>{t("orders.manageStatus.subtitle")}</Text>

          {getRules(t).map((rule) => (
            <RuleRow key={`${rule.status[0]}-${rule.status[1]}`}>
              <div>
                <StatusLabel type={rule.status[0]}>
                  {t(`orders.status.${rule.status[0].toLowerCase()}`)}
                </StatusLabel>
                <span>{i18n.dir(i18n.language) === "rtl" ? "←" : "→"}</span>
                <StatusLabel type={rule.status[1]}>
                  {t(`orders.status.${rule.status[1].toLowerCase()}`)}
                </StatusLabel>
              </div>
              <Hint>{rule.hint}</Hint>
            </RuleRow>
          ))}
        </InfoCard>

        <Select
          title={t("orders.manageStatus.status.title")}
          placeholder={t("orders.manageStatus.status.placeholder")}
          value={statusOptions?.find((s) => s.value === status)}
          onChange={(v) => setStatus(v as OrderStatus)}
          options={statusOptions}
        />

        <Footer>
          <Button loading={loading} disabled={!status} onClick={onConfirm}>
            {t("common.update")}
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
