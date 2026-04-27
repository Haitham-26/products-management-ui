import type React from "react";
import styled, { css } from "styled-components";
import { Spinner } from "./Spinner";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";

type Variant = "primary" | "secondary" | "danger" | "ghost";

const variantStyles = {
  primary: css`
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.surface};
  `,
  danger: css`
    background-color: ${({ theme }) => theme.colors.error};
    color: ${({ theme }) => theme.colors.surface};
  `,
  ghost: css`
    background-color: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
};

const StyledButton = styled.button<{ variant: Variant }>`
  border-radius: ${({ theme }) => theme.radius.md};
  padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.lg}`};
  border: 0;
  cursor: pointer;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  position: relative;

  ${({ variant }) =>
    Object.keys(variantStyles).includes(variant)
      ? variantStyles[variant as keyof typeof variantStyles]
      : variant}

  &:disabled {
    cursor: not-allowed;
    opacity: 0.5;
  }
`;

const SpinnerWrapper = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  background-color: inherit;
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: center;

  & > div {
    border-color: ${({ theme }) => theme.colors.surface};
    border-top-color: transparent;
  }
`;

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  variant?: Variant;
  icon?: IconProp;
};

export const Button: React.FC<ButtonProps> = ({
  children,
  loading = false,
  variant = "primary",
  icon,
  ...props
}) => {
  return (
    <StyledButton variant={variant} {...props}>
      {loading ? (
        <SpinnerWrapper>
          <Spinner />
        </SpinnerWrapper>
      ) : null}
      {icon ? <Icon icon={icon} /> : null}
      {children}
    </StyledButton>
  );
};
