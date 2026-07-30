import React from "react";
import styled, { keyframes } from "styled-components";
import { Text } from "./Text";
import { useTranslation } from "react-i18next";

const barPulse = keyframes`
  0%, 100% {
    transform: scaleY(0.35);
    opacity: 0.5;
  }
  50% {
    transform: scaleY(1);
    opacity: 1;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.lg};
  min-height: 60vh;
  width: 100%;
  animation: ${fadeIn} 0.3s ease-out;
`;

const BarsBox = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: center;
  gap: 6px;

  width: 3.5rem;
  height: 3.5rem;
  padding: ${({ theme }) => theme.spacing.md};
  border-radius: ${({ theme }) => theme.radius.md};

  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;
`;

const Bar = styled.div<{ delay?: string }>`
  width: 5px;
  height: 100%;
  border-radius: 3px;
  background: ${({ theme }) => theme.colors.primary};
  transform-origin: bottom;

  animation: ${barPulse} 1.1s ease-in-out infinite;
  animation-delay: ${({ delay }) => delay};
`;

const LabelWrapper = styled.div`
  animation: ${fadeIn} 0.4s ease-out 0.15s both;
`;

type PageLoaderProps = {
  label?: string;
  className?: string;
};

export const PrivatePageLoader: React.FC<PageLoaderProps> = ({
  label,
  className,
}) => {
  const { t } = useTranslation();

  return (
    <Wrapper className={className} role="status" aria-live="polite">
      <BarsBox aria-hidden="true">
        <Bar />
        <Bar delay="0.15s" />
        <Bar delay="0.3s" />
      </BarsBox>

      <LabelWrapper>
        <Text fontSize="small" color="textSecondary">
          {label ?? t("common.loading")}
        </Text>
      </LabelWrapper>
    </Wrapper>
  );
};
