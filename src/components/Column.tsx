import type { ColProps } from "antd";
import { Col } from "antd";
import React from "react";

type ColumnProps = ColProps;

export const Column: React.FC<ColumnProps> = (props) => {
  return <Col {...props} />;
};
