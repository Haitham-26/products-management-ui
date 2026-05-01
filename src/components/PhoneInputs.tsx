import type React from "react";
import PhoneInputLib from "react-phone-number-input";
import flags from "react-phone-number-input/flags";
import styled from "styled-components";
import { Input } from "./Input";
import { forwardRef, type ForwardedRef } from "react";

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
    <Wrapper>
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
        inputComponent={forwardRef((props, ref) => (
          <Input ref={ref as ForwardedRef<HTMLInputElement>} {...props} />
        ))}
      />

      {errorMessage ? <Error>{errorMessage}</Error> : null}
    </Wrapper>
  );
};
