import type React from "react";
import styled from "styled-components";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const StyledTextarea = styled.textarea<{ valid: boolean }>`
  width: 100%;
  min-height: 6rem;
  resize: vertical;

  padding: ${({ theme }) => theme.spacing.sm} ${({ theme }) => theme.spacing.md};

  background: ${({ theme }) => theme.colors.surface};
  color: ${({ theme }) => theme.colors.textPrimary};

  border: 1px solid
    ${({ theme, valid }) => (!valid ? theme.colors.error : theme.colors.border)};

  border-radius: ${({ theme }) => theme.radius.md};

  font-size: 0.875rem;
  line-height: 1.4;

  transition:
    border-color 0.2s ease,
    box-shadow 0.2s ease;

  &::placeholder {
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  &:focus {
    outline: none;
    border-color: ${({ theme, valid }) =>
      !valid ? theme.colors.error : theme.colors.primary};

    box-shadow: 0 0 0 2px
      ${({ theme, valid }) =>
        !valid ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
  }

  &:disabled {
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.textSecondary};
    cursor: not-allowed;
    resize: none;
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  title?: string;
  errorMessage?: string;
  valid?: boolean;
};

export const Textarea: React.FC<TextareaProps> = ({
  title,
  errorMessage,
  id,
  valid = true,
  ...props
}) => {
  return (
    <Wrapper>
      {title ? <Label htmlFor={id}>{title}</Label> : null}

      <StyledTextarea id={id} valid={valid} {...props} />

      {errorMessage?.length ? <ErrorText>{errorMessage}</ErrorText> : null}
    </Wrapper>
  );
};
