import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
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
import { Button } from "../../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import productSliceSelectors from "../../../redux/product/products.selector";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { Select } from "../../../components/Select";
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

const ProductRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const StyledSelect = styled(Select)`
  width: 27rem !important;
`;

const QuantityInputWrapper = styled.div`
  margin-top: auto !important;
`;

const RemoveButton = styled(Button)`
  margin-top: auto !important;
  padding: ${({ theme }) => theme.spacing.sm} !important;
  height: 2rem !important;
  width: 2rem !important;
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

  const { control, handleSubmit, reset, getValues, watch } =
    useForm<UpdateOrderDto>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const getProductsOptions = (currentProductId?: string) => {
    const selectedIds = items?.map((i) => i.productId).filter(Boolean);

    return products
      .filter(
        (p) => !selectedIds?.includes(p._id) || p._id === currentProductId,
      )
      .map((product) => ({
        label: product.name,
        value: product._id,
      }));
  };
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

    if (!dto?.items?.length) {
      return;
    }

    try {
      setLoading(true);

      dto.items = dto.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }));

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
      items: order?.items || [],
      note: order?.note || "",
      orderId: order?._id || "",
      userId,
    });
  }, [order, reset, userId]);

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
            <Text fontSize="title">Update Order</Text>
            <Text fontSize="small" color="textSecondary">
              Edit order details
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Order Items</Text>
          </SectionHeader>

          {fields.map((field, index) => (
            <ProductRow key={field.id}>
              <Controller
                control={control}
                name={`items.${index}.productId`}
                render={({ field: { value, onChange } }) => {
                  const options = getProductsOptions(value);

                  return (
                    <StyledSelect
                      title="Select product"
                      value={options.find((p) => p.value === value)}
                      onChange={onChange}
                      options={options}
                    />
                  );
                }}
              />

              <Controller
                control={control}
                name={`items.${index}.quantity`}
                render={({ field: { value, onChange } }) => (
                  <QuantityInputWrapper>
                    <Input
                      type="number"
                      min={1}
                      value={value}
                      onChange={onChange}
                    />
                  </QuantityInputWrapper>
                )}
              />

              <RemoveButton
                icon={faXmark}
                onClick={() => remove(index)}
                variant="danger"
              />
            </ProductRow>
          ))}

          <Button
            onClick={() => append({ productId: "", quantity: 1 })}
            icon={faPlus}
            disabled={loading || fields.length === products.length}
          >
            Add Item
          </Button>
        </Card>

        <Card>
          <Controller
            control={control}
            name="note"
            render={({ field: { value, onChange } }) => (
              <Textarea
                title="Note"
                placeholder="Optional note"
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
