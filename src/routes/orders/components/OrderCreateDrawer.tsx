import type React from "react";
import { useMemo, useState } from "react";
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
import type { CreateOrderDto } from "../../../model/order/dto/CreateOrderDto";
import { Button } from "../../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import productSliceSelectors from "../../../redux/product/products.selector";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { Select, type SelectProps } from "../../../components/Select";

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
  width: 25rem;
`;

const QuantityInputWrapper = styled.div`
  margin-top: auto !important;
  width: 100%;
`;

const RemoveButton = styled(Button)`
  margin-top: auto !important;
  padding: ${({ theme }) => theme.spacing.sm} !important;
  height: 2rem !important;
  width: 2rem !important;
`;

const ErrorText = styled(Text)`
  color: ${({ theme }) => theme.colors.error};
  font-size: ${({ theme }) => theme.typography.small};
  margin-top: ${({ theme }) => theme.spacing.xs};
  margin-bottom: ${({ theme }) => theme.spacing.xs};
`;

const AddItemButton = styled(Button)`
  max-width: 12rem;
  margin-inline-start: auto;
`;

type OrderCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const OrderCreateDrawer: React.FC<OrderCreateDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const [loading, setLoading] = useState(false);

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const products = useAppSelector(productSliceSelectors.selectProducts);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = useForm<CreateOrderDto>({
    defaultValues: {
      items: [{ productId: "", quantity: 1 }],
      note: "",
      userId,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  const getProductsOptions = (currentProductId?: string) => {
    const selectedIds = items?.map((i) => i.productId).filter(Boolean);

    return products
      .filter((p) => !selectedIds.includes(p._id) || p._id === currentProductId)
      .map((product) => ({
        label: product.name,
        value: product._id,
        disabled: !product.quantity,
      })) as SelectProps["options"];
  };

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const localOnClose = () => {
    reset();
    onClose();
  };

  const onSelectProduct = (index: number, productId: string) => {
    const product = products.find((p) => p._id === productId);

    setValue(`items.${index}.productId`, productId);

    if (!product) {
      return;
    }

    const currentQty = getValues(`items.${index}.quantity`);

    if (currentQty > product.quantity) {
      setValue(`items.${index}.quantity`, product.quantity);
    }
  };

  const onCreate = async () => {
    const dto = getValues();

    if (!dto.items.length) {
      return;
    }

    try {
      setLoading(true);

      dto.items = dto.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }));

      await dispatch(
        orderActions.createOrder({
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

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Create order"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={localOnClose}
        />
      }
    >
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faCartShopping} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">Create Order</Text>
            <Text fontSize="small" color="textSecondary">
              Add products and quantities
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Order Items</Text>
          </SectionHeader>

          {fields.map((field, index) => (
            <div key={field.id}>
              <ProductRow>
                <Controller
                  control={control}
                  name={`items.${index}.productId`}
                  rules={{
                    required: {
                      value: true,
                      message: "Please select a product or remove this item",
                    },
                  }}
                  render={({ field: { value } }) => {
                    const options = getProductsOptions(value);

                    return (
                      <StyledSelect
                        title="Select product"
                        value={options?.find((p) => p.value === value)}
                        onChange={(value) => onSelectProduct(index, value)}
                        options={options}
                      />
                    );
                  }}
                />

                <Controller
                  control={control}
                  name={`items.${index}.quantity`}
                  rules={{
                    required: {
                      value: true,
                      message: "Quantity is required",
                    },
                    min: {
                      value: 1,
                      message: "Quantity must be at least 1",
                    },
                    max: {
                      value:
                        products.find((p) => p._id === items[index]?.productId)
                          ?.quantity || 0,
                      message:
                        "This product does not have enough quantity available",
                    },
                  }}
                  render={({ field: { value, onChange } }) => {
                    const maxAvailableQty =
                      Number(
                        products.find((p) => p._id === items[index]?.productId)
                          ?.quantity,
                      ) || 0;

                    return (
                      <QuantityInputWrapper>
                        <Input
                          type="number"
                          min={1}
                          max={maxAvailableQty}
                          value={value}
                          onChange={(e) => {
                            const rawValue = e.target.value;

                            if (rawValue === "") {
                              onChange("");
                              return;
                            }

                            const val = Number(rawValue);

                            onChange(
                              val > maxAvailableQty ? maxAvailableQty : val,
                            );
                          }}
                        />
                      </QuantityInputWrapper>
                    );
                  }}
                />

                <RemoveButton
                  icon={faXmark}
                  onClick={() => remove(index)}
                  variant="danger"
                  disabled={fields.length === 1}
                />
              </ProductRow>

              {errors.items?.[index]?.quantity && items[index]?.productId ? (
                <ErrorText>
                  {errors.items[index].quantity?.message as string}
                </ErrorText>
              ) : null}

              {errors.items?.[index]?.productId ? (
                <ErrorText>
                  {errors.items[index].productId?.message as string}
                </ErrorText>
              ) : null}
            </div>
          ))}

          <AddItemButton
            onClick={() => append({ productId: "", quantity: 1 })}
            icon={faPlus}
            disabled={loading || fields.length === products.length}
          >
            Add Item
          </AddItemButton>
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
