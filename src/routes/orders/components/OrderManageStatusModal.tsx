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
import { buildOrdersParams } from "../utils/orderUtils";
import { useSearchParams } from "react-router-dom";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";

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
          order.status === OrderStatus.CANCELLED &&
          s === OrderStatus.CONFIRMED
        ) {
          return false;
        }

        return true;
      })
      .map((s) => ({ label: capitalize(s), value: s }));
  }, [order]);

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
    <Modal title="Update Order Status" open={open} onCancel={localOnClose}>
      <Container>
        <InfoCard>
          <Text fontSize="small" fontWeight={"bold"}>
            Inventory Update Rules:
          </Text>

          <RuleRow>
            <div>
              <StatusLabel type={OrderStatus.PENDING}>Pending</StatusLabel>
              <span> → </span>
              <StatusLabel type={OrderStatus.CANCELLED}>Cancelled</StatusLabel>
            </div>
            <Hint>Stock will be restored (+)</Hint>
          </RuleRow>

          <RuleRow>
            <div>
              <StatusLabel type={OrderStatus.CANCELLED}>Cancelled</StatusLabel>
              <span> → </span>
              <StatusLabel type={OrderStatus.PENDING}>Pending</StatusLabel>
            </div>
            <Hint>Stock will be deducted (-)</Hint>
          </RuleRow>

          <RuleRow>
            <div>
              <StatusLabel type={OrderStatus.PENDING}>Pending</StatusLabel>
              <span> → </span>
              <StatusLabel type={OrderStatus.CONFIRMED}>Confirmed</StatusLabel>
            </div>
            <Hint>No stock change</Hint>
          </RuleRow>
        </InfoCard>

        <Select
          title="New Status"
          placeholder="Select a new status"
          value={statusOptions?.find((s) => s.value === status)}
          onChange={(v) => setStatus(v as OrderStatus)}
          options={statusOptions}
        />

        {status ? (
          <Hint>
            This change involves a database transaction to ensure stock
            integrity.
          </Hint>
        ) : null}

        <Footer>
          <Button loading={loading} disabled={!status} onClick={onConfirm}>
            Update Status
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
