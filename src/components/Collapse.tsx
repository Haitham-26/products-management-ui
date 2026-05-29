import type React from "react";
import { Collapse as AntdCollapse } from "antd";
import type { CollapseProps as AntdCollapseProps } from "antd";
import styled from "styled-components";

const StyledCollapse = styled(AntdCollapse)`
  .ant-collapse-header {
    align-items: center !important;
  }
`;

type CollapseProps = AntdCollapseProps;

export const Collapse: React.FC<CollapseProps> = (props) => {
  return <StyledCollapse bordered={false} {...props} />;
};
