import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons/faCircleXmark";
import { faTicket } from "@fortawesome/free-solid-svg-icons/faTicket";
import type { Product } from "../../../model/product/types/Product";
import type { UpdateProductDto } from "../../../model/product/dto/UpdateProductDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Select } from "../../../components/Select";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import { Button } from "../../../components/Button";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { Dropdown } from "../../../components/Dropdown";
import { Toast } from "../../../utils/Toast";
import productSliceSelectors from "../../../redux/product/products.selector";
import { useSearchParams } from "react-router-dom";
import {
  buildProductsParams,
  calculateProductFinalPrice,
  parseProductsFiltersFromParams,
} from "../utils/productUtils";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";

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
  border: 1px border ${({ theme }) => theme.colors.primary}20;
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

const InputGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const PriceBadge = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.success}10;
  border: 1px dashed ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radius.md};

  b {
    color: ${({ theme }) => theme.colors.success};
    font-size: ${({ theme }) => theme.typography.subtitle};
  }
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const ElegantTag = styled(Button)`
  all: unset;
  cursor: pointer;
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.surface};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.7rem;
  transition: opacity 0.2s;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  &:hover {
    opacity: 0.8;
  }
`;

type ProductUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  product: Product | null;
};

export const ProductUpdateDrawer: React.FC<ProductUpdateDrawerProps> = ({
  open,
  onClose,
  product,
}) => {
  const [loading, setLoading] = useState(false);
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categories = useAppSelector(categorySliceSelectors.selectCategories)!;
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const { control, handleSubmit, reset, getValues, watch } =
    useForm<UpdateProductDto>();

  const { append, remove, fields } = useFieldArray({ control, name: "tags" });

  const [discountValue, discountType, price] = watch([
    "discount.value",
    "discount.type",
    "price",
  ]);

  const categoriesOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c._id })),
    [categories],
  );

  const tagsOptions = useMemo(
    () =>
      tags
        ?.filter((tag) => !fields.some((f) => f.tag === tag._id))
        .map((tag) => ({
          key: tag._id,
          label: tag.name,
          onClick: () => append({ tag: tag._id }),
        })),
    [append, tags, fields],
  );

  const finalPrice = useMemo(() => {
    return calculateProductFinalPrice(price || 0, {
      type: discountType as ProductDiscountTypes,
      value: discountValue || 0,
    });
  }, [price, discountType, discountValue]);

  const filters = useMemo(
    () => parseProductsFiltersFromParams(searchParams, productsMeta),
    [searchParams, productsMeta],
  );

  const onSave = async () => {
    if (!product) {
      return;
    }

    try {
      setLoading(true);
      const dto = getValues();

      const payload = {
        ...dto,
        price: Number(dto.price),
        quantity: Number(dto.quantity),
        discount: dto.discount?.type
          ? { ...dto.discount, value: Number(dto.discount.value) }
          : undefined,
        tags: dto.tags?.map((t) => t.tag),
        minStock: dto.minStock ? Number(dto.minStock) : undefined,
      };

      await dispatch(
        productActions.updateProduct(payload as UpdateProductDto),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      onClose();
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (product && open) {
      reset({
        name: product.name,
        description: product.description,
        price: product.price,
        productId: product._id,
        quantity: product.quantity || 0,
        discount: product.discount || {
          type: ProductDiscountTypes.PERCENTAGE,
          value: 0,
        },
        categoryId: product.category?._id,
        tags: (product?.tags || []).map((tag) => ({ tag: tag._id })),
        minStock: product?.minStock,
        userId,
      });
    }
  }, [product, reset, open, userId]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Update Product"
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onSave)}
          onCancel={onClose}
          editMode
        />
      }
    >
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faBoxOpen} />
          </IconWrapper>
          <TitleGroup>
            <h2>Edit Product</h2>
            <span>Modify the properties of your existing item</span>
          </TitleGroup>
        </GlassHeader>

        <FormSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <h4>Identification</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: "Required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Product Title"
                errorMessage={fieldState.error?.message}
                required
                {...field}
              />
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea title="Description" rows={3} {...field} />
            )}
          />
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faCoins} />
            <h4>Economics</h4>
          </SectionLabel>
          <InputGrid>
            <Controller
              control={control}
              name="price"
              rules={{ required: "Required" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title="Base Price"
                  required
                  errorMessage={error?.message}
                  type="number"
                  min={0}
                  {...field}
                />
              )}
            />
            <Controller
              control={control}
              name="quantity"
              rules={{ required: "Required" }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title="Stock"
                  required
                  errorMessage={error?.message}
                  type="number"
                  min={0}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="minStock"
              render={({ field, fieldState: { error } }) => (
                <Input
                  title="Minimum Stock Alert"
                  type="number"
                  min={0}
                  info="You'll be warned when the stock quantity reaches this value (Next to the quantity in the products table, and during creating orders)."
                  errorMessage={error?.message}
                  {...field}
                />
              )}
            />
          </InputGrid>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTicket} />
            <h4>Promotions</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="discount.type"
            render={({ field: { value, onChange } }) => (
              <Select
                title="Strategy"
                value={value}
                onChange={onChange}
                options={[
                  {
                    value: ProductDiscountTypes.PERCENTAGE,
                    label: "Percent Off (%)",
                  },
                  {
                    value: ProductDiscountTypes.FIXED,
                    label: `Fixed Amount (${settings.currency})`,
                  },
                ]}
              />
            )}
          />
          <Controller
            control={control}
            name="discount.value"
            render={({ field }) => (
              <Input title="Value" type="number" min={0} {...field} />
            )}
          />
          <PriceBadge>
            <span>Live Price (After Discount):</span>
            <b>{stringWithCurrencyCode(settings.currency, finalPrice)}</b>
          </PriceBadge>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTags} />
            <h4>Taxonomy</h4>
          </SectionLabel>
          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <Select
                title="Primary Category"
                value={value}
                onChange={(v) => onChange(v || null)}
                options={categoriesOptions}
                allowClear
              />
            )}
          />

          <Dropdown menu={{ items: tagsOptions }}>
            <Button variant="ghost" icon={faChevronDown}>
              Attach Tags
            </Button>
          </Dropdown>

          <TagCloud>
            {fields.map((field, index) => (
              <ElegantTag key={field.id} onClick={() => remove(index)}>
                {tags?.find((t) => t._id === field.tag)?.name}
                <Icon icon={faCircleXmark} />
              </ElegantTag>
            ))}
          </TagCloud>
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
