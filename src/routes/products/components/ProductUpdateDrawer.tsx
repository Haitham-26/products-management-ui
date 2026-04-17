import type React from "react";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import type { Product } from "../../../model/product/types/Product";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import type { UpdateProductDto } from "../../../model/product/dto/UpdateProductDto";
import { faPercent } from "@fortawesome/free-solid-svg-icons/faPercent";
import { Select } from "../../../components/Select";
import { Text } from "../../../components/Text";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons/faAngleDown";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { Dropdown } from "../../../components/Dropdown";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { Button } from "../../../components/Button";
import { faXmarkCircle } from "@fortawesome/free-solid-svg-icons/faXmarkCircle";
import productSliceSelectors from "../../../redux/product/products.selector";
import { useSearchParams } from "react-router-dom";
import {
  buildProductsParams,
  parseProductsFiltersFromParams,
} from "../utils/productUtils";

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
  background: ${({ theme }) => theme.colors.primary}1A;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  h2 {
    font-size: ${({ theme }) => theme.typography.subtitle};
  }

  p {
    font-size: ${({ theme }) => theme.typography.small};
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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

  h4 {
    font-size: ${({ theme }) => theme.typography.body};
  }

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const TagsButton = styled(Button)`
  width: 8rem;
`;

const TagButton = styled(Button)`
  padding: ${({ theme }) => theme.spacing.sm} !important;
  font-size: 0.75rem !important;
`;

const TagsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
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
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categories = useAppSelector(categorySliceSelectors.selectCategories)!;
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);

  const [searchParams, setSearchParams] = useSearchParams();

  const { control, handleSubmit, reset, getValues, watch } =
    useForm<UpdateProductDto>({
      defaultValues: {
        name: "",
        description: "",
        price: 0,
        discount: {
          type: "percentage",
          value: 0,
        },
        quantity: 0,
        userId,
        productId: "",
        categoryId: "",
        tags: [],
      },
    });

  const { append, remove, fields } = useFieldArray({
    control,
    name: "tags",
  });

  const filters = useMemo(
    () => parseProductsFiltersFromParams(searchParams, productsMeta),
    [searchParams, productsMeta],
  );

  const [discountType, discountValue, price] = watch([
    "discount.type",
    "discount.value",
    "price",
  ]);

  const categoriesOptions = useMemo(
    () =>
      categories.map((category) => ({
        label: category.name,
        value: category._id,
      })),
    [categories],
  );

  const tagsOptions = useMemo(
    () =>
      tags
        ?.filter((tag) => !fields?.find((field) => field.tag === tag._id))
        ?.map((tag) => ({
          key: tag._id,
          icon: <Icon icon={faPlus} />,
          label: tag.name,
          onClick: () =>
            append({
              tag: tag._id,
            }),
        })),
    [append, tags, fields],
  );

  const onSave = async () => {
    if (!product) {
      return;
    }

    try {
      setLoading(true);

      const dto = getValues();

      dto.price = Number(dto.price);
      dto.quantity = Number(dto.quantity);

      if (!dto.discount?.type) {
        delete dto.discount;
      } else {
        if (dto.discount?.value) {
          dto.discount.value = Number(dto.discount.value);
        }
      }

      // @ts-expect-error We send the tag IDs only
      dto.tags = dto.tags?.map((tag) => tag.tag) as string[];

      await dispatch(
        productActions.updateProduct({
          ...dto,
          ...(dto?.price ? { price: Number(dto.price) } : {}),
        }),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      onClose();
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
        discount: product.discount,
        categoryId: product.category?._id,
        tags: (product?.tags || []).map((tag) => ({
          tag: tag._id,
        })),
        userId,
      });
    }
  }, [product, reset, open, userId]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title="Edit product"
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
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faBox} />
          </HeroIcon>

          <HeroText>
            <h2>Edit product</h2>
            <p>Update product information</p>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <h4>Product details</h4>
          </SectionHeader>

          <Controller
            control={control}
            name="name"
            rules={{ required: "Product name is required" }}
            render={({ field, fieldState }) => (
              <Input
                title="Name"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="description"
            render={({ field }) => (
              <Textarea title="Description" rows={4} {...field} />
            )}
          />
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faDollarSign} />
            <h4>Pricing & stock</h4>
          </SectionHeader>

          <Controller
            control={control}
            name="price"
            rules={{ min: { value: 0, message: "Price must be ≥ 0" } }}
            render={({ field, fieldState }) => (
              <Input
                title="Price"
                type="number"
                placeholder="0.00"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          <Controller
            control={control}
            name="quantity"
            rules={{ min: { value: 0, message: "Quantity must be ≥ 0" } }}
            render={({ field, fieldState }) => (
              <Input
                title="Quantity"
                type="number"
                placeholder="0"
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faPercent} />
            <h4>Discount</h4>
          </SectionHeader>

          <Controller
            control={control}
            name="discount.type"
            render={({ field: { value, onChange } }) => (
              <Select
                title="Discount type"
                value={value}
                onChange={onChange}
                options={[
                  { value: "percentage", label: "Percentage" },
                  { value: "fixed", label: "Fixed" },
                ]}
              />
            )}
          />

          <Controller
            control={control}
            name="discount.value"
            rules={{
              min: { value: 0, message: "Discount must be ≥ 0" },
              validate: (v) =>
                discountType !== "percentage" ||
                (!isNaN(v || 0) && Number(v) <= 100) ||
                "Max is 100%",
            }}
            render={({ field, fieldState }) => (
              <Input
                title="Discount value"
                type="number"
                placeholder={discountType === "percentage" ? "0 – 100" : "0.00"}
                errorMessage={fieldState.error?.message}
                {...field}
              />
            )}
          />

          {!isNaN(Number(discountValue)) &&
          !isNaN(Number(price)) &&
          discountType ? (
            <Text color="textSecondary" fontSize="small">
              Price after discount:{" "}
              <b>
                $
                {(discountType === "percentage"
                  ? price! - (price! * discountValue!) / 100
                  : price! - discountValue!
                ).toFixed(2)}
              </b>
            </Text>
          ) : null}
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faFolder} />
            <h4>Category</h4>
          </SectionHeader>

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <Select
                title="Select category"
                value={categoriesOptions?.find((c) => c.value === value)}
                onChange={(v) => onChange(v || null)}
                options={categoriesOptions}
              />
            )}
          />
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faTags} />
            <h4>Tags</h4>
          </SectionHeader>

          <Dropdown menu={{ items: tagsOptions }}>
            <TagsButton icon={faAngleDown} variant="ghost">
              Tags
            </TagsButton>
          </Dropdown>

          <TagsWrapper>
            {fields?.map((field, index) => (
              <TagButton
                variant="ghost"
                icon={faXmarkCircle}
                onClick={() => remove(index)}
                key={field.id}
              >
                {tags?.find((t) => t._id === field.tag)?.name}
              </TagButton>
            ))}
          </TagsWrapper>
        </Card>
      </Content>
    </Drawer>
  );
};
