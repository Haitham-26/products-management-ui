import type React from "react";
import styled from "styled-components";
import { Fragment } from "react";
import { Link } from "react-router-dom";

import { Text } from "../../../components/Text";
import { Icon } from "../../../components/Icon";

import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { faExclamationTriangle } from "@fortawesome/free-solid-svg-icons/faExclamationTriangle";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons/faTimesCircle";
import { useTranslation } from "react-i18next";

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
  flex-grow: 1;
  min-height: 13rem;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  position: relative;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);

  ${({ variant, theme }) => {
    switch (variant) {
      case "MAIN":
        return `
          background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primary}dd 100%);
          border: none;
        `;
      case "WARNING":
        return `
          background: ${theme.colors.warning}08;
          border-inline-start: 4px solid ${theme.colors.warning};
        `;
      case "DANGER":
        return `
          background: ${theme.colors.error}08;
          border-inline-start: 4px solid ${theme.colors.error};
        `;
      default:
        return `
          background: ${theme.colors.surface};
          border: 1px solid ${theme.colors.border};
        `;
    }
  }}
`;

const BackgroundIcon = styled(Icon)<{ variant: Variants }>`
  position: absolute;
  inset-inline-end: -0.5rem;
  bottom: -0.5rem;
  font-size: 7rem;
  pointer-events: none;
  z-index: 0;

  ${({ variant, theme }) => {
    switch (variant) {
      case "WARNING":
        return `
          color: ${theme.colors.warning};
          opacity: 0.06;
        `;
      case "DANGER":
        return `
          color: ${theme.colors.error};
          opacity: 0.06;
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
  width: 2.25rem;
  height: 2.25rem;
  border-radius: ${({ theme }) => theme.radius.full};
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
  z-index: 1;

  svg {
    html[dir="rtl"] & {
      transform: rotate(180deg);
    }
  }

  html[dir="ltr"] &:hover {
    transform: translateX(3px);
  }

  html[dir="rtl"] &:hover {
    transform: translateX(-3px);
  }

  ${({ variant, theme }) => {
    if (variant === "MAIN") {
      return `
        background: rgba(255, 255, 255, 0.2);

        svg {
          color: ${theme.colors.onPrimary};
        }

        &:hover {
          background: rgba(255, 255, 255, 0.3);
        }
      `;
    }

    const accentColor =
      variant === "DANGER"
        ? theme.colors.error
        : variant === "WARNING"
          ? theme.colors.warning
          : theme.colors.primary;

    return `
      background: ${theme.colors.surface};
      border: 1px solid ${theme.colors.border};

      svg {
        color: ${theme.colors.textSecondary};
      }

      &:hover {
        border-color: ${accentColor};

        svg {
          color: ${accentColor};
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
  margin-top: auto;
  margin-bottom: auto;
`;

const FooterGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme.spacing.sm};
  z-index: 1;
  padding-top: ${({ theme }) => theme.spacing.xs};
`;

const StatGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const TimeframeLabel = styled(Text)<{ variant: Variants }>`
  text-transform: uppercase;
  font-size: 0.65rem;
  font-weight: 700;
  letter-spacing: 0.5px;

  color: ${({ variant, theme }) =>
    variant === "MAIN" ? theme.colors.onPrimary : theme.colors.textSecondary};

  opacity: ${({ variant }) => (variant === "MAIN" ? 0.75 : 0.85)};
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
  const { t } = useTranslation();

  const getTextColor = () => {
    switch (variant) {
      case "MAIN":
        return "onPrimary";
      case "DANGER":
        return "error";
      case "WARNING":
        return "warning";
      default:
        return "textPrimary";
    }
  };

  const textColor = getTextColor();
  const bgIcon = getBackgroundIcon(variant);

  return (
    <Container variant={variant}>
      {bgIcon ? <BackgroundIcon icon={bgIcon} variant={variant} /> : null}

      <Header>
        <Text fontWeight="bold" fontSize="body" color={textColor}>
          {title}
        </Text>

        <StyledLink to={link} variant={variant}>
          <Icon icon={faArrowRight} />
        </StyledLink>
      </Header>

      <ContentWrapper>
        <Text fontWeight="bold" fontSize="subtitle" color={textColor}>
          {totalCount?.toLocaleString()}
        </Text>
      </ContentWrapper>

      {trends ? (
        <Fragment>
          <Divider variant={variant} />

          <FooterGrid>
            <StatGroup>
              <TimeframeLabel variant={variant}>
                {t("common.today")}
              </TimeframeLabel>
              <Text fontWeight="bold" fontSize="body" color={textColor}>
                {trends.today.toLocaleString()}
              </Text>
            </StatGroup>

            <StatGroup>
              <TimeframeLabel variant={variant}>
                {t("common.lastWeek")}
              </TimeframeLabel>
              <Text fontWeight="bold" fontSize="body" color={textColor}>
                {trends.lastWeek.toLocaleString()}
              </Text>
            </StatGroup>

            <StatGroup>
              <TimeframeLabel variant={variant}>
                {t("common.lastMonth")}
              </TimeframeLabel>
              <Text fontWeight="bold" fontSize="body" color={textColor}>
                {trends.lastMonth.toLocaleString()}
              </Text>
            </StatGroup>
          </FooterGrid>
        </Fragment>
      ) : null}
    </Container>
  );
};
