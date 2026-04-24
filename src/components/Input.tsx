import type React from "react";
import { useState } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input<{ hasError: boolean; originalType?: string }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};

  border: 1px solid
    ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.border};

  border-radius: ${({ theme }) => theme.radius.md};
  font-size: 0.875rem;
  height: 2rem;

  ${({ originalType, theme }) =>
    originalType === "password"
      ? `padding-right: calc(${theme.spacing.xl} * 1.5);`
      : ""}

  &:focus {
    outline: none;
    border-color: ${({ theme, hasError }) =>
      hasError ? theme.colors.error : theme.colors.primary};

    box-shadow: 0 0 0 2px
      ${({ theme, hasError }) =>
        hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }
`;

const EyeButton = styled.button`
  position: absolute;
  right: ${({ theme }) => theme.spacing.md};
  top: 50%;
  transform: translateY(-50%);

  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;

  color: ${({ theme }) => theme.colors.textSecondary};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  title?: string;
  errorMessage?: string;
};

export const Input: React.FC<InputProps> = ({
  title,
  errorMessage,
  type,
  id,
  required,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const hasError = Boolean(errorMessage);

  const isPassword = type === "password";

  return (
    <Wrapper>
      {title ? (
        <Label htmlFor={id}>
          {title} {required ? <span>*</span> : null}
        </Label>
      ) : null}

      <InputWrapper>
        <StyledInput
          id={id}
          type={isPassword && show ? "text" : type}
          hasError={hasError}
          originalType={type}
          {...props}
        />

        {isPassword ? (
          <EyeButton
            type="button"
            onClick={() => setShow((v) => !v)}
            aria-label="Toggle password visibility"
          >
            <Icon icon={show ? faEyeSlash : faEye} />
          </EyeButton>
        ) : null}
      </InputWrapper>

      {hasError ? <ErrorText>{errorMessage}</ErrorText> : null}
    </Wrapper>
  );
};
