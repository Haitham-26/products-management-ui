import { OTPInput } from "input-otp";
import type React from "react";
import styled from "styled-components";
import { Text } from "./Text";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};

  p {
    font-size: calc(${({ theme }) => theme.typography.body} * 0.75);
  }
`;

const StyledOTPInput = styled(OTPInput)`
  width: 100%;
`;

const SlotsContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.sm};
  direction: ltr;
`;

const StyledSlot = styled.div<{
  isActive: boolean;
  hasValue: boolean;
}>`
  width: 3rem;
  height: 3.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: calc(${({ theme }) => theme.typography.body} * 1.25);
  font-weight: 600;

  border-radius: ${({ theme }) => theme.radius.md};
  border: 2px solid
    ${({ isActive, theme }) =>
      isActive ? theme.colors.primary : theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
  transition: 0.2s;
`;

type VerificationCodeInputProps = {
  value: string;
  onChange: VoidCallback<string>;
  length?: number;
  disabled?: boolean;
  errorMessage?: string;
};

export const VerificationCodeInput: React.FC<VerificationCodeInputProps> = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  errorMessage,
}) => {
  return (
    <Wrapper>
      <StyledOTPInput
        maxLength={length}
        value={value}
        onChange={onChange}
        disabled={disabled}
        render={({ slots }) => (
          <SlotsContainer>
            {slots.map((slot, index) => (
              <StyledSlot
                isActive={slot.isActive}
                hasValue={Boolean(slot.char)}
                key={index}
              >
                {slot.char}
              </StyledSlot>
            ))}
          </SlotsContainer>
        )}
      />

      {errorMessage?.length ? <Text color="error">{errorMessage}</Text> : null}
    </Wrapper>
  );
};
