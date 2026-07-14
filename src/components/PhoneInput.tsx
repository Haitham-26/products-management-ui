import type React from "react";
import PhoneInputLib, { isValidPhoneNumber } from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import styled from "styled-components";

const Wrapper = styled.div<{ valid: boolean }>`
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
      ${({ theme, valid }) =>
        !valid ? theme.colors.error : theme.colors.border} !important;

    border-radius: ${({ theme }) => theme.radius.md};
    html[dir="ltr"] & {
      border-end-start-radius: 0;
      border-start-start-radius: 0;
    }
    html[dir="rtl"] & {
      border-end-end-radius: 0;
      border-start-end-radius: 0;
    }
    font-size: 0.875rem;
    outline: none;
    transition: all 0.2s ease;

    &:focus {
      border-color: ${({ theme, valid }) =>
        !valid ? theme.colors.error : theme.colors.primary};
      box-shadow: 0 0 0 2px
        ${({ theme, valid }) =>
          !valid ? `${theme.colors.error}33` : `${theme.colors.primary}33`};
    }
  }

  .PhoneInputCountry {
    background: ${({ theme }) => theme.colors.surface};
    border: 1px solid
      ${({ theme, valid }) =>
        !valid ? theme.colors.error : theme.colors.border};
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

type PhoneInputProps = Omit<
  React.ComponentProps<typeof PhoneInputLib>,
  "onChange"
> & {
  title?: string;
  required?: boolean;
  errorMessage?: string;
  onChange: VoidCallback<string>;
  valid?: boolean;
};

export const PhoneInput: React.FC<PhoneInputProps> = ({
  title,
  required = false,
  errorMessage,
  valid = true,
  ...props
}) => {
  const localValid =
    valid && (props.value ? isValidPhoneNumber(props.value) : true);

  return (
    <Wrapper valid={localValid}>
      {title ? (
        <Label>
          {title} {required ? <span>*</span> : null}
        </Label>
      ) : null}

      <PhoneInputLib
        {...props}
        onChange={(v) => props.onChange(v || "")}
        valid={localValid}
        flags={flags}
        international
        withCountryCallingCode
        className="PhoneInput"
        inputClassName="PhoneInputInput"
      />

      {errorMessage?.length || !localValid ? (
        <Error>{errorMessage || "Invalid phone number"}</Error>
      ) : null}
    </Wrapper>
  );
};
