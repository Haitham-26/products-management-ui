import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faFolderOpen } from "@fortawesome/free-solid-svg-icons/faFolderOpen";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import { faAlignLeft } from "@fortawesome/free-solid-svg-icons/faAlignLeft";
import type { Category } from "../../../model/category/types/Category";

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
  background: ${({ theme }) => theme.colors.primary}1a;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 1.5rem;
  }
`;

const HeroText = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
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

const Row = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.md};

  svg {
    margin-top: 2px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
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
    <Drawer open={open} onClose={onClose} title="Category details" size="large">
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faFolderOpen} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">{category.name}</Text>
            <Text fontSize="small" color="textSecondary">
              Category overview
            </Text>
          </HeroText>
        </Hero>

        <Card>
          <Row>
            <Icon icon={faTag} />
            <div>
              <Text fontSize="subtitle" color="textSecondary">
                Name
              </Text>
              <Text>{category.name}</Text>
            </div>
          </Row>

          <Row>
            <Icon icon={faAlignLeft} />
            <div>
              <Text fontSize="subtitle" color="textSecondary">
                Description
              </Text>
              <Text>{category.description || "No description provided"}</Text>
            </div>
          </Row>
        </Card>
      </Content>
    </Drawer>
  );
};
