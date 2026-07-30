import type React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { useTranslation } from "react-i18next";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { faRotateRight } from "@fortawesome/free-solid-svg-icons/faRotateRight";

import { Container } from "../../components/Container";
import { Text } from "../../components/Text";
import { Button } from "../../components/Button";
import { Fragment } from "react";
import { Icon } from "../../components/Icon";
import { Breakpoints } from "../../theme/Breakpoints";

const ErrorWrapper = styled(Container)`
  min-height: inherit;
  align-items: center;
  justify-content: center;
  text-align: center;
  position: relative;
  padding: ${({ theme }) => theme.spacing.xl};

  @media (min-width: ${Breakpoints.MD}) {
    min-height: auto;
    max-width: 30rem;
    margin: auto;
  }
`;

const AccentGlow = styled.div`
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  width: 14rem;
  height: 14rem;
  background: ${({ theme }) => theme.colors.error};
  opacity: 0.12;
  filter: blur(60px);
  --webkit-filter: blur(60px);
  border-radius: ${({ theme }) => theme.radius.circle};
  pointer-events: none;
`;

const IconContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: rgba(239, 68, 68, 0.1);
  color: ${({ theme }) => theme.colors.error};
  border: 1px solid rgba(239, 68, 68, 0.2);
  margin-bottom: ${({ theme }) => theme.spacing.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
`;

const Title = styled(Text)`
  font-size: ${({ theme }) => theme.typography.title};
  color: ${({ theme }) => theme.colors.textPrimary};
  font-weight: 700;
`;

const Subtitle = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.textSecondary};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const GlobalStyle = createGlobalStyle`
  #root {
    align-content: center;
  }
`;

export const Error: React.FC = () => {
  const { t } = useTranslation(undefined, { keyPrefix: "error" });

  const onReload = () => {
    window.location.reload();
  };

  return (
    <Fragment>
      <ErrorWrapper>
        <AccentGlow />

        <IconContainer>
          <Icon icon={faTriangleExclamation} size="xl" />
        </IconContainer>

        <Title>{t("title")}</Title>

        <Subtitle>{t("description")}</Subtitle>

        <Button icon={faRotateRight} onClick={onReload}>
          {t("action")}
        </Button>
      </ErrorWrapper>

      <GlobalStyle />
    </Fragment>
  );
};
