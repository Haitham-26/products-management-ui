import type React from "react";
import PhoneInputLib from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import styled from "styled-components";

const Wrapper = styled.div<{ hasError: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  .PhoneInput {
    display: flex;
    align-items: center;
  }

  .PhoneInputInput {
    width: 100%;
    height: 2rem;
    padding: ${({ theme }) => `${theme.spacing.sm} ${theme.spacing.md}`};

    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};

    border: 1px solid
      ${({ theme, hasError }) =>
        hasError ? theme.colors.error : theme.colors.border};

    border-radius: ${({ theme }) => theme.radius.md};
    border-end-start-radius: 0;
    border-start-start-radius: 0;
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${({ theme, hasError }) =>
        hasError ? theme.colors.error : theme.colors.primary};
      box-shadow: 0 0 0 2px
        ${({ theme, hasError }) =>
          hasError ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
    }
  }

  .PhoneInputCountry {
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid
      ${({ theme, hasError }) =>
        hasError ? theme.colors.error : theme.colors.border};
    border-radius: ${({ theme }) => theme.radius.md};
    border-end-end-radius: 0;
    border-start-end-radius: 0;
    padding: 0 ${({ theme }) => theme.spacing.sm};
    height: 2rem;
    transition: all 0.2s ease;
    margin-right: 0;

    &:focus-within {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }
`;

const Label = styled.label`
  font-size: 0.875rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  span {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const Error = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

type PhoneInputProps = React.ComponentProps<typeof PhoneInputLib> & {
  title?: string;
  required?: boolean;
  errorMessage?: string;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  title,
  required = false,
  errorMessage,
  ...props
}) => {
  const hasError = Boolean(errorMessage);

  return (
    <Wrapper hasError={hasError}>
      {title ? (
        <Label>
          {title} {required ? <span>*</span> : null}
        </Label>
      ) : null}

      <PhoneInputLib
        {...props}
        hasError={hasError}
        flags={flags}
        international
        withCountryCallingCode
        className="PhoneInput"
        inputClassName="PhoneInputInput"
      />

      {errorMessage ? <Error>{errorMessage}</Error> : null}
    </Wrapper>
  );
};
