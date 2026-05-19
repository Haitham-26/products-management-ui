import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons/faNoteSticky";
import { faReceipt } from "@fortawesome/free-solid-svg-icons/faReceipt";
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
import { Toast } from "../../../utils/Toast";
import { Input } from "../../../components/Input";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { PhoneInput } from "../../../components/PhoneInputs";
import { stringWithCurrencyCode } from "../../../utils/String";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GlassHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0D;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;

  h2 {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: ${({ theme }) => theme.typography.title};
  }

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: ${({ theme }) => theme.typography.small};
  }
`;

const InfoSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  h4 {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    margin: 0;
  }
`;

const ReadOnlyItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.xs} 0;
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:last-child {
    border-bottom: none;
  }
`;

const ItemName = styled.span`
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 500;
`;

const ItemQty = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-family: monospace;
`;

const PriceText = styled.div`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
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
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const products = useAppSelector(productSliceSelectors.selectProducts);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const { control, handleSubmit, reset } = useForm<UpdateOrderDto>();

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onUpdate = async (data: UpdateOrderDto) => {
    try {
      setLoading(true);

      await dispatch(orderActions.updateOrder(data)).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
      Toast.success("Order updated successfully");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (order && open) {
      reset({
        customerName: order.customerName || "",
        customerPhone: order?.customerPhone || "",
        note: order.note || "",
        orderId: order._id,
        userId,
      });
    }
  }, [order, open, reset, userId]);

  if (!order) {
    return null;
  }

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Update Order"
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
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faCartShopping} />
          </IconWrapper>
          <TitleGroup>
            <h2>Order #{order.identifier}</h2>
            <span>Transaction Management</span>
          </TitleGroup>
        </GlassHeader>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faUser} />
            <h4>Customer Information</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="customerName"
            rules={{ required: "Customer cannot be empty" }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Customer Name"
                required
                errorMessage={error?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerPhone"
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                title="Customer Phone"
                errorMessage={error?.message}
                {...field}
              />
            )}
          />
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Order Contents</h4>
          </SectionLabel>
          {order.items.map((item, index) => {
            const product = products.find((p) => p._id === item.productId);
            return (
              <ReadOnlyItem key={index}>
                <ItemName>{product?.name || "Unknown Product"}</ItemName>
                <ItemQty>× {item.quantity}</ItemQty>
              </ReadOnlyItem>
            );
          })}
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faReceipt} />
            <h4>Financial Summary</h4>
          </SectionLabel>
          <PriceText>
            {stringWithCurrencyCode(
              settings.currency,
              order.totalPriceAtPurchase,
            )}
          </PriceText>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faNoteSticky} />
            <h4>Editorial Remarks</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea
                title="Internal Note"
                placeholder="Add specific details or changes..."
                rows={5}
                {...field}
              />
            )}
          />
        </InfoSection>
      </FormContainer>
    </Drawer>
  );
};
