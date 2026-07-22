import type React from "react";
import { Collapse as AntdCollapse } from "antd";
import type { CollapseProps as AntdCollapseProps } from "antd";
import styled from "styled-components";

const StyledCollapse = styled(AntdCollapse)`
  .ant-collapse-header {
    align-items: center !important;
  }

  .ant-collapse-expand-icon {
    transition: all 0.2s ease !important;
  }

  html[dir="rtl"] & .ant-collapse-expand-icon[aria-expanded="false"] {
    transform: rotate(270deg) !important;
  }
  html[dir="rtl"] & .ant-collapse-expand-icon[aria-expanded="true"] {
    transform: rotate(180deg);
  }
`;

type CollapseProps = AntdCollapseProps;

export const Collapse: React.FC<CollapseProps> = (props) => {
  return <StyledCollapse bordered={false} {...props} />;
};
