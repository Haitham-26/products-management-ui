import type React from "react";
import type { DropdownProps as AntdDropdownProps } from "antd";
import { Dropdown as AntdDropdown } from "antd";
import styled from "styled-components";
import { Text } from "./Text";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

type DropdownProps = AntdDropdownProps & {
  title?: string;
};

export const Dropdown: React.FC<DropdownProps> = (props) => {
  return (
    <Container>
      {props?.title ? (
        <Text color="textSecondary" fontSize="small">
          {props.title}
        </Text>
      ) : null}

      <AntdDropdown {...props} />
    </Container>
  );
};
