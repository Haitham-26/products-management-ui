import type React from "react";
import type { DrawerProps as AntdDrawerProps } from "antd";
import { Drawer as AntdDrawer } from "antd";
import i18n from "../i18n";

type DrawerProps = AntdDrawerProps;

export const Drawer: React.FC<DrawerProps> = (props) => {
  return (
    <AntdDrawer
      placement={i18n.dir() === "rtl" ? "left" : "right"}
      {...props}
    />
  );
};
