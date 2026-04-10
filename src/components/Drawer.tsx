import type React from "react";
import type { DrawerProps as AntdDrawerProps } from "antd";
import { Drawer as AntdDrawer } from "antd";

type DrawerProps = AntdDrawerProps;

export const Drawer: React.FC<DrawerProps> = (props) => {
  return <AntdDrawer {...props} />;
};
