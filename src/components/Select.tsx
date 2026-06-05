import type React from "react";
import type { SelectProps as AntdSelectProps } from "antd";
import { Select as AntdSelect } from "antd";
import styled from "styled-components";
import { Text } from "./Text";

const Container = styled.div<{ valid?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  .ant-select {
    height: 2rem;
    border-color: ${({ theme, valid }) =>
      !valid ? theme.colors.error : theme.colors.border};
  }
`;

const Label = styled(Text)`
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.small};

  span {
    color: ${({ theme }) => theme.colors.error};
  }
`;

const ErrorText = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.error};
`;

export type SelectProps = AntdSelectProps & {
  required?: boolean;
  errorMessage?: string;
  valid?: boolean;
};

export const Select: React.FC<SelectProps> = ({
  errorMessage,
  valid = true,
  ...props
}) => {
  return (
    <Container valid={valid}>
      {props?.title ? (
        <Label>
          {props.title}
          {props.required ? <span> *</span> : null}
        </Label>
      ) : null}

      <AntdSelect {...props} />

      {errorMessage?.length ? <ErrorText>{errorMessage}</ErrorText> : null}
    </Container>
  );
};
