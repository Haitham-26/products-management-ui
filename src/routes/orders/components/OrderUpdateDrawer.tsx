import type React from "react";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons/faNoteSticky";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useSearchParams } from "react-router-dom";
import { buildOrdersParams } from "../utils/orderUtils";
import { orderActions } from "../../../redux/order/orders.slice";
import type { Order } from "../../../model/order/types/Order";
import type { UpdateOrderDto } from "../../../model/order/dto/UpdateOrderDto";
import { Input } from "../../../components/Input";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { PhoneInput } from "../../../components/PhoneInput";
import { stringWithCurrencyCode } from "../../../utils/String";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { useTranslation } from "react-i18next";
import { Text } from "../../../components/Text";
import { useAppToast } from "../../../components/toast/useAppToast";
import { OrderItemReadCard } from "./OrderItemReadCard";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Section = styled.section`
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

const ItemsGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  p {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: bold;
  }
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

type OrderUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  order: Order | null;
  filters: Partial<GetOrdersDto>;
};

export const OrderUpdateDrawer: React.FC<OrderUpdateDrawerProps> = ({
  open = false,
  onClose,
  order,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const Toast = useAppToast();
  const { t } = useTranslation();
  const { control, handleSubmit, reset } = useForm<UpdateOrderDto>();

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

      Toast.success(t("orders.edit.success"));
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
        customerEmail: order.customerEmail || "",
        customerAddress: order.customerAddress || "",
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
      title={t("orders.edit.title")}
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
        <Section>
          <SectionLabel>
            <Icon icon={faUser} />
            <Text>{t("orders.general.customerInfo.title")}</Text>
          </SectionLabel>
          <Controller
            control={control}
            name="customerName"
            rules={{ required: t("errors.general.required") }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("common.name")}
                required
                errorMessage={error?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerEmail"
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("common.email")}
                errorMessage={error?.message}
                valid={!error}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerPhone"
            render={({ field, fieldState: { error } }) => (
              <PhoneInput
                title={t("common.phone")}
                errorMessage={error?.message}
                valid={!error}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerAddress"
            rules={{
              maxLength: {
                value: 256,
                message: t(
                  "orders.create-edit.errors.customerInfo.address.long",
                  {
                    length: 256,
                  },
                ),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                title={t("common.address")}
                errorMessage={error?.message}
                valid={!error}
                {...field}
              />
            )}
          />
        </Section>

        <Section>
          <SectionLabel>
            <Icon icon={faTag} />
            <Text>{t("orders.general.items.title")}</Text>
          </SectionLabel>

          <ItemsGrid>
            {order.items.map((item) => (
              <OrderItemReadCard key={item.productId} item={item} />
            ))}
          </ItemsGrid>

          <SummaryBox>
            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalAmount")}
              </Text>
              <Text fontWeight="600">
                {stringWithCurrencyCode(settings.currency, order.totalAmount)}
              </Text>
            </SummaryRow>

            <SummaryRow>
              <Text color="textSecondary">
                {t("orders.general.items.totalProfit")}
              </Text>
              <Text
                color={order.totalProfit > 0 ? "success" : "error"}
                fontWeight="600"
              >
                {stringWithCurrencyCode(settings.currency, order.totalProfit)}
              </Text>
            </SummaryRow>
          </SummaryBox>
        </Section>

        <Section>
          <SectionLabel>
            <Icon icon={faNoteSticky} />
            <Text>{t("orders.general.note.title")}</Text>
          </SectionLabel>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea title={t("common.note")} rows={5} {...field} />
            )}
          />
        </Section>
      </FormContainer>
    </Drawer>
  );
};
