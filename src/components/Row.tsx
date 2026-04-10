import type { RowProps as AntdRowProps } from "antd";
import { Row as AntdRow } from "antd";
import React from "react";

type RowProps = AntdRowProps;

export const Row: React.FC<RowProps> = (props) => {
  return <AntdRow {...props} />;
};
