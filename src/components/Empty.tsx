import type React from "react";
import { Empty as AntdEmpty, type EmptyProps as AntdEmptyProps } from "antd";
import styled from "styled-components";

const StyledEmpty = styled(AntdEmpty)`
  .ant-empty-footer {
    width: fit-content;
    margin-inline: auto;
  }
`;

type EmptyProps = AntdEmptyProps;

export const Empty: React.FC<EmptyProps> = (props) => {
  return <StyledEmpty {...props} />;
};
