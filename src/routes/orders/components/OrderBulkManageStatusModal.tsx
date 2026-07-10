import type React from "react";
import { Modal } from "../../../components/Modal";
import { Text } from "../../../components/Text";
import { Select } from "../../../components/Select";
import { useMemo, useState } from "react";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import capitalize from "lodash/capitalize";
import { Button } from "../../../components/Button";
import styled from "styled-components";
import { Toast } from "../../../utils/Toast";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { orderActions } from "../../../redux/order/orders.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { buildOrdersParams } from "../utils/orderUtils";
import { useSearchParams } from "react-router-dom";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import type { Key } from "antd/es/table/interface";
import { Info } from "../../../components/Info";

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

const InfoList = styled.ul`
  margin-inline-start: ${({ theme }) => theme.spacing.md};
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

interface OrderBulkManageStatusModalProps {
  open: boolean;
  onClose: () => void;
  orderIds: Key[];
  filters: Partial<GetOrdersDto>;
  setSelctedRowIds: React.Dispatch<React.SetStateAction<Key[]>>;
}

export const OrderBulkManageStatusModal: React.FC<
  OrderBulkManageStatusModalProps
> = ({ open = false, onClose, orderIds = [], filters, setSelctedRowIds }) => {
  const [status, setStatus] = useState<OrderStatus | null>(null);
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const statusOptions = useMemo(() => {
    return Object.values(OrderStatus)

      .map((s) => ({ label: capitalize(s), value: s }));
  }, []);

  const localOnClose = () => {
    setStatus(null);
    onClose();
  };

  const onConfirm = async () => {
    if (!orderIds.length || !status) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        orderActions.bulkManageOrderStatus({
          orderIds: orderIds.map((id) => id.toString()),
          status,
          userId,
        }),
      ).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });

      setSelctedRowIds([]);

      Toast.success("Order statuses updated successfully");
      localOnClose();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal title="Manage Order Statuses" open={open} onCancel={localOnClose}>
      <Container>
        <InfoCard>
          <Text fontSize="small" fontWeight={"bold"}>
            Inventory Update Rules:
          </Text>

          <RuleRow>
            <div>
              <StatusLabel type={OrderStatus.PENDING}>Pending</StatusLabel>
              <span> → </span>
              <StatusLabel type={OrderStatus.CANCELED}>Canceled</StatusLabel>
            </div>
            <Hint>Stock will be restored (+)</Hint>
          </RuleRow>

          <RuleRow>
            <div>
              <StatusLabel type={OrderStatus.CANCELED}>Canceled</StatusLabel>
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

          <Info>
            <InfoList>
              <li>The selected confirmed orders will not be updated.</li>
              <li>
                The selected cancelled orders will not be updated if the new
                status is "Confirmed".
              </li>
            </InfoList>
          </Info>
        </InfoCard>

        <Select
          title="New Status"
          placeholder="Select a new status"
          value={statusOptions?.find((s) => s.value === status)}
          onChange={(v) => setStatus(v as OrderStatus)}
          options={statusOptions}
        />

        <Footer>
          <Button loading={loading} disabled={!status} onClick={onConfirm}>
            Update Status
          </Button>
        </Footer>
      </Container>
    </Modal>
  );
};
