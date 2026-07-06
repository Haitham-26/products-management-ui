import type React from "react";
import { useCallback, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { Button } from "../../../components/Button";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { faXmark } from "@fortawesome/free-solid-svg-icons/faXmark";
import { faNoteSticky } from "@fortawesome/free-solid-svg-icons/faNoteSticky";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useSearchParams } from "react-router-dom";
import { buildOrdersParams } from "../utils/orderUtils";
import { orderActions } from "../../../redux/order/orders.slice";
import productSliceSelectors from "../../../redux/product/products.selector";
import type { CreateOrderDto } from "../../../model/order/dto/CreateOrderDto";
import { Toast } from "../../../utils/Toast";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { PhoneInput } from "../../../components/PhoneInput";
import { ProductStockStatus } from "../../../model/product/types/ProductStockStatus.enum";
import { Text } from "../../../components/Text";
import { stringWithCurrencyCode } from "../../../utils/String";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import { ProductStatus } from "../../../model/product/types/ProductStatus.enum";
import debounce from "lodash/debounce";
import { productActions } from "../../../redux/product/products.slice";
import { SearchSelect } from "../../../components/SearchSelect";
import { checkPermissions } from "../../../utils/checkPermissions";
import { Info } from "../../../components/Info";
import { ProductMainImage } from "../../products/components/ProductMainImage";

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

const StockAlert = styled.span<{ status: ProductStockStatus }>`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme, status }) => {
    switch (status) {
      case ProductStockStatus.OUT_OF_STOCK:
        return theme.colors.error;
      case ProductStockStatus.LOW_STOCK:
        return theme.colors.warning;
      default:
        return theme.colors.textSecondary;
    }
  }};
  font-weight: 700;
`;

const ProductOptionContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
  width: 100%;
`;

const Hr = styled.hr`
  border: 0;
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
  margin-bottom: ${({ theme }) => theme.spacing.sm};
`;

const ProductNameContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type OrderCreateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  filters: Partial<GetOrdersDto>;
};

export const OrderCreateDrawer: React.FC<OrderCreateDrawerProps> = ({
  open = false,
  onClose,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchProductsLoading, setSearchProductsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppSelector(userSliceSelectors.selectUser);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const products = useAppSelector(productSliceSelectors.selectProducts);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<CreateOrderDto>({
    defaultValues: {
      customerName: "",
      customerPhone: "",
      customerEmail: "",
      items: [{ productId: "", quantity: 1 }],
      note: "",
      userId,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });

  const productsMap = useMemo(() => {
    return new Map(
      products
        .filter((p) => p.status !== ProductStatus.DRAFT)
        .map((p) => [p._id, p.priceAfterDiscount]),
    );
  }, [products]);

  const totalAmount = useMemo(() => {
    return watchedItems.reduce((total, item) => {
      const productFinalPrice = productsMap.get(item.productId);

      return total + (productFinalPrice || 0) * item.quantity;
    }, 0);
  }, [watchedItems, productsMap]);

  const getProductsOptions = useCallback(
    (currentProductId?: string) => {
      const selectedIds = watchedItems?.map((i) => i.productId).filter(Boolean);

      return products
        .filter(
          (p) => !selectedIds.includes(p._id) || p._id === currentProductId,
        )
        .map((product) => {
          const threshold = product.minStock || 10;

          const isOutOfStock = product.quantity <= 0;
          const isLowStock = !isOutOfStock && product.quantity <= threshold;

          return {
            label: (
              <ProductOptionContainer>
                <ProductNameContainer>
                  <ProductMainImage url={product.mainImage?.secureUrl} />

                  <span>{product.name}</span>
                </ProductNameContainer>

                {isOutOfStock ? (
                  <StockAlert status={ProductStockStatus.OUT_OF_STOCK}>
                    Out of stock
                  </StockAlert>
                ) : isLowStock ? (
                  <StockAlert status={ProductStockStatus.LOW_STOCK}>
                    Only {product.quantity} left
                  </StockAlert>
                ) : (
                  <StockAlert status={ProductStockStatus.IN_STOCK}>
                    {product.quantity} left
                  </StockAlert>
                )}
              </ProductOptionContainer>
            ),
            value: product._id,
            disabled: isOutOfStock,
          };
        });
    },
    [products, watchedItems],
  );

  const productsPermissions = checkPermissions(user, "products");

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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchProducts = useCallback(
    debounce(async (keyword: string) => {
      try {
        setSearchProductsLoading(true);

        await dispatch(
          productActions.getProducts({
            userId,
            keyword,
            meta: { page: 1, limit: 50 },
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setSearchProductsLoading(false);
      }
    }, 800),
    [dispatch, userId],
  );

  const onCreate = async (data: CreateOrderDto) => {
    if (!data.items.length) {
      return;
    }

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
          confirmDisabled={!productsPermissions.CREATE}
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
            <Icon icon={faUser} />
            <h4>Customer Information</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="customerName"
            rules={{
              required: {
                value: true,
                message: "Customer name is required.",
              },
              maxLength: {
                value: 30,
                message: "Customer name must be 30 at most.",
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Name"
                required
                errorMessage={error?.message}
                valid={!error}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerEmail"
            render={({ field, fieldState: { error } }) => (
              <Input
                title="Email"
                errorMessage={error?.message}
                valid={!error}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="customerPhone"
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <PhoneInput
                title="Phone"
                errorMessage={error?.message}
                value={value}
                onChange={onChange}
                valid={!error}
              />
            )}
          />
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Order Items</h4>
          </SectionLabel>

          {!productsPermissions.CREATE ? (
            <Info>You don't have access to products.</Info>
          ) : null}

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
                    rules={{
                      required:
                        index === 0
                          ? "Please select a product"
                          : "Please select a product or remove this row",
                    }}
                    render={({ field: { value }, fieldState: { error } }) => {
                      const options = getProductsOptions(value);

                      return (
                        <SearchSelect
                          title="Select Product"
                          value={
                            options?.find((p) => p.value === value) || undefined
                          }
                          onChange={(val) => onSelectProduct(index, val)}
                          options={options}
                          onSearch={searchProducts}
                          allowClear
                          loading={searchProductsLoading}
                          placeholder="Search for a product..."
                          valid={!error}
                          disabled={!productsPermissions.READ}
                        />
                      );
                    }}
                  />

                  <Controller
                    control={control}
                    name={`items.${index}.quantity`}
                    rules={{
                      required: "Required",
                      min: { value: 1, message: "Quantity must be at least 1" },
                      ...(field.productId
                        ? {
                            max: {
                              value: maxAvailableQty,
                              message: `Quantity must be at most ${maxAvailableQty}, current stock of this product is ${maxAvailableQty}`,
                            },
                          }
                        : {}),
                    }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
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
                        valid={!error}
                        disabled={!productsPermissions.READ}
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

                {errors.items?.[index]?.productId ? (
                  <ErrorText>
                    * {errors.items[index]?.productId?.message}
                  </ErrorText>
                ) : null}

                {errors.items?.[index]?.quantity ? (
                  <ErrorText>
                    * {errors.items[index]?.quantity?.message}
                  </ErrorText>
                ) : null}
              </div>
            );
          })}

          <div>
            <Hr />

            <Text color="textSecondary" fontSize="small" fontWeight="bold">
              Total order's amount:{" "}
              {stringWithCurrencyCode(settings.currency, totalAmount)}
            </Text>
          </div>

          <AddItemButton
            onClick={() => append({ productId: "", quantity: 1 })}
            icon={faPlus}
            variant="secondary"
            disabled={
              loading ||
              fields.length === products.length ||
              !productsPermissions.READ
            }
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
