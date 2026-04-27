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
import { formatDate } from "../../../utils/Date";

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
  if (!product) {
    return null;
  }

  const formatDiscount = () => {
    if (!product.discount || product.discount.value === 0) {
      return "None";
    }

    if (product.discount.type === "percentage") {
      return `${product.discount.value}%`;
    }

    return `$${product.discount.value.toFixed(2)}`;
  };

  const calculateFinalPrice = () => {
    const price = product.price || 0;
    const discountValue = product.discount?.value || 0;

    if (product.discount?.type === "percentage") {
      return price - (price * discountValue) / 100;
    }

    return price - discountValue;
  };

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
          </TitleGroup>
        </GlassHeader>

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
              <p>${product.price.toFixed(2)}</p>
            </DataItem>
            <DataItem>
              <label>Discount</label>
              <p>{formatDiscount()}</p>
            </DataItem>
            <DataItem>
              <label>Selling Price</label>
              <FinalPriceText>
                ${calculateFinalPrice().toFixed(2)}
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
