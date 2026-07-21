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
import { faImage } from "@fortawesome/free-solid-svg-icons/faImage";
import { faImages } from "@fortawesome/free-solid-svg-icons/faImages";
import type { CreateProductDto } from "../../../model/product/dto/CreateProductDto";
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
import type { ProductDiscount } from "../../../model/product/types/ProductDiscount";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { SearchSelect } from "../../../components/SearchSelect";
import { categoryActions } from "../../../redux/category/categories.slice";
import debounce from "lodash/debounce";
import isEmpty from "lodash/isEmpty";
import { Text } from "../../../components/Text";
import { tagActions } from "../../../redux/tag/tags.slice";
import { checkPermissions } from "../../../utils/checkPermissions";
import { Info } from "../../../components/Info";
import { ImageUpload } from "../../../components/ImageUpload";
import { isArray } from "lodash";
import type { UploadFile } from "antd";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";
import type { ThemeType } from "../../../theme/theme";

const MAX_GALLERY_IMAGES_COUNT = 5;

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

const TwoInputsWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: flex-end;
  gap: ${({ theme }) => theme.spacing.md};
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

type ProductCreateDrawerProps = {
  open: boolean;
  onClose: () => void;
  filters: Partial<GetProductsDto>;
};

export const ProductCreateDrawer: React.FC<ProductCreateDrawerProps> = ({
  open,
  onClose,
  filters,
}) => {
  const [loading, setLoading] = useState(false);
  const [searchCategoriesLoading, setSearchCategoriesLoading] = useState(false);
  const [searchTagsLoading, setSearchTagsLoading] = useState(false);

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const Toast = useAppToast();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const { t } = useTranslation();
  const { control, handleSubmit, getValues, reset, watch, setValue } =
    useForm<CreateProductDto>({
      defaultValues: {
        name: "",
        description: "",
        purchasePrice: 0,
        salePrice: 0,
        quantity: 0,
        discount: { type: ProductDiscountTypes.PERCENTAGE, value: 0 },
        userId,
        categoryId: "",
        tags: [],
        minStock: settings?.inventory?.defaultMinStock || 10,
        // @ts-expect-error because the ImageUpload component expects an array
        mainImage: [],
        galleryImages: [],
      },
    });

  const [
    discountValue,
    discountType,
    purchasePrice,
    salePrice,
    mainImage,
    watchedGalleryImages,
  ] = watch([
    "discount.value",
    "discount.type",
    "purchasePrice",
    "salePrice",
    "mainImage",
    "galleryImages",
  ]);

  const galleryImages = watchedGalleryImages || [];

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

  const tagsPermissions = checkPermissions(user, "tags");
  const categoriesPermissions = checkPermissions(user, "categories");

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

  const localOnClose = () => {
    reset();
    onClose();
  };

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

  const handleSubmission = async () => {
    try {
      setLoading(true);

      const data = getValues();

      const payload = {
        ...data,
        purchasePrice: Number(data.purchasePrice),
        salePrice: Number(data.salePrice),
        quantity: Number(data.quantity),
        discount: data.discount
          ? {
              ...data.discount,
              value: Number(data.discount.value),
            }
          : undefined,
        tags: data.tags || [],
        minStock: Number(data.minStock),
        ...(isArray(data.mainImage) && data.mainImage?.[0]?.originFileObj
          ? { mainImage: data.mainImage[0].originFileObj }
          : {}),
        ...(isArray(data.galleryImages)
          ? {
              galleryImages: data.galleryImages
                .filter((img) => img.originFileObj)
                .map((img) => img.originFileObj),
            }
          : {}),
      };

      await dispatch(
        productActions.createProduct(payload as CreateProductDto),
      ).unwrap();

      setSearchParams(buildProductsParams(filters, searchParams), {
        replace: true,
      });

      reset();
      onClose();

      Toast.success(t("products.create.success"));
    } catch (e) {
      Toast.apiError(e);
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

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
      onClose={localOnClose}
      title={t("products.create.title")}
      size="large"
      extra={
        <DrawerExtraHeader
          loading={loading}
          onConfirm={handleSubmit(handleSubmission)}
          onCancel={localOnClose}
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
                    fileList={value as UploadFile[]}
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
                  complete={galleryImages.length >= MAX_GALLERY_IMAGES_COUNT}
                >
                  {galleryImages.length} / {MAX_GALLERY_IMAGES_COUNT}
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
                value={categoriesPermissions.READ && value ? value : undefined}
                onChange={onChange}
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
                value={tagsPermissions.READ && tags ? tags : []}
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
