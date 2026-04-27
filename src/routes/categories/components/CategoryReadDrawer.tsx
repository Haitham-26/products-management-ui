import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons/faFingerprint";
import { faBoxesStacked } from "@fortawesome/free-solid-svg-icons/faBoxesStacked";
import type { Category } from "../../../model/category/types/Category";

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
`;

const CategoryTitle = styled.h2`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.title};
`;

const Subtitle = styled.span`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
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
`;

const Label = styled.label`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  text-transform: uppercase;
  font-weight: 600;
`;

const ValueText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
  font-size: 1rem;
  line-height: 1.5;
`;

const CountHighlight = styled(ValueText)`
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
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

type CategoryReadDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  category: Category | null;
};

export const CategoryReadDrawer: React.FC<CategoryReadDrawerProps> = ({
  open = false,
  onClose,
  category,
}) => {
  if (!category) {
    return null;
  }

  return (
    <Drawer open={open} onClose={onClose} title="Category Details" size="large">
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faFolderOpen} />
          </IconWrapper>
          <TitleGroup>
            <CategoryTitle>{category.name}</CategoryTitle>
            <Subtitle>Organizational Group</Subtitle>
          </TitleGroup>
        </GlassHeader>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faBoxesStacked} />
            <h4>Statistics</h4>
          </SectionLabel>
          <DataGrid>
            <DataItem>
              <Label>Associated Products</Label>
              <CountHighlight>
                {category.childrenCount ?? 0} Items
              </CountHighlight>
            </DataItem>
          </DataGrid>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Identification</h4>
          </SectionLabel>
          <DataItem>
            <Label>Display Name</Label>
            <ValueText>{category.name}</ValueText>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faAlignLeft} />
            <h4>Content</h4>
          </SectionLabel>
          <DataItem>
            <Label>Description</Label>
            <ValueText>
              {category.description ||
                "No description provided for this category."}
            </ValueText>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faFingerprint} />
            <h4>System Reference</h4>
          </SectionLabel>
          <DataItem>
            <Label>Category ID</Label>
            <IDText>{category._id}</IDText>
          </DataItem>
        </InfoSection>
      </FormContainer>
    </Drawer>
  );
};
