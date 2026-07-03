import type React from "react";
import type { Order } from "../../../model/order/types/Order";
import { WarningModal } from "../../../components/WarningModal";
import { Toast } from "../../../utils/Toast";
import { useAppDispatch } from "../../../redux/store";
import { useState } from "react";
import { orderActions } from "../../../redux/order/orders.slice";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";

const descriptions = {
  archive:
    "Are you sure you want to archive this order? It will become read-only and hidden from active lists unless you enable archived filters.",

  unarchive:
    "Are you sure you want to unarchive this order? It will become active again and editable.",
};

type OrderToggleArchiveModalProps = {
  open: boolean;
  onClose: VoidFunction;
  order: Order | null;
  filters: Partial<GetOrdersDto>;
  fetchOrders: (removedItemsCount: number) => Promise<void>;
};

export const OrderToggleArchiveModal: React.FC<
  OrderToggleArchiveModalProps
> = ({ open = false, onClose, order, fetchOrders, filters }) => {
  const [loading, setLoading] = useState(false);

  const dispatch = useAppDispatch();

  const onConfirm = async () => {
    if (!order) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(
        orderActions.updateOrder({
          isArchived: order.isArchived !== true,
          orderId: order._id,
          userId: order.userId,
        }),
      ).unwrap();

      await fetchOrders(!order.isArchived && !filters.showArchived ? 1 : 0);

      Toast.success(
        `Order ${order.isArchived ? "unarchived" : "archived"} successfully`,
      );
      onClose();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <WarningModal
      title={order?.isArchived ? "Unarchive Order" : "Archive Order"}
      description={descriptions[order?.isArchived ? "unarchive" : "archive"]}
      open={open}
      confirmLoading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
