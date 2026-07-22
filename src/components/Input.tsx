import React, { useState, forwardRef } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faEyeSlash } from "@fortawesome/free-solid-svg-icons/faEyeSlash";
import { Tooltip } from "antd";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons/faCircleInfo";
import i18n from "../i18n";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
  width: 100%;
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    color: ${({ theme }) => theme.colors.error};
  }

  svg {
    margin-inline-end: ${({ theme }) => theme.spacing.xs};
  }
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input<{ valid: boolean; originalType?: string }>`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.lg}
    ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};

  border: 1px solid
    ${({ theme, valid }) => (!valid ? theme.colors.error : theme.colors.border)};

  border-radius: ${({ theme }) => theme.radius.md};
  font-size: ${({ theme }) => theme.typography.small};
  height: 2rem;

  ${({ originalType, theme }) =>
    originalType === "password"
      ? `padding-right: calc(${theme.spacing.xl} * 1.5);`
      : ""}

  &:focus {
    outline: none;
    border-color: ${({ theme, valid }) =>
      !valid ? theme.colors.error : theme.colors.primary};

    box-shadow: 0 0 0 2px
      ${({ theme, valid }) =>
        !valid ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }

  html[dir="rtl"] &:dir(ltr)::placeholder {
    text-align: right;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
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
  valid?: boolean;
  info?: string;
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    { title, errorMessage, type, id, required, info, valid = true, ...props },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false);

    const isPassword = type === "password";

    const getInputDir = () => {
      const ltrInputTypes: React.InputHTMLAttributes<HTMLInputElement>["type"][] =
        ["email", "number", "password", "tel", "url"];

      return ltrInputTypes.includes(type)
        ? "ltr"
        : props.dir || i18n.dir(i18n.language);
    };

    return (
      <Wrapper>
        {title ? (
          <Label htmlFor={id}>
            {info ? (
              <Tooltip title={info}>
                <Icon icon={faCircleInfo} />
              </Tooltip>
            ) : null}
            {title} {required ? <span>*</span> : null}
          </Label>
        ) : null}

        <InputWrapper>
          <StyledInput
            id={id}
            ref={ref}
            type={isPassword && showPassword ? "text" : type}
            valid={valid}
            originalType={type}
            dir={getInputDir()}
            {...props}
          />

          {isPassword ? (
            <EyeButton
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label="Toggle password visibility"
            >
              <Icon icon={showPassword ? faEyeSlash : faEye} />
            </EyeButton>
          ) : null}
        </InputWrapper>

        {errorMessage?.length ? <ErrorText>{errorMessage}</ErrorText> : null}
      </Wrapper>
    );
  },
);
