import type React from "react";
import { styled } from "styled-components";
import { Text } from "../../../components/Text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};

  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
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
