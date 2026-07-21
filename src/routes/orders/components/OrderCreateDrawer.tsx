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
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
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

  p {
    text-transform: uppercase;
    letter-spacing: 1px;
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
    font-weight: bold;
  }
`;

const ProductRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 6rem 2rem;
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

const SummaryBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const SummaryRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
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

  const Toast = useAppToast();
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
      customerAddress: "",
      items: [{ productId: "", quantity: 1 }],
      note: "",
      userId,
    },
  });

  const { t } = useTranslation();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" });

  const productsMap = useMemo(() => {
    return new Map(
      products
        .filter((p) => p.status !== ProductStatus.DRAFT)
        .map((p) => [
          p._id,
          {
            finalSalePrice: p.finalSalePrice,
            profit: p.profit,
          },
        ]),
    );
  }, [products]);

  const totalAmount = useMemo(() => {
    return watchedItems.reduce((total, item) => {
      const product = productsMap.get(item.productId);

      return total + (product?.finalSalePrice || 0) * item.quantity;
    }, 0);
  }, [watchedItems, productsMap]);

  const totalProfit = useMemo(() => {
    return watchedItems.reduce((total, item) => {
      const product = productsMap.get(item.productId);

      return total + (product?.profit || 0) * item.quantity;
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

                  <span>
                    {product.name} (
                    {stringWithCurrencyCode(
                      settings.currency,
                      product.finalSalePrice,
                    )}
                    )
                  </span>
                </ProductNameContainer>

                {isOutOfStock ? (
                  <StockAlert status={ProductStockStatus.OUT_OF_STOCK}>
                    ({t("orders.create.items.dropdown.itemStockStatus.out")})
                  </StockAlert>
                ) : isLowStock ? (
                  <StockAlert status={ProductStockStatus.LOW_STOCK}>
                    (
                    {t("orders.create.items.dropdown.itemStockStatus.low", {
                      count: product.quantity,
                    })}
                    )
                  </StockAlert>
                ) : (
                  <StockAlert status={ProductStockStatus.IN_STOCK}>
                    (
                    {t("orders.create.items.dropdown.itemStockStatus.in", {
                      count: product.quantity,
                    })}
                    )
                  </StockAlert>
                )}
              </ProductOptionContainer>
            ),
            value: product._id,
            disabled: isOutOfStock,
          };
        });
    },
    [products, watchedItems, t, settings.currency],
  );

  const productsPermissions = checkPermissions(user, "products");

  const isAddProductButtonDisabled = useMemo(() => {
    return (
      loading ||
      fields.length === products.filter((p) => p.quantity > 0).length ||
      !productsPermissions.READ
    );
  }, [fields.length, loading, products, productsPermissions.READ]);

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

      await dispatch(
        productActions.getProducts({ userId, meta: { page: 1, limit: 50 } }),
      ).unwrap();

      setSearchParams(buildOrdersParams(filters, searchParams), {
        replace: true,
      });
      localOnClose();

      Toast.success(t("orders.create.success"));
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
      title={t("orders.create.title")}
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onCreate)}
          onCancel={localOnClose}
          confirmDisabled={!productsPermissions.CREATE}
        />
      }
      destroyOnHidden
    >
      <FormContainer>
        <FormSection>
          <SectionLabel>
            <Icon icon={faUser} />
            <Text>{t("orders.general.customerInfo.title")}</Text>
          </SectionLabel>
          <Controller
            control={control}
            name="customerName"
            rules={{
              required: {
                value: true,
                message: t("errors.general.required"),
              },
              maxLength: {
                value: 30,
                message: t("orders.create-edit.errors.customerInfo.name.long", {
                  length: 30,
                }),
              },
            }}
            render={({ field, fieldState: { error } }) => (
              <Input
                title={t("common.name")}
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
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <PhoneInput
                title={t("common.phone")}
                errorMessage={error?.message}
                value={value}
                onChange={onChange}
                valid={!error}
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
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <Text>{t("orders.general.items.title")}</Text>
          </SectionLabel>

          {!productsPermissions.CREATE ? (
            <Info>{t("orders.create.items.restriction")}</Info>
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
                          ? t("orders.create.errors.items.required")
                          : t("orders.create.errors.items.requiredOrRemove"),
                    }}
                    render={({ field: { value }, fieldState: { error } }) => {
                      const options = getProductsOptions(value);

                      return (
                        <SearchSelect
                          title={t("common.product")}
                          value={
                            options?.find((p) => p.value === value) || undefined
                          }
                          onChange={(val) => onSelectProduct(index, val)}
                          options={options}
                          onSearch={searchProducts}
                          allowClear
                          loading={searchProductsLoading}
                          placeholder={t(
                            "orders.create.items.dropdown.placeholder",
                          )}
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
                      required: t("errors.general.required"),
                      min: {
                        value: 1,
                        message: t("orders.create.errors.items.quantity.min", {
                          min: 1,
                        }),
                      },
                      ...(field.productId
                        ? {
                            max: {
                              value: maxAvailableQty,
                              message: t(
                                "orders.create.errors.items.quantity.max",
                                { max: maxAvailableQty },
                              ),
                            },
                          }
                        : {}),
                    }}
                    render={({
                      field: { value, onChange },
                      fieldState: { error },
                    }) => (
                      <Input
                        title={t("common.quantity")}
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

            <SummaryBox>
              <SummaryRow>
                <Text color="textSecondary">
                  {t("orders.general.items.totalAmount")}
                </Text>
                <Text fontWeight="600">
                  {stringWithCurrencyCode(settings.currency, totalAmount)}
                </Text>
              </SummaryRow>

              <SummaryRow>
                <Text color="textSecondary">
                  {t("orders.general.items.totalProfit")}
                </Text>
                <Text
                  color={totalProfit > 0 ? "success" : "error"}
                  fontWeight="600"
                >
                  {stringWithCurrencyCode(settings.currency, totalProfit)}
                </Text>
              </SummaryRow>
            </SummaryBox>
          </div>

          <AddItemButton
            onClick={() => append({ productId: "", quantity: 1 })}
            icon={faPlus}
            variant="secondary"
            disabled={isAddProductButtonDisabled}
          >
            {t("orders.create.items.action")}
          </AddItemButton>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faNoteSticky} />
            <Text>{t("orders.general.note.title")}</Text>
          </SectionLabel>
          <Controller
            control={control}
            name="note"
            render={({ field }) => (
              <Textarea title={t("common.note")} rows={4} {...field} />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
