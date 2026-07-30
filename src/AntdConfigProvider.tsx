import { ConfigProvider } from "antd";
import type React from "react";
import { theme } from "./theme/theme";
import { useTranslation } from "react-i18next";
import AntdARLocale from "antd/locale/ar_EG";
import AntdENLocale from "antd/locale/en_US";

import "dayjs/locale/en";
import "dayjs/locale/ar";
import dayjs from "dayjs";
import { AppLangs } from "./model/app/types/AppLangs.enum";

const AntdLocale = {
  [AppLangs.EN]: AntdENLocale,
  [AppLangs.AR]: AntdARLocale,
};

export const AntdConfigProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { i18n } = useTranslation();

  const lang = i18n.language as AppLangs;

  dayjs.locale(lang);

  return (
    <ConfigProvider
      locale={AntdLocale[lang]}
      direction={i18n.dir(lang)}
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
