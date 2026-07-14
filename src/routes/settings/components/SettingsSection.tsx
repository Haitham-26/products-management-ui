import type React from "react";
import { styled } from "styled-components";
import { Text } from "../../../components/Text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  &:not(:first-child) {
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: ${({ theme }) => theme.spacing.lg};
    margin-top: ${({ theme }) => theme.spacing.lg};
  }
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

type SettingsSectionProps = {
  title: string;
  description: string;
  content: React.ReactNode;
};

export const SettingsSection: React.FC<SettingsSectionProps> = ({
  title,
  description,
  content,
}) => {
  return (
    <Container>
      <Header>
        <Text fontWeight="bold">{title}</Text>

        <Text fontSize="small" color="textSecondary">
          {description}
        </Text>
      </Header>

      {content}
    </Container>
  );
};
