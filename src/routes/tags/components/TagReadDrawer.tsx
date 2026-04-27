import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import { faFingerprint } from "@fortawesome/free-solid-svg-icons/faFingerprint";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import type { Tag } from "../../../model/tag/types/Tag";

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

const TagTitle = styled.h2`
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

const HighlightText = styled(ValueText)`
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

type TagReadDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
  tag: Tag | null;
};

export const TagReadDrawer: React.FC<TagReadDrawerProps> = ({
  open = false,
  onClose,
  tag,
}) => {
  if (!tag) {
    return null;
  }

  return (
    <Drawer open={open} onClose={onClose} title="Tag Details" size="large">
      <FormContainer>
        <GlassHeader>
          <IconWrapper>
            <Icon icon={faTag} />
          </IconWrapper>
          <TitleGroup>
            <TagTitle>{tag.name}</TagTitle>
            <Subtitle>Product Metadata Label</Subtitle>
          </TitleGroup>
        </GlassHeader>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faChartLine} />
            <h4>Usage Statistics</h4>
          </SectionLabel>
          <DataGrid>
            <DataItem>
              <Label>Active Assignments</Label>
              <HighlightText>{tag.usageCount ?? 0} Products</HighlightText>
            </DataItem>
          </DataGrid>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faTag} />
            <h4>Classification</h4>
          </SectionLabel>
          <DataItem>
            <Label>Tag Name</Label>
            <ValueText>{tag.name}</ValueText>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faAlignLeft} />
            <h4>Usage Context</h4>
          </SectionLabel>
          <DataItem>
            <Label>Description</Label>
            <ValueText>
              {tag.description || "No description provided for this tag."}
            </ValueText>
          </DataItem>
        </InfoSection>

        <InfoSection>
          <SectionLabel>
            <Icon icon={faFingerprint} />
            <h4>System Reference</h4>
          </SectionLabel>
          <DataItem>
            <Label>Unique Identifier</Label>
            <IDText>{tag._id}</IDText>
          </DataItem>
        </InfoSection>
      </FormContainer>
    </Drawer>
  );
};
