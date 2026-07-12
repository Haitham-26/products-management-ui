import { ConfigProvider } from "antd";
import type React from "react";
import { theme } from "./theme/theme";
import i18n from "./i18n";

type AntdConfigProviderProps = {
  children: React.ReactNode;
};

export const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({
  children,
}) => {
  return (
    <ConfigProvider
      direction={i18n.dir(i18n.language)}
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
