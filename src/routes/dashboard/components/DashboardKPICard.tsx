import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type React from "react";
import styled from "styled-components";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import isString from "lodash/isString";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.xs};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  min-height: 120px;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const MainValue = styled.div`
  display: flex;
  align-items: baseline;
  padding: ${({ theme }) => theme.spacing.xs} 0;
`;

const Footer = styled.div`
  display: flex;
  align-items: center;
  min-height: 24px;
`;

type DashboardKPICardProps = {
  icon: IconProp;
  title: string;
  value: string | number | React.ReactNode;
  extra?: React.ReactNode;
};

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  icon,
  title,
  value,
  extra,
}) => {
  return (
    <Container>
      <Header>
        <Text fontSize="small" color="textSecondary" fontWeight="medium">
          {title}
        </Text>
        <Icon icon={icon} size="sm" color="textSecondary" />
      </Header>

      <MainValue>
        {isString(value) || typeof value === "number" ? (
          <Text fontSize="subtitle" color="primary" fontWeight="bold">
            {value}
          </Text>
        ) : (
          value
        )}
      </MainValue>

      <Footer>{extra || null}</Footer>
    </Container>
  );
};
