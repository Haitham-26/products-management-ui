import type React from "react";
import { Modal } from "../../../components/Modal";
import { Text } from "../../../components/Text";
import { Select } from "../../../components/Select";
import { useMemo, useState } from "react";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import capitalize from "lodash/capitalize";
import { Button } from "../../../components/Button";
import styled from "styled-components";
import type { Order } from "../../../model/order/types/Order";
import { Toast } from "../../../utils/Toast";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { orderActions } from "../../../redux/order/orders.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import {
  buildOrdersParams,
  parseOrdersFiltersFromParams,
} from "../utils/orderUtils";
import { useSearchParams } from "react-router-dom";
import orderSliceSelectors from "../../../redux/order/orders.selector";

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
`;

const RuleRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Status = styled.span<{ type: "pending" | "confirmed" | "cancelled" }>`
  font-weight: 600;
  color: ${({ theme, type }) => theme.colors[type]};
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
}

export const OrderManageStatusModal: React.FC<OrderManageStatusModalProps> = ({
  open = false,
  onClose,
  order,
}) => {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);

  const statusOptions = useMemo(
    () =>
      Object.values(OrderStatus)
        .filter((s) => s !== order?.status)
        .map((s) => ({ label: capitalize(s), value: s })),
    [order?.status],
  );
  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

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

      Toast.success("Status updated successfully");
      localOnClose();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Update order status" open={open} onCancel={localOnClose}>
      <Container>
        <InfoCard>
          <Text fontSize="small">
            Changing the status will immediately update your stock.
          </Text>

          <RuleRow>
            <Status type="confirmed">Confirmed</Status>
            <Hint>Stock will be reduced</Hint>
          </RuleRow>

          <RuleRow>
            <div>
              <Status type="cancelled">Cancelled</Status>
              <Hint as="span"> / </Hint>
              <Status type="pending">Pending</Status>
            </div>
            <Hint>Stock will be restored</Hint>
          </RuleRow>
        </InfoCard>

        <Select
          title="New status"
          placeholder="Select a new status"
          value={statusOptions?.find((s) => s.value === status)}
          onChange={(v) => setStatus(v)}
          options={statusOptions}
        />

        {status ? (
          <Hint>This change cannot be undone automatically.</Hint>
        ) : null}

        <Footer>
          <Button loading={loading} disabled={!status} onClick={onConfirm}>
            Confirm change
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
