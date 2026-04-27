import type React from "react";
import { useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { Select, type SelectProps } from "../../../components/Select";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons/faNoteSticky";
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
import type { CreateOrderDto } from "../../../model/order/dto/CreateOrderDto";
import { Toast } from "../../../utils/Toast";

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

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 120px 44px;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
  padding-bottom: ${({ theme }) => theme.spacing.md};
  border-bottom: 1px dashed ${({ theme }) => theme.colors.border};

  &:last-of-type {
    border-bottom: none;
  }
`;

const RemoveButton = styled(Button)`
  height: 2rem !important;
  width: 2rem !important;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 !important;
`;

const ErrorText = styled.span`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.75rem;
  font-weight: 500;
  margin-top: 4px;
  display: block;
`;

const AddItemButton = styled(Button)`
  align-self: flex-start;
  margin-top: ${({ theme }) => theme.spacing.sm};
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
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const products = useAppSelector(productSliceSelectors.selectProducts);

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

  const watchedItems = watch("items");

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const getProductsOptions = (currentProductId?: string) => {
    const selectedIds = watchedItems?.map((i) => i.productId).filter(Boolean);
    return products
      .filter((p) => !selectedIds.includes(p._id) || p._id === currentProductId)
      .map((product) => ({
        label: `${product.name}${!product.quantity ? " (out of stock)" : ""}`,
        value: product._id,
        disabled: !product.quantity,
      })) as SelectProps["options"];
  };

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

  const onCreate = async (data: CreateOrderDto) => {
    if (!data.items.length) return;

    try {
      setLoading(true);
      const formattedItems = data.items.map((item) => ({
        ...item,
        quantity: Number(item.quantity),
      }));

      await dispatch(
        orderActions.createOrder({
          ...data,
          items: formattedItems,
          userId,
        }),
      ).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });
      localOnClose();
      Toast.success("Order created successfully");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Drawer
      open={open}
      onClose={localOnClose}
      title="Create Order"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={localOnClose}
        />
      }
    >
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faCartShopping} />
          </IconWrapper>
          <TitleGroup>
            <h2>New Purchase Order</h2>
            <span>Select products and set stock quantities</span>
          </TitleGroup>
        </GlassHeader>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Order Items</h4>
          </SectionLabel>

          {fields.map((field, index) => {
            const currentProductId = watchedItems[index]?.productId;
            const product = products.find((p) => p._id === currentProductId);
            const maxAvailableQty = product?.quantity || 0;

            return (
              <div key={field.id}>
                <ProductRow>
                  <Controller
                    control={control}
                    name={`items.${index}.productId`}
                    rules={{ required: "Product selection is required" }}
                    render={({ field: { value } }) => {
                      const options = getProductsOptions(value);
                      return (
                        <Select
                          title="Select Product"
                          value={options?.find((p) => p.value === value)}
                          onChange={(val) => onSelectProduct(index, val)}
                          options={options}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`items.${index}.quantity`}
                    rules={{
                      required: "Required",
                      min: { value: 1, message: "Min 1" },
                      max: {
                        value: maxAvailableQty,
                        message: `Max ${maxAvailableQty}`,
                      },
                    }}
                    render={({ field: { value, onChange } }) => (
                      <Input
                        title="Qty"
                        type="number"
                        min={1}
                        max={maxAvailableQty}
                        value={value}
                        onChange={(e) => {
                          const val =
                            e.target.value === "" ? "" : Number(e.target.value);
                          onChange(
                            val !== "" && val > maxAvailableQty
                              ? maxAvailableQty
                              : val,
                          );
                        }}
                      />
                    )}
                  />

                  <RemoveButton
                    icon={faXmark}
                    onClick={() => remove(index)}
                    variant="danger"
                    disabled={fields.length === 1}
                  />
                </ProductRow>

                {errors.items?.[index]?.productId && (
                  <ErrorText>
                    {errors.items[index]?.productId?.message}
                  </ErrorText>
                )}
                {errors.items?.[index]?.quantity && (
                  <ErrorText>
                    {errors.items[index]?.quantity?.message}
                  </ErrorText>
                )}
              </div>
            );
          })}

          <AddItemButton
            onClick={() => append({ productId: "", quantity: 1 })}
            icon={faPlus}
            variant="secondary"
            disabled={loading || fields.length === products.length}
          >
            Add Another Product
          </AddItemButton>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faNoteSticky} />
            <h4>Additional Remarks</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea
                title="Internal Note"
                placeholder="Shipping instructions, customer notes, etc."
                rows={4}
                {...field}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
