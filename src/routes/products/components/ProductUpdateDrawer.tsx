import type React from "react";
import { useCallback, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { Controller, useForm } from "react-hook-form";
import { Drawer } from "../../../components/Drawer";
import { DrawerExtraHeader } from "../../../components/DrawerExtraHeader";
import { Input } from "../../../components/Input";
import { Textarea } from "../../../components/Textarea";
import { Icon } from "../../../components/Icon";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import type { Product } from "../../../model/product/types/Product";
import type { UpdateProductDto } from "../../../model/product/dto/UpdateProductDto";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Select } from "../../../components/Select";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { useSearchParams } from "react-router-dom";
import {
  buildProductsParams,
  calculateProductFinalSalePrice,
  calculateProductProfit,
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
import createUploadFileFromImageUrl from "../../../utils/createUploadFileFromImageUrl";
import { isArray } from "lodash";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";
import type { ThemeType } from "../../../theme/theme";
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";
import { Breakpoints } from "../../../theme/Breakpoints";

const MAX_GALLERY_IMAGES_COUNT = 5;

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

const TwoInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${Breakpoints.MD}) {
    grid-template-columns: 1fr 1fr;
  }
`;

const PriceBadge = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.success}10;
  border: 1px dashed ${({ theme }) => theme.colors.success};
  border-radius: ${({ theme }) => theme.radius.md};

  div {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${({ theme }) => theme.spacing.xs};

    &:first-child {
      border-bottom: 1px solid ${({ theme }) => theme.colors.border};
      padding-bottom: ${({ theme }) => theme.spacing.md};
      margin-bottom: ${({ theme }) => theme.spacing.md};
    }
  }

  span {
    font-size: ${({ theme }) => theme.typography.body};
  }
`;

const PriceBadgeBold = styled.b<{ color: keyof ThemeType["colors"] }>`
  color: ${({ theme, color }) => theme.colors[color]};
  font-size: ${({ theme }) => theme.typography.body};
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

  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const categories = useAppSelector(categorySliceSelectors.selectCategories)!;
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();
  const { control, handleSubmit, reset, getValues, watch, setValue } =
    useForm<UpdateProductDto>();

  const [
    discountValue,
    discountType,
    purchasePrice,
    salePrice,
    mainImage,
    galleryImages,
  ] = watch([
    "discount.value",
    "discount.type",
    "purchasePrice",
    "salePrice",
    "mainImage",
    "galleryImages",
  ]);

  const tagsPermissions = checkPermissions(user, "tags");
  const categoriesPermissions = checkPermissions(user, "categories");

  const categoriesOptions = useMemo(() => {
    const options = categories?.length
      ? categories
      : product?.category
        ? [product.category]
        : [];

    return options.map((c) => ({
      label: c.name,
      value: c._id,
    }));
  }, [categories, product?.category]);

  const tagsOptions = useMemo(() => {
    const options = tags?.length ? tags : product?.tags || [];

    return options.map((tag) => ({
      label: tag.name,
      value: tag._id,
    }));
  }, [tags, product?.tags]);

  const finalSalePrice = useMemo(() => {
    return calculateProductFinalSalePrice(salePrice, {
      type: discountType as ProductDiscount["type"],
      value: discountValue || 0,
    });
  }, [salePrice, discountType, discountValue]);

  const profit = useMemo(() => {
    return calculateProductProfit(salePrice, purchasePrice, {
      type: discountType as ProductDiscount["type"],
      value: discountValue || 0,
    });
  }, [discountType, discountValue, salePrice, purchasePrice]);

  const taxonomyHintTransKey = useMemo(() => {
    let transKeyPrefix = "products.create-edit.taxonomy.restrictions.";

    if (!categoriesPermissions.READ && !tagsPermissions.READ) {
      return (transKeyPrefix += "tagsAndCategories");
    }

    if (!categoriesPermissions.READ) {
      return (transKeyPrefix += "categories");
    }

    if (!tagsPermissions.READ) {
      return (transKeyPrefix += "tags");
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

      const getUploadImageValue = (image?: UploadFile | UploadFile[]) => {
        const _image = isArray(image) ? image[0] : image;

        return (_image?.originFileObj ?? _image?.url) || null;
      };

      const payload = {
        ...dto,
        purchasePrice: Number(dto.purchasePrice),
        salePrice: Number(dto.salePrice),
        quantity: Number(dto.quantity),
        discount: dto.discount?.type
          ? { ...dto.discount, value: Number(dto.discount.value) }
          : undefined,
        tags: dto.tags || [],
        minStock: dto.minStock ? Number(dto.minStock) : undefined,
        mainImage: getUploadImageValue(dto.mainImage),
        galleryImages: dto.galleryImages?.map((img) =>
          getUploadImageValue(img),
        ),
      };

      await dispatch(
        productActions.updateProduct(payload as UpdateProductDto),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      onClose();

      Toast.success(t("products.edit.success"));
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

    const mainImage = createUploadFileFromImageUrl(
      product?.mainImage?.secureUrl,
    ) as UploadFile;

    const galleryImages = (
      product.galleryImages?.length
        ? product.galleryImages.map((img) =>
            createUploadFileFromImageUrl(img.secureUrl),
          )
        : []
    ) as UploadFile[];

    reset({
      name: product.name,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
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
  }, [product, reset, open, userId]);

  useEffect(() => {
    const maxValue =
      discountType === ProductDiscountTypes.PERCENTAGE
        ? 100
        : Number(salePrice) || 0;

    if (Number(discountValue) > maxValue) {
      setValue("discount.value", maxValue);
    }
  }, [salePrice, discountType, discountValue, setValue]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("products.edit.title")}
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(onSave)}
          editMode
        />
      }
    >
      <FormContainer>
        <FormSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <Text>{t("products.create-edit.identification.title")}</Text>
          </SectionLabel>
          <Controller
            control={control}
            name="name"
            rules={{ required: t("errors.general.required") }}
            render={({ field, fieldState }) => (
              <Input
                title={t("common.name")}
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
              <Textarea title={t("common.description")} rows={3} {...field} />
            )}
          />
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faImages} />
            <Text>{t("products.create-edit.images.title")}</Text>
          </SectionLabel>

          <ImagesGrid>
            <ImageUploadCard>
              <ImageCardHeader>
                <ImageCardTitle>
                  <Icon icon={faImage} size="sm" color={"textSecondary"} />
                  <span>{t("products.create-edit.images.main.title")}</span>
                </ImageCardTitle>
                <ImageCountBadge complete={!isEmpty(mainImage)}>
                  {t(
                    !isEmpty(mainImage)
                      ? "products.create-edit.images.main.addedTag"
                      : "common.recommended",
                  )}
                </ImageCountBadge>
              </ImageCardHeader>

              <ImageHelperText fontSize="small" color="textSecondary">
                {t("products.create-edit.images.main.description")}
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
                    {isEmpty(value) ? t("common.uploadImage") : null}
                  </ImageUpload>
                )}
              />
            </ImageUploadCard>

            <ImageUploadCard>
              <ImageCardHeader>
                <ImageCardTitle>
                  <Icon icon={faImages} size="sm" color="textSecondary" />
                  <span>{t("products.create-edit.images.gallery.title")}</span>
                </ImageCardTitle>
                <ImageCountBadge
                  complete={
                    (galleryImages?.length || 0) >= MAX_GALLERY_IMAGES_COUNT
                  }
                >
                  {galleryImages?.length || 0} / {MAX_GALLERY_IMAGES_COUNT}
                </ImageCountBadge>
              </ImageCardHeader>

              <ImageHelperText fontSize="small" color="textSecondary">
                {t("products.create-edit.images.gallery.description")}
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
                      ? t("common.uploadImage")
                      : null}
                  </ImageUpload>
                )}
              />
            </ImageUploadCard>
          </ImagesGrid>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <Text>{t("products.create-edit.stock.title")}</Text>
          </SectionLabel>

          <TwoInputsWrapper>
            <Controller
              control={control}
              name="quantity"
              rules={{ required: t("errors.general.required") }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title={t("common.quantity")}
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
                  title={t("products.create-edit.stock.minStock.title")}
                  type="number"
                  info={t("products.create-edit.stock.minStock.info")}
                  errorMessage={error?.message}
                  min={0}
                  {...field}
                />
              )}
            />
          </TwoInputsWrapper>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faCoins} />
            <Text>{t("products.create-edit.price.title")}</Text>
          </SectionLabel>

          <TwoInputsWrapper>
            <Controller
              control={control}
              name="purchasePrice"
              rules={{ required: t("errors.general.required") }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title={t("products.create-edit.price.purchasePrice.title")}
                  required
                  errorMessage={error?.message}
                  type="number"
                  min={0}
                  info={t(
                    "products.create-edit.price.purchasePrice.explanation",
                  )}
                  {...field}
                />
              )}
            />

            <Controller
              control={control}
              name="salePrice"
              rules={{ required: t("errors.general.required") }}
              render={({ field, fieldState: { error } }) => (
                <Input
                  title={t("products.create-edit.price.salePrice.title")}
                  required
                  errorMessage={error?.message}
                  type="number"
                  min={0}
                  info={t("products.create-edit.price.salePrice.explanation")}
                  {...field}
                />
              )}
            />
          </TwoInputsWrapper>

          <TwoInputsWrapper>
            <Controller
              control={control}
              name="discount.type"
              render={({ field: { value, onChange } }) => (
                <Select
                  title={t("products.create-edit.price.discount.type.title")}
                  value={value}
                  onChange={onChange}
                  options={[
                    {
                      value: ProductDiscountTypes.PERCENTAGE,
                      label: t(
                        "products.create-edit.price.discount.types.percentage",
                      ),
                    },
                    {
                      value: ProductDiscountTypes.FIXED,
                      label: t(
                        "products.create-edit.price.discount.types.fixed",
                        {
                          currency: settings.currency,
                        },
                      ),
                    },
                  ]}
                />
              )}
            />
            <Controller
              control={control}
              name="discount.value"
              render={({ field }) => (
                <Input
                  title={t("products.create-edit.price.discount.value")}
                  type="number"
                  min={0}
                  {...field}
                />
              )}
            />
          </TwoInputsWrapper>

          <PriceBadge>
            <div>
              <span>{t("products.create-edit.price.finalSalePrice")}</span>
              <PriceBadgeBold color="success">
                {stringWithCurrencyCode(settings.currency, finalSalePrice)}
              </PriceBadgeBold>
            </div>
            <div>
              <span>{t("products.create-edit.price.profit")}</span>
              <PriceBadgeBold color={profit < 0 ? "error" : "success"}>
                {stringWithCurrencyCode(settings.currency, profit)}
              </PriceBadgeBold>
            </div>
          </PriceBadge>
        </FormSection>

        <FormSection>
          <SectionLabel>
            <Icon icon={faTags} />
            <Text>{t("products.create-edit.taxonomy.title")}</Text>
          </SectionLabel>

          {taxonomyHintTransKey ? <Info>{t(taxonomyHintTransKey)}</Info> : null}

          <Controller
            control={control}
            name="categoryId"
            render={({ field: { value, onChange } }) => (
              <SearchSelect
                title={t("common.category")}
                value={
                  categoriesPermissions.READ && value
                    ? categoriesOptions.find((c) => c.value === value)
                    : undefined
                }
                onChange={(v) => onChange(v || null)}
                options={categoriesOptions}
                onSearch={searchCategories}
                allowClear
                loading={searchCategoriesLoading}
                placeholder={t(
                  "products.create-edit.taxonomy.category.placeholder",
                )}
                disabled={!categoriesPermissions.READ}
              />
            )}
          />

          <Controller
            control={control}
            name="tags"
            render={({ field: { value: tags, onChange } }) => (
              <SearchSelect
                title={t("common.tags")}
                mode="multiple"
                value={
                  tagsPermissions.READ && tags
                    ? tagsOptions.filter((t) => tags.includes(t.value || ""))
                    : []
                }
                onChange={onChange}
                options={tagsOptions}
                onSearch={searchTags}
                loading={searchTagsLoading}
                allowClear
                placeholder={t(
                  "products.create-edit.taxonomy.tags.placeholder",
                )}
                disabled={!tagsPermissions.READ}
              />
            )}
          />
        </FormSection>
      </FormContainer>
    </Drawer>
  );
};
