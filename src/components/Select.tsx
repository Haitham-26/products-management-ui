import type React from "react";
import type { SelectProps as AntdSelectProps } from "antd";
import { Select as AntdSelect } from "antd";
import styled from "styled-components";
import { Text } from "./Text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

type SelectProps = AntdSelectProps;

export const Select: React.FC<SelectProps> = (props) => {
  return (
    <Container>
      {props?.title ? (
        <Text color="textSecondary" fontSize="small">
          {props.title}
        </Text>
      ) : null}

      <AntdSelect {...props} />
    </Container>
  );
};
