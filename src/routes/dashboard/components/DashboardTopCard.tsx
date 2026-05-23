import type React from "react";
import styled from "styled-components";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import { Text } from "../../../components/Text";
import { Icon } from "../../../components/Icon";

import {
  faArrowRight,
  faAngleUp,
  faAngleDown,
  faExclamationTriangle,
  faTimesCircle,
} from "@fortawesome/free-solid-svg-icons";

type Variants = "MAIN" | "WARNING" | "DANGER" | "DEFAULT";

const getBackgroundIcon = (variant: Variants) => {
  switch (variant) {
    case "DANGER":
      return faTimesCircle;

    case "WARNING":
      return faExclamationTriangle;

    default:
      return null;
  }
};

const Container = styled.div<{ variant: Variants }>`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  min-height: 12rem;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  position: relative;
  overflow: hidden;

  ${({ variant, theme }) => {
    switch (variant) {
      case "MAIN":
        return `
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0) 0%,
              rgba(0, 0, 0, 0.25) 100%
            ),
            ${theme.colors.primary};
        `;
      case "WARNING":
        return `
          background: ${theme.colors.warning}12;
        `;

      case "DANGER":
        return `
          background: ${theme.colors.error}12;
        `;

      default:
        return `
          background: ${theme.colors.surface};
        `;
    }
  }}
`;

const BackgroundIcon = styled(Icon)<{ variant: Variants }>`
  position: absolute;
  inset-inline-end: -1rem;
  bottom: -1rem;
  font-size: 6rem;
  pointer-events: none;
  z-index: 0;

  ${({ variant, theme }) => {
    switch (variant) {
      case "WARNING":
        return `
          color: ${theme.colors.warning};
          opacity: 0.08;
        `;

      case "DANGER":
        return `
          color: ${theme.colors.error};
          opacity: 0.08;
        `;

      default:
        return `display: none;`;
    }
  }}
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
  z-index: 1;
`;

const StyledLink = styled(Link)<{ variant: Variants }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: ${({ theme }) => theme.radius.full};
  transform: rotate(315deg);
  transition: all 0.2s ease-in-out;
  z-index: 1;

  ${({ variant, theme }) => {
    if (variant === "MAIN") {
      return `
        background: ${theme.colors.surface};
        border: 1px solid transparent;

        svg {
          color: ${theme.colors.primary};
        }

        &:hover {
          transform: rotate(360deg);
          background: ${theme.colors.surface}e5;
        }
      `;
    }

    const hoverColor =
      variant === "DANGER"
        ? theme.colors.error
        : variant === "WARNING"
          ? theme.colors.warning
          : theme.colors.primary;

    const borderColor =
      variant === "DEFAULT" ? theme.colors.border : `${hoverColor}40`;

    return `
      background: transparent;
      border: 1px solid ${borderColor};

      svg {
        color: ${theme.colors.textPrimary};
      }

      &:hover {
        transform: rotate(360deg);
        background: ${borderColor};

        svg {
          color: ${hoverColor};
        }
      }
    `;
  }}
`;

const Divider = styled.hr<{ variant: Variants }>`
  border: 0;
  height: 1px;
  margin: 0;
  z-index: 1;
  background: ${({ variant, theme }) =>
    variant === "MAIN" ? "rgba(255, 255, 255, 0.15)" : theme.colors.border};
`;

const ContentWrapper = styled.div`
  z-index: 1;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1;
`;

const StatGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const TimeframeLabel = styled(Text)<{ variant: Variants }>`
  text-transform: uppercase;
  font-size: 0.6rem;
  font-weight: 600;

  color: ${({ variant, theme }) =>
    variant === "MAIN" ? theme.colors.onPrimary : theme.colors.textSecondary};

  opacity: ${({ variant }) => (variant === "MAIN" ? 0.7 : 1)};
`;

const ValueWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const TrendIcon = styled(Icon)<{
  isNegative?: boolean;
  variant: Variants;
}>`
  font-size: 10px;

  color: ${({ isNegative, variant, theme }) => {
    if (variant === "MAIN") {
      return theme.colors.onPrimary;
    }

    return isNegative ? theme.colors.error : theme.colors.success;
  }};
`;

type CardTrends = {
  today: number;
  lastWeek: number;
  lastMonth: number;
};

type DashboardTopCardProps = {
  title: string;
  link: string;
  totalCount: number;
  variant?: Variants;
  trends?: CardTrends;
};

export const DashboardTopCard: React.FC<DashboardTopCardProps> = ({
  title,
  link,
  totalCount,
  variant = "DEFAULT",
  trends,
}) => {
  const isMain = variant === "MAIN";

  const textColor = isMain ? "onPrimary" : "textPrimary";

  const renderStat = (value: number) => {
    const isNegative = value < 0;
    const absoluteValue = Math.abs(value);

    return (
      <ValueWrapper>
        <TrendIcon
          icon={isNegative ? faAngleDown : faAngleUp}
          isNegative={isNegative}
          variant={variant}
        />

        <Text fontWeight="bold" fontSize="body" color={textColor}>
          {absoluteValue}
        </Text>
      </ValueWrapper>
    );
  };

  const bgIcon = getBackgroundIcon(variant);

  return (
    <Container variant={variant}>
      {bgIcon ? <BackgroundIcon icon={bgIcon} variant={variant} /> : null}

      <Header>
        <Text fontWeight="bold" fontSize="subtitle" color={textColor}>
          {title}
        </Text>

        <StyledLink to={link} variant={variant}>
          <Icon icon={faArrowRight} />
        </StyledLink>
      </Header>

      <ContentWrapper>
        <Text fontWeight="bold" fontSize="subtitle" color={textColor}>
          {totalCount.toLocaleString()}
        </Text>
      </ContentWrapper>

      {trends ? (
        <Fragment>
          <Divider variant={variant} />

          <FooterGrid>
            <StatGroup>
              <TimeframeLabel variant={variant}>Today</TimeframeLabel>

              {renderStat(trends.today)}
            </StatGroup>

            <StatGroup>
              <TimeframeLabel variant={variant}>Last Week</TimeframeLabel>

              {renderStat(trends.lastWeek)}
            </StatGroup>

            <StatGroup>
              <TimeframeLabel variant={variant}>Last Month</TimeframeLabel>

              {renderStat(trends.lastMonth)}
            </StatGroup>
          </FooterGrid>
        </Fragment>
      ) : null}
    </Container>
  );
};
