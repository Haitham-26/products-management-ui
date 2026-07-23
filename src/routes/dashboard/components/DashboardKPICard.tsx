import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type React from "react";
import styled from "styled-components";
import { Icon } from "../../../components/Icon";
import { Text } from "../../../components/Text";
import isString from "lodash/isString";
import { Tag } from "antd";

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

const Title = styled(Text)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};
  font-weight: 500;
`;

const StyledTag = styled(Tag)`
  font-size: calc(${({ theme }) => theme.typography.small} * 0.75);
  font-weight: 500;
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
  badgeContent: string;
  value: string | number | React.ReactNode;
  extra?: React.ReactNode;
};

export const DashboardKPICard: React.FC<DashboardKPICardProps> = ({
  icon,
  title,
  badgeContent,
  value,
  extra,
}) => {
  return (
    <Container>
      <Header>
        <Title>
          {title}

          <StyledTag color={"blue"}>{badgeContent}</StyledTag>
        </Title>
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
