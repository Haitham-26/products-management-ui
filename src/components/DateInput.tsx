import { DatePicker, type DatePickerProps } from "antd";
import type React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Breakpoints } from "../theme/Breakpoints";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const GlobalStyle = createGlobalStyle`
  .ant-picker-date-panel {
    width: calc(var(--ant-date-picker-cell-width) * 7 + calc(var(--ant-padding) + var(--ant-padding-xxs) / 2) * 5) !important;
  }

  @media (max-width: ${Breakpoints.SM}) {
    .ant-picker-dropdown {
      transform: scale(0.9)
    }
  }
`;

type DateInputProps = DatePickerProps & {
  id?: string;
};

export const DateInput: React.FC<DateInputProps> = ({
  title,
  id,
  ...props
}) => {
  return (
    <Container>
      {title ? <Label htmlFor={id}>{title}</Label> : null}

      <DatePicker id={id} {...props} />

      <GlobalStyle />
    </Container>
  );
};
