import type React from "react";
import { useState, useMemo, useCallback } from "react";
import styled from "styled-components";
import {
  Controller,
  useForm,
  useFieldArray,
  FormProvider,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import { faReceipt } from "@fortawesome/free-solid-svg-icons/faReceipt";

import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { useAppToast } from "../../../components/toast/useAppToast";
import type { CreateReturnDto } from "../../../model/return/dto/CreateReturnDto";
import type { GetReturnsDto } from "../../../model/return/dto/GetReturnsDto";
import type { OrderItem } from "../../../model/order/types/OrderItem";
import { returnActions } from "../../../redux/return/returns.slice";
import { buildReturnsParams } from "../utils/returnUtils";
import orderSliceSelectors from "../../../redux/order/orders.selector";
import { Dropdown } from "../../../components/Dropdown";
import type { ItemType } from "antd/es/menu/interface";
import { Button } from "../../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { SearchSelect } from "../../../components/SearchSelect";
import debounce from "lodash/debounce";
import { orderActions } from "../../../redux/order/orders.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { checkPermissions } from "../../../utils/checkPermissions";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { ReturnCreateItem } from "./ReturnCreateItem";
import { faBook } from "@fortawesome/free-solid-svg-icons/faBook";
import { Tooltip } from "antd";
import { Info } from "../../../components/Info";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const FormSection = styled.section`
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

const OrderItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.sm};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionLabel = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  border-bottom: 2px solid ${({ theme }) => theme.colors.primary}20;
  padding-bottom: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};

  p {
    font-weight: bold;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const InfoContent = styled.div`
  list-style-position: inside;
`;

const ItemsButton = styled(Button)`
  width: 15rem;
  background-color: transparent;
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

type ReturnCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  filters: Partial<GetReturnsDto>;
};

export const ReturnCreateDrawer: React.FC<ReturnCreateDrawerProps> = ({
  open = false,
  onClose,
  filters,
}) => {
  const [loading, setLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const formMethods = useForm<CreateReturnDto>({
    defaultValues: {
      orderId: "",
      returnReason: "",
      items: [],
    },
  });

  const { control, handleSubmit, reset, watch, getValues } = formMethods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const orders = useAppSelector(orderSliceSelectors.selectOrders);
  const ordersLoading = useAppSelector(orderSliceSelectors.selectOrdersLoading);
  const user = useAppSelector(userSliceSelectors.selectUser);

  const orderPermissions = checkPermissions(user, "orders");

  const handleAddItem = useCallback(
    (orderItem: OrderItem) => {
      append({
        productId: orderItem.productId,
        totalReturnedCount: 1,
        restockedCount: 1,
      });
    },
    [append],
  );

  const [watchedItems, selectedOrderId] = watch(["items", "orderId"]);

  const selectedOrder = useMemo(
    () => orders.find((o) => o._id === selectedOrderId),
    [orders, selectedOrderId],
  );

  const orderOptions = useMemo(
    () =>
      orders.map((order) => ({
        label: `#${order.identifier} - ${order.customerName}`,
        value: order._id,
      })),
    [orders],
  );

  const availableOrderItems = useMemo(() => {
    if (!selectedOrder) {
      return [];
    }

    const addedProductIds = watchedItems.map((item) => item.productId);

    return selectedOrder.items.filter(
      (item) => !addedProductIds.includes(item.productId),
    );
  }, [selectedOrder, watchedItems]);

  const itemsDropdownItems = useMemo(
    () =>
      availableOrderItems.map((item) => ({
        key: item.productId,
        label: `${item.productName} (${item.quantity}×)`,
        icon: <Icon icon={faPlus} />,
        onClick: () => handleAddItem(item),
      })) as ItemType[],
    [availableOrderItems, handleAddItem],
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchOrders = useCallback(
    debounce(async (keyword: string) => {
      try {
        await dispatch(
          orderActions.getOrders({
            keyword,
            meta: { page: 1, limit: 50 },
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      }
    }, 800),
    [dispatch],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onCreate = async () => {
    const dto = getValues();

    if (!dto.items || !dto.items.length) {
      return;
    }

    try {
      setLoading(true);

      await dispatch(returnActions.createReturn(dto)).unwrap();

      await dispatch(
        orderActions.getOrders({ meta: { page: 1, limit: 0 } }),
      ).unwrap();

      setSearchParams(buildReturnsParams(filters, searchParams), {
        replace: true,
      });

      localOnClose();
      Toast.success("Returns created successfully");
    } catch (e) {
      Toast.apiError(e);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title={t("returns.subheader.action")}
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
        />
      }
    >
      <FormContainer>
        <FormSection>
          <SectionLabel>
            <Icon icon={faReceipt} />
            <Text>{t("returns.create-edit.order.title")}</Text>
          </SectionLabel>

          <Text color="textSecondary" fontSize="small">
            {t("returns.create-edit.order.description")}
          </Text>

          <Controller
            control={control}
            name="orderId"
            rules={{ required: t("errors.general.required") }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <SearchSelect
                title={t("returns.create-edit.order.select.title")}
                value={
                  orderOptions?.find((p) => p.value === value) || undefined
                }
                onChange={(v) => {
                  onChange(v);
                  remove();
                }}
                options={orderOptions}
                onSearch={searchOrders}
                allowClear
                loading={ordersLoading}
                valid={!error}
                disabled={!orderPermissions.READ}
                required
              />
            )}
          />

          {selectedOrder ? (
            <OrderItemsWrapper>
              <Info>
                <InfoContent>
                  {Array.from({ length: 2 }, (_, i) => (
                    <li key={i}>
                      {t(`returns.create-edit.order.items.notes.${i}`)}
                    </li>
                  ))}
                </InfoContent>
              </Info>

              <Dropdown
                menu={{
                  items: itemsDropdownItems,
                }}
                disabled={!availableOrderItems.length}
              >
                <Tooltip
                  title={
                    !availableOrderItems.length
                      ? t("returns.create-edit.order.items.emptyTooltip")
                      : ""
                  }
                >
                  <ItemsButton
                    variant="secondary"
                    icon={faAngleDown}
                    disabled={!availableOrderItems.length}
                  >
                    {t("common.products")}
                  </ItemsButton>
                </Tooltip>
              </Dropdown>

              {fields.map((field, index) => {
                const watchedField = watchedItems[index];

                const currentOrderItem = selectedOrder.items.find(
                  (i) => i.productId === watchedField.productId,
                )!;

                return (
                  <FormProvider key={field.id} {...formMethods}>
                    <ReturnCreateItem
                      orderItem={currentOrderItem}
                      index={index}
                      onRemove={() => remove(index)}
                    />
                  </FormProvider>
                );
              })}
            </OrderItemsWrapper>
          ) : null}
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faBook} />
            <Text>{t("returns.create-edit.reason.title")}</Text>
          </SectionLabel>

          <Controller
            control={control}
            name="returnReason"
            rules={{ required: t("errors.general.required") }}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                title={t("returns.create-edit.reason.input.title")}
                required
                valid={!error}
                errorMessage={error?.message}
                {...field}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
