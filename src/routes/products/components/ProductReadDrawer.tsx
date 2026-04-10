import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import type { Product } from "../../../model/product/types/Product";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faDollarSign } from "@fortawesome/free-solid-svg-icons/faDollarSign";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import { faLayerGroup } from "@fortawesome/free-solid-svg-icons/faLayerGroup";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { Text } from "../../../components/Text";
import { formatDate } from "../../../utils/Date";

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
  p:first-child {
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  p {
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
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  svg {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  span {
    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.875rem;
  }

  p {
    color: ${({ theme }) => theme.colors.textPrimary};
    background: ${({ theme }) => theme.colors.background};
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};
    border-radius: ${({ theme }) => theme.radius.md};
    margin: 0;
  }
`;

const BadgeContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Badge = styled.div`
  background: ${({ theme }) => theme.colors.primary}10;
  color: ${({ theme }) => theme.colors.primary};
  padding: 4px 12px;
  border-radius: ${({ theme }) => theme.radius.full};
  font-size: 0.875rem;
  border: 1px solid ${({ theme }) => theme.colors.primary}33;
`;

const ProductID = styled(Text)`
  font-size: "0.85rem";
  font-family: "monospace";
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
    if (!product.discount) {
      return "No discount";
    }

    if (product.discount.type === "percentage") {
      return `${product.discount.value}%`;
    }

    return `$${product.discount.value.toFixed(2)}`;
  };

  return (
    <Drawer open={open} onClose={onClose} title="Product details" size="large">
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faBox} />
          </HeroIcon>
          <HeroText>
            <Text fontSize="subtitle">{product.name}</Text>
            <Text>Inventory Item</Text>
          </HeroText>
        </Hero>

        <Card>
          <SectionHeader>
            <Icon icon={faTag} />
            <Text fontSize="subtitle">Basic information</Text>
          </SectionHeader>
          <Field>
            <span>Description</span>
            <Text>{product.description || "No description provided."}</Text>
          </Field>
          <Field>
            <span>Tags</span>
            <BadgeContainer>
              {product?.tags?.length ? (
                product.tags.map((tag) => (
                  <Badge key={tag.name}>{tag.name}</Badge>
                ))
              ) : (
                <Text color="textSecondary">—</Text>
              )}
            </BadgeContainer>
          </Field>
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faDollarSign} />
            <Text fontSize="subtitle">Pricing & Inventory</Text>
          </SectionHeader>
          <FieldGrid>
            <Field>
              <span>Base Price</span>
              <Text>${(product?.price || 0).toFixed(2)}</Text>
            </Field>
            <Field>
              <span>Discount</span>
              <Text>{formatDiscount()}</Text>
            </Field>
            <Field>
              <span>Quantity in Stock</span>
              <Text>{product.quantity}</Text>
            </Field>
          </FieldGrid>
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faLayerGroup} />
            <Text fontSize="subtitle">Organization</Text>
          </SectionHeader>
          <Field>
            <span>Category</span>
            {product.category?.name ? (
              <BadgeContainer>
                <Badge>{product.category.name}</Badge>
              </BadgeContainer>
            ) : (
              <Text>Uncategorized</Text>
            )}
          </Field>
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faClock} />
            <Text fontSize="subtitle">History</Text>
          </SectionHeader>
          <FieldGrid>
            <Field>
              <span>Created At</span>
              <Text>{formatDate(product.createdAt, true)}</Text>
            </Field>
            <Field>
              <span>Last Updated</span>
              <Text>{formatDate(product.updatedAt, true)}</Text>
            </Field>
          </FieldGrid>
        </Card>

        <Card>
          <SectionHeader>
            <Icon icon={faCircleInfo} />
            <Text fontSize="subtitle">System Details</Text>
          </SectionHeader>
          <Field>
            <span>System ID</span>
            <ProductID>{product._id}</ProductID>
          </Field>
        </Card>
      </Content>
    </Drawer>
  );
};
