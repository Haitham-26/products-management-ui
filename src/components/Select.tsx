import type React from "react";
import type { SelectProps as AntdSelectProps } from "antd";
import { Select as AntdSelect } from "antd";
import styled from "styled-components";
import { Text } from "./Text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};

  .ant-select {
    height: 2rem;
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
};

export const Select: React.FC<SelectProps> = ({ errorMessage, ...props }) => {
  return (
    <Container>
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
