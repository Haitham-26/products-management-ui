import { ConfigProvider } from "antd";
import type React from "react";
import { theme } from "./theme/theme";

type AntdConfigProviderProps = {
  children: React.ReactNode;
};

export const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({
  children,
}) => {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: theme.colors.primary,
          fontFamily: '"Inter", "IBM Plex Sans Arabic", sans-serif',
        },
        components: {
          Menu: {
            itemSelectedBg: theme.colors.primary,
            itemSelectedColor: theme.colors.surface,
            itemColor: theme.colors.textPrimary,
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
};
