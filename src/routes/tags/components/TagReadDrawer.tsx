import type React from "react";
import styled from "styled-components";
import { Drawer } from "../../../components/Drawer";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import { faTag } from "@fortawesome/free-solid-svg-icons/faTag";
import type { Tag } from "../../../model/tag/types/Tag";

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
    <Drawer open={open} onClose={onClose} title="Tag details" size="large">
      <Content>
        <Hero>
          <HeroIcon>
            <Icon icon={faTag} />
          </HeroIcon>

          <HeroText>
            <Text fontSize="title">{tag.name}</Text>
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
              <Text>{tag.name}</Text>
            </div>
          </Row>
        </Card>
      </Content>
    </Drawer>
  );
};
