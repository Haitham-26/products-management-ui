import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import type { Product } from "../../../model/product/types/Product";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { formatDate } from "../../../utils/Date";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { Image } from "../../../components/Image";
import { Image as AntdImage } from "antd";
import { Text } from "../../../components/Text";
import { useTranslation } from "react-i18next";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const HeaderSection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: center;

  @media (max-width: 600px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const HeaderMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StockAlert = styled.div<{ danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme, danger }) =>
    danger ? `${theme.colors.error}15` : `${theme.colors.warning}15`};
  color: ${({ theme, danger }) =>
    danger ? theme.colors.error : theme.colors.warning};
  font-size: ${({ theme }) => theme.typography.small};
  font-weight: 700;
  width: fit-content;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};

  &:first-of-type {
    border-top: none;
    padding-top: 0;
  }
`;

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const StaticTag = styled.span`
  background: ${({ theme }) => theme.colors.textPrimary};
  color: ${({ theme }) => theme.colors.surface};
  padding: 4px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.75rem;
  font-weight: 500;
`;

const ImageWrapper = styled.div`
  width: 6.5rem;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  flex-shrink: 0;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }
  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const GalleryImageWrapper = styled.div`
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  cursor: pointer;

  .ant-image,
  .ant-image-img {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover;
    border-radius: inherit !important;
  }
`;

const EmptyImageState = styled.div`
  width: 6.5rem;
  aspect-ratio: 1 / 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

type ProductReadDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  product: Product | null;
};

export const ProductReadDrawer: React.FC<ProductReadDrawerProps> = ({
  open,
  onClose,
  product,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  if (!product) {
    return null;
  }

  const minStock = product.minStock || 10;
  const isOutOfStock = (product.quantity || 0) <= 0;
  const isLowStock = !isOutOfStock && (product.quantity || 0) <= minStock;

  const hasDiscount = product.discount?.type && product.discount?.value;

  const formatDiscount = () => {
    if (!hasDiscount || !product.discount) {
      return t("common.none");
    }

    if (product.discount.type === ProductDiscountTypes.PERCENTAGE) {
      return `${product.discount.value}%`;
    }

    return stringWithCurrencyCode(settings.currency, product.discount.value);
  };

  const calculateFinalPrice = () => {
    const price = product.price || 0;
    const discountValue = product.discount?.value || 0;

    if (product.discount?.type === ProductDiscountTypes.PERCENTAGE) {
      return price - (price * discountValue) / 100;
    }

    return price - discountValue;
  };

  return (
    <Drawer
      open={open}
      onClose={onClose}
      title={t("products.read.title")}
      size="large"
    >
      <FormContainer>
        <HeaderSection>
          {product.mainImage?.secureUrl ? (
            <ImageWrapper>
              <Image
                src={product.mainImage.secureUrl}
                alt={product.name}
                loading="lazy"
                preview
              />
            </ImageWrapper>
          ) : (
            <EmptyImageState>
              <Icon icon={faBoxOpen} />
            </EmptyImageState>
          )}

          <HeaderMeta>
            <Text fontWeight="bold" fontSize="subtitle">
              {product.name}
            </Text>
            <Text color="textSecondary">
              {product.category?.name || t("common.uncategorized")}
            </Text>
            {(isLowStock || isOutOfStock) && (
              <StockAlert danger={isOutOfStock}>
                <Icon icon={faTriangleExclamation} />
                {isOutOfStock
                  ? t("products.stockStatus.outOfStock")
                  : t("products.read.lowStock", { count: product.quantity })}
              </StockAlert>
            )}
          </HeaderMeta>
        </HeaderSection>

        {!!product.galleryImages?.length && (
          <Section>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("products.read.gallery")}
            </Text>
            <GalleryGrid>
              <AntdImage.PreviewGroup>
                {product.galleryImages.map((img, i) => (
                  <GalleryImageWrapper key={img.publicId || i}>
                    <Image
                      src={img.secureUrl}
                      alt={`${product.name}-${i}`}
                      loading="lazy"
                      preview
                    />
                  </GalleryImageWrapper>
                ))}
              </AntdImage.PreviewGroup>
            </GalleryGrid>
          </Section>
        )}

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.description")}
            </Text>
            <Text
              fontStyle={!product.description?.length ? "italic" : undefined}
            >
              {product.description || t("products.read.noDescription")}
            </Text>
          </DataItem>

          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.tags")}
            </Text>
            {product.tags?.length ? (
              <TagCloud>
                {product.tags.map((t) => (
                  <StaticTag key={t._id}>{t.name}</StaticTag>
                ))}
              </TagCloud>
            ) : (
              <Text fontStyle={"italic"}>{t("products.read.noTags")}</Text>
            )}
          </DataItem>
        </Section>

        <Section>
          <DataGrid>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("products.fields.basePrice")}
              </Text>
              <Text>
                {stringWithCurrencyCode(settings.currency, product.price)}
              </Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("products.fields.discount")}
              </Text>
              <Text fontStyle={!hasDiscount ? "italic" : undefined}>
                {formatDiscount()}
              </Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("products.fields.finalPrice")}
              </Text>
              <Text color="success">
                {stringWithCurrencyCode(
                  settings.currency,
                  calculateFinalPrice(),
                )}
              </Text>
            </DataItem>
            <DataItem>
              <Text fontSize="small" color="textSecondary" fontWeight="bold">
                {t("products.read.availableStock")}
              </Text>
              <Text>{product.quantity}</Text>
            </DataItem>
          </DataGrid>
        </Section>

        <Section>
          <DataItem>
            <Text fontSize="small" color="textSecondary" fontWeight="bold">
              {t("common.filters.creationDate.title")}
            </Text>
            <Text>{formatDate(product.createdAt, true)}</Text>
          </DataItem>
        </Section>
      </FormContainer>
    </Drawer>
  );
};
