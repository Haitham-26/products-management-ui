import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useSearchParams } from "react-router-dom";
import {
  buildOrdersParams,
  parseOrdersFiltersFromParams,
} from "../utils/orderUtils";
import orderSliceSelectors from "../../../redux/order/orders.selector";
import { orderActions } from "../../../redux/order/orders.slice";
import productSliceSelectors from "../../../redux/product/products.selector";
import type { Order } from "../../../model/order/types/Order";
import type { UpdateOrderDto } from "../../../model/order/dto/UpdateOrderDto";

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Hero = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  padding-bottom: ${({ theme }) => theme.spacing.lg};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeroIcon = styled.div`
  width: 56px;
  height: 56px;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

type OrderUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  order: Order | null;
};

export const OrderUpdateDrawer: React.FC<OrderUpdateDrawerProps> = ({
  open = false,
  onClose,
  order,
}) => {
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const products = useAppSelector(productSliceSelectors.selectProducts);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const { control, handleSubmit, reset, getValues } = useForm<UpdateOrderDto>();

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onUpdate = async () => {
    const dto = getValues();

    try {
      setLoading(true);

      await dispatch(
        orderActions.updateOrder({
          ...dto,
          userId,
        }),
      ).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    reset({
      note: order?.note || "",
      orderId: order?._id || "",
      userId,
    });
  }, [order, reset, userId]);

  if (!order) return null;

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Update order"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onUpdate)}
          onCancel={localOnClose}
          editMode
        />
      }
    >
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faCartShopping} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Order #{order._id}</Text>
            <Text fontSize="small" color="textSecondary">
              Only note can be edited
            </Text>
          </HeroText>
        </Hero>

        {/* ITEMS (READ ONLY) */}
        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Items (Read-only)</Text>
          </SectionHeader>

          {order.items.map((item, index) => {
            const product = products.find((p) => p._id === item.productId);

            return (
              <div key={index}>
                <Text>
                  {product?.name || item.productId} × {item.quantity}
                </Text>
              </div>
            );
          })}
        </Card>

        <Card>
          <Text fontSize="subtitle">Total price</Text>
          <Text>${order.totalPriceAtPurchase}</Text>
        </Card>

        <Card>
          <Controller
            control={control}
            name="note"
            render={({ field: { value, onChange } }) => (
              <Textarea
                title="Note"
                placeholder="Update note..."
                value={value}
                onChange={onChange}
              />
            )}
          />
        </Card>
      </Content>
    </Drawer>
  );
};
