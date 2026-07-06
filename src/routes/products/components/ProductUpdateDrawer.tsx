import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faTicket } from "@fortawesome/free-solid-svg-icons/faTicket";
import type { Product } from "../../../model/product/types/Product";
import type { UpdateProductDto } from "../../../model/product/dto/UpdateProductDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Select } from "../../../components/Select";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { Toast } from "../../../utils/Toast";
import { useSearchParams } from "react-router-dom";
import {
  buildProductsParams,
  calculateProductFinalPrice,
} from "../utils/productUtils";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { Text } from "../../../components/Text";
import { SearchSelect } from "../../../components/SearchSelect";
import { tagActions } from "../../../redux/tag/tags.slice";
import debounce from "lodash/debounce";
import { categoryActions } from "../../../redux/category/categories.slice";
import { checkPermissions } from "../../../utils/checkPermissions";
import { Info } from "../../../components/Info";
import { ImageUpload } from "../../../components/ImageUpload";
import { faImages } from "@fortawesome/free-solid-svg-icons/faImages";
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import isEmpty from "lodash/isEmpty";
import type { UploadFile } from "antd";
import { createUploadFileFromImageUrl } from "../../../utils/createUploadFileFromImageUrl";
import { isArray } from "lodash";

const MAX_GALLERY_IMAGES_COUNT = 5;

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

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
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

const ImagesGrid = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ImageUploadCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
`;

const ImageCardHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ImageCardTitle = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  span {
    font-weight: bold;
  }
`;

const ImageCountBadge = styled.span<{ complete?: boolean }>`
  font-size: ${({ theme }) => theme.typography.small};
  font-weight: bold;
  padding: ${({ theme }) =>
    `calc(${theme.spacing.sm} / 2) ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  white-space: nowrap;
  color: ${({ theme, complete }) =>
    complete ? theme.colors.success : theme.colors.textSecondary};
  background: ${({ theme, complete }) =>
    complete ? `${theme.colors.success}15` : `${theme.colors.border}80`};
`;

const ImageHelperText = styled(Text)`
  line-height: 1.4;
`;

type ProductUpdateDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  product: Product | null;
  filters: Partial<GetProductsDto>;
};

export const ProductUpdateDrawer: React.FC<ProductUpdateDrawerProps> = ({
  open,
  onClose,
  product,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchCategoriesLoading, setSearchCategoriesLoading] = useState(false);
  const [searchTagsLoading, setSearchTagsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categories = useAppSelector(categorySliceSelectors.selectCategories)!;
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const { control, handleSubmit, reset, getValues, watch, setValue } =
    useForm<UpdateProductDto>();

  const [discountValue, discountType, price, mainImage, galleryImages] = watch([
    "discount.value",
    "discount.type",
    "price",
    "mainImage",
    "galleryImages",
  ]);

  const tagsPermissions = checkPermissions(user, "tags");
  const categoriesPermissions = checkPermissions(user, "categories");

  const categoriesOptions = useMemo(
    () => categories.map((c) => ({ label: c.name, value: c._id })),
    [categories],
  );

  const tagsOptions = useMemo(
    () =>
      tags.map((tag) => ({
        label: tag.name,
        value: tag._id,
      })),
    [tags],
  );

  const finalPrice = useMemo(() => {
    return calculateProductFinalPrice(price || 0, {
      type: discountType as ProductDiscountTypes,
      value: discountValue || 0,
    });
  }, [price, discountType, discountValue]);

  const taxonomyHint = useMemo(() => {
    if (!categoriesPermissions.READ && !tagsPermissions.READ) {
      return "You don't have access to categories or tags.";
    }

    if (!categoriesPermissions.READ) {
      return "You don't have access to categories.";
    }

    if (!tagsPermissions.READ) {
      return "You don't have access to tags.";
    }

    return null;
  }, [categoriesPermissions.READ, tagsPermissions.READ]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchCategories = useCallback(
    debounce(async (keyword: string) => {
      try {
        setSearchCategoriesLoading(true);

        await dispatch(
          categoryActions.getCategories({
            userId,
            keyword,
            meta: { page: 1, limit: 50 },
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setSearchCategoriesLoading(false);
      }
    }, 800),
    [dispatch, userId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTags = useCallback(
    debounce(async (keyword: string) => {
      try {
        setSearchTagsLoading(true);

        await dispatch(
          tagActions.getTags({ userId, keyword, meta: { page: 1, limit: 50 } }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setSearchTagsLoading(false);
      }
    }, 800),
    [dispatch, userId],
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
        tags: dto.tags || [],
        minStock: dto.minStock ? Number(dto.minStock) : undefined,
      };

      await dispatch(
        productActions.updateProduct(payload as UpdateProductDto),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      onClose();

      Toast.success("Product updated successfully");
    } catch (e) {
      Toast.apiError(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!product || !open) {
      return;
    }

    const initForm = async () => {
      const mainImage = await createUploadFileFromImageUrl(
        product?.mainImage?.secureUrl,
      );

      const galleryImages = (
        product.galleryImages?.length
          ? await Promise.all(
              product.galleryImages.map((img) =>
                createUploadFileFromImageUrl(img.secureUrl),
              ),
            )
          : []
      ) as UploadFile[];

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
        tags: product?.tags?.map((t) => t._id) || [],
        minStock: product?.minStock,
        mainImage: mainImage || undefined,
        galleryImages,
        userId,
      });
    };

    initForm();
  }, [product, reset, open, userId]);

  useEffect(() => {
    const maxValue =
      discountType === ProductDiscountTypes.PERCENTAGE
        ? 100
        : Number(price) || 0;

    if (Number(discountValue) > maxValue) {
      setValue("discount.value", maxValue);
    }
  }, [price, discountType, discountValue, setValue]);

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
          <Icon icon={faBoxOpen} size="2xl" color="primary" />

          <TitleGroup>
            <Text fontWeight="bold" fontSize="subtitle">
              Edit Product
            </Text>
            <Text color="textSecondary" fontSize="small">
              Modify the properties of your existing item
            </Text>
          </TitleGroup>
        </GlassHeader>

        <FormSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <Text>Identification</Text>
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
            <Icon icon={faImages} />
            <Text>Images</Text>
          </SectionLabel>

          <ImagesGrid>
            <ImageUploadCard>
              <ImageCardHeader>
                <ImageCardTitle>
                  <Icon icon={faImage} size="sm" color={"textSecondary"} />
                  <span>Cover Image</span>
                </ImageCardTitle>
                <ImageCountBadge complete={!isEmpty(mainImage)}>
                  {!isEmpty(mainImage) ? "Added" : "Recommended"}
                </ImageCountBadge>
              </ImageCardHeader>

              <ImageHelperText fontSize="small" color="textSecondary">
                This is the main photo customers see in listings and search
                results. A square, well-lit shot works best.
              </ImageHelperText>

              <Controller
                control={control}
                name="mainImage"
                render={({ field: { value = [], onChange } }) => (
                  <ImageUpload
                    maxCount={1}
                    fileList={!isArray(value) ? [value as UploadFile] : value}
                    onChange={onChange}
                  >
                    {isEmpty(value) ? "Upload Cover Image" : null}
                  </ImageUpload>
                )}
              />
            </ImageUploadCard>

            <ImageUploadCard>
              <ImageCardHeader>
                <ImageCardTitle>
                  <Icon icon={faImages} size="sm" color="textSecondary" />
                  <span>Gallery</span>
                </ImageCardTitle>
                <ImageCountBadge
                  complete={Boolean(
                    galleryImages?.length &&
                    galleryImages.length >= MAX_GALLERY_IMAGES_COUNT,
                  )}
                >
                  {galleryImages?.length || 0} / {MAX_GALLERY_IMAGES_COUNT}
                </ImageCountBadge>
              </ImageCardHeader>

              <ImageHelperText fontSize="small" color="textSecondary">
                Add extra angles, packaging, or lifestyle shots to help
                customers decide.
              </ImageHelperText>

              <Controller
                control={control}
                name="galleryImages"
                render={({ field: { value = [], onChange } }) => (
                  <ImageUpload
                    multiple
                    maxCount={MAX_GALLERY_IMAGES_COUNT}
                    onChange={onChange}
                    fileList={value}
                    showAspectSlider
                  >
                    {value?.length < MAX_GALLERY_IMAGES_COUNT
                      ? "Upload Gallery Images"
                      : null}
                  </ImageUpload>
                )}
              />
            </ImageUploadCard>
          </ImagesGrid>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faCoins} />
            <Text>Economics</Text>
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
            <Text>Promotions</Text>
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
            <Text>Taxonomy</Text>
          </SectionLabel>

          {taxonomyHint ? <Info>{taxonomyHint}</Info> : null}

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <SearchSelect
                title="Select Category"
                value={categoriesPermissions.READ && value ? value : undefined}
                onChange={onChange}
                options={categoriesOptions}
                onSearch={searchCategories}
                allowClear
                loading={searchCategoriesLoading}
                placeholder="Search for a category..."
                disabled={!categoriesPermissions.READ}
              />
            )}
          />

          <Controller
            control={control}
            name="tags"
            render={({ field: { value: tags, onChange } }) => (
              <SearchSelect
                title="Select Tags"
                mode="multiple"
                value={tagsPermissions.READ && tags ? tags : []}
                onChange={onChange}
                options={tagsOptions}
                onSearch={searchTags}
                loading={searchTagsLoading}
                allowClear
                placeholder="Search for tags..."
                disabled={!tagsPermissions.READ}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
