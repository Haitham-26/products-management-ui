import type { TabsProps as AntdTabsProps } from "antd";
import type React from "react";
import { Tabs as AntdTabs } from "antd";

export type TabsProps = AntdTabsProps;

export const Tabs: React.FC<TabsProps> = (props) => {
  return <AntdTabs {...props} />;
};
