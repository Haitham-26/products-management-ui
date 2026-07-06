import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import type { Product } from "../../../model/product/types/Product";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faCoins } from "@fortawesome/free-solid-svg-icons/faCoins";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons/faFingerprint";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { formatDate } from "../../../utils/Date";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { stringWithCurrencyCode } from "../../../utils/String";
import { Image } from "../../../components/Image";
import { Image as AntdImage } from "antd";

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.md};
`;

const GlassHeader = styled.header`
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.primary}0d;
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.primary}20;
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconWrapper = styled.div`
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.primary}15;

  display: flex;
  align-items: center;
  justify-content: center;

  font-size: 1.75rem;
  color: ${({ theme }) => theme.colors.primary};

  flex-shrink: 0;
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

const StockAlert = styled.div<{ danger?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  width: fit-content;
  margin-top: ${({ theme }) => theme.spacing.sm};
  padding: 6px 10px;

  border-radius: ${({ theme }) => theme.radius.full};

  background: ${({ theme, danger }) =>
    danger ? `${theme.colors.error}15` : `${theme.colors.warning}15`};

  color: ${({ theme, danger }) =>
    danger ? theme.colors.error : theme.colors.warning};

  border: 1px solid
    ${({ theme, danger }) =>
      danger ? `${theme.colors.error}35` : `${theme.colors.warning}35`};

  font-size: 0.78rem;
  font-weight: 700;
`;

const InfoSection = styled.section`
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

const DataGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const DataItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;

  label {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSecondary};
    text-transform: uppercase;
    font-weight: 600;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.textPrimary};
    font-size: 1rem;
  }
`;

const FinalPriceText = styled.p`
  margin: 0;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.success} !important;
  font-size: 1.1rem !important;
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

const IDText = styled.code`
  background: ${({ theme }) => theme.colors.background};
  padding: 4px 8px;
  border-radius: ${({ theme }) => theme.radius.sm};
  font-family: monospace;
  font-size: 0.85rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  align-self: flex-start;
`;

const EmptyStateText = styled.p`
  color: ${({ theme }) => theme.colors.textSecondary} !important;
  font-style: italic;
  font-size: 0.875rem !important;
`;

const ImageSection = styled.section`
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

const ImageCountBadge = styled.span`
  margin-left: auto;
  background: ${({ theme }) => theme.colors.primary}15;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 0.72rem;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: ${({ theme }) => theme.radius.full};
`;

const MainImageWrapper = styled.div`
  position: relative;
  width: 10rem;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const MainImage = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
  transition: transform 0.3s ease;

  ${MainImageWrapper}:hover & {
    transform: scale(1.03);
  }
`;

const MainImageTag = styled.span`
  position: absolute;
  top: ${({ theme }) => theme.spacing.sm};
  inset-inline-start: ${({ theme }) => theme.spacing.sm};
  background: rgba(0, 0, 0, 0.55);
  color: ${({ theme }) => theme.colors.surface};
  font-size: calc(${({ theme }) => theme.typography.small} / 1.5);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  border-radius: ${({ theme }) => theme.radius.full};
  backdrop-filter: blur(4px);
  z-index: 1;
`;

const GalleryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  border-top: ${({ theme }) => `1px solid ${theme.colors.border}`};
  padding-top: ${({ theme }) => theme.spacing.md};

  @media (max-width: 768px) {
    grid-template-columns: repeat(3, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;
const GalleryImageWrapper = styled.div`
  position: relative;
  aspect-ratio: 1 / 1;
  border-radius: ${({ theme }) => theme.radius.md};
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.background};
  cursor: pointer;
  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  .ant-image {
    width: 100% !important;
    height: 100% !important;

    .ant-image-img {
      border-radius: inherit !important;
      width: 100% !important;
      height: 100% !important;
    }
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary}60;
    box-shadow: ${({ theme }) => theme.shadow.sm};
  }
`;

const GalleryImage = styled(Image)`
  object-fit: cover;
  display: block;
  transition: transform 0.25s ease;

  ${GalleryImageWrapper}:hover & {
    transform: scale(1.08);
  }
`;

const EmptyImageState = styled.div`
  height: 14rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.xs};

  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.textSecondary};

  svg {
    font-size: 1.5rem;
    opacity: 0.5;
  }

  span {
    font-style: italic;
    font-size: 0.85rem;
  }
`;

const EmptyGalleryState = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-style: italic;
  font-size: 0.85rem;
  padding: ${({ theme }) => theme.spacing.sm} 0;
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
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const minStock = product?.minStock || 10;

  const isLowStock = (product?.quantity || 0) <= minStock;
  const isOutOfStock = (product?.quantity || 0) <= 0;

  const formatDiscount = () => {
    if (!product || !product.discount || product.discount.value === 0) {
      return "None";
    }

    if (product.discount.type === ProductDiscountTypes.PERCENTAGE) {
      return `${product.discount.value}%`;
    }

    return stringWithCurrencyCode(settings.currency, product.discount.value);
  };

  const calculateFinalPrice = () => {
    if (!product) {
      return 0;
    }

    const price = product.price || 0;
    const discountValue = product.discount?.value || 0;

    if (product.discount?.type === ProductDiscountTypes.PERCENTAGE) {
      return price - (price * discountValue) / 100;
    }

    return price - discountValue;
  };

  if (!product) {
    return null;
  }

  return (
    <Drawer open={open} onClose={onClose} title="Product Details" size="large">
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faBoxOpen} />
          </IconWrapper>

          <TitleGroup>
            <h2>{product.name}</h2>

            <span>Inventory Specifications</span>

            {(isLowStock || isOutOfStock) && (
              <StockAlert danger={isOutOfStock}>
                <Icon icon={faTriangleExclamation} />

                {isOutOfStock
                  ? "Out of stock"
                  : `Low stock • ${product.quantity} left`}
              </StockAlert>
            )}
          </TitleGroup>
        </GlassHeader>

        <ImageSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <h4>Product Images</h4>
            {!!product.galleryImages?.length && (
              <ImageCountBadge>
                {product.galleryImages.length + (product.mainImage ? 1 : 0)}{" "}
                photos
              </ImageCountBadge>
            )}
          </SectionLabel>

          {product.mainImage?.secureUrl ? (
            <MainImageWrapper>
              <MainImageTag>Main</MainImageTag>
              <MainImage
                src={product.mainImage.secureUrl}
                alt={product.name}
                loading="lazy"
                preview
              />
            </MainImageWrapper>
          ) : (
            <EmptyImageState>
              <Icon icon={faBoxOpen} />
              <span>No main image uploaded</span>
            </EmptyImageState>
          )}

          {product.galleryImages?.length ? (
            <GalleryGrid>
              <AntdImage.PreviewGroup>
                {product.galleryImages.map((img, i) => (
                  <GalleryImageWrapper key={img.publicId || i}>
                    <GalleryImage
                      src={img.secureUrl}
                      alt={`${product.name}-${i}`}
                      loading="lazy"
                      preview
                    />
                  </GalleryImageWrapper>
                ))}
              </AntdImage.PreviewGroup>
            </GalleryGrid>
          ) : (
            <EmptyGalleryState>No gallery images added yet</EmptyGalleryState>
          )}
        </ImageSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faCircleInfo} />
            <h4>General Information</h4>
          </SectionLabel>

          <DataItem>
            <label>Description</label>
            <p>{product.description || "No description provided."}</p>
          </DataItem>

          <DataItem>
            <label>Tags</label>

            <TagCloud>
              {product.tags?.length ? (
                product.tags.map((t) => (
                  <StaticTag key={t._id}>{t.name}</StaticTag>
                ))
              ) : (
                <EmptyStateText>No tags assigned</EmptyStateText>
              )}
            </TagCloud>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faCoins} />
            <h4>Pricing & Stock</h4>
          </SectionLabel>

          <DataGrid>
            <DataItem>
              <label>List Price</label>
              <p>{stringWithCurrencyCode(settings.currency, product.price)}</p>
            </DataItem>

            <DataItem>
              <label>Discount</label>
              <p>{formatDiscount()}</p>
            </DataItem>

            <DataItem>
              <label>Selling Price</label>

              <FinalPriceText>
                {stringWithCurrencyCode(
                  settings.currency,
                  calculateFinalPrice(),
                )}
              </FinalPriceText>
            </DataItem>

            <DataItem>
              <label>On Hand</label>
              <p>{product.quantity} Units</p>
            </DataItem>
          </DataGrid>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faLayerGroup} />
            <h4>Taxonomy</h4>
          </SectionLabel>

          <DataItem>
            <label>Category</label>
            <p>{product.category?.name || "Uncategorized"}</p>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faClock} />
            <h4>Lifecycle</h4>
          </SectionLabel>

          <DataGrid>
            <DataItem>
              <label>Created</label>
              <p>{formatDate(product.createdAt, true)}</p>
            </DataItem>

            <DataItem>
              <label>Last Modify</label>
              <p>{formatDate(product.updatedAt, true)}</p>
            </DataItem>
          </DataGrid>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faFingerprint} />
            <h4>Identification</h4>
          </SectionLabel>

          <DataItem>
            <label>System ID</label>
            <IDText>{product._id}</IDText>
          </DataItem>
        </InfoSection>
      </FormContainer>
    </Drawer>
  );
};
