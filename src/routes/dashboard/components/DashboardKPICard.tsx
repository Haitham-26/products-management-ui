import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type React from "react";
import styled from "styled-components";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import isString from "lodash/isString";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type DashboardKPICardProps = {
  icon: IconProp;
  title: string;
  value: string | React.ReactNode;
};

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  icon,
  title,
  value,
}) => {
  return (
    <Container>
      <Header>
        <Icon icon={icon} size="sm" color="textSecondary" />

        <Text fontSize="small" color="textSecondary">
          {title}
        </Text>
      </Header>

      {isString(value) ? (
        <Text fontSize="subtitle" color="primary" fontWeight="bold">
          {value}
        </Text>
      ) : (
        value
      )}
    </Container>
  );
};
