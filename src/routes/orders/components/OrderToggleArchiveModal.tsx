import type React from "react";
import type { Order } from "../../../model/order/types/Order";
import { WarningModal } from "../../../components/WarningModal";
import { useAppDispatch } from "../../../redux/store";
import { useState } from "react";
import { orderActions } from "../../../redux/order/orders.slice";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";

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

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

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
        t(`orders.${order.isArchived ? "unarchive" : "archive"}.success`),
      );

      onClose();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  if (!order) {
    return null;
  }

  return (
    <WarningModal
      title={t(`orders.${order.isArchived ? "unarchive" : "archive"}.title`, {
        id: order.identifier,
      })}
      description={t(
        `orders.${order.isArchived ? "unarchive" : "archive"}.description`,
      )}
      open={open}
      confirmLoading={loading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  );
};
