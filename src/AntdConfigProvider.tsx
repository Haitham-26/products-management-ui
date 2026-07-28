import { ConfigProvider } from "antd";
import type React from "react";
import { theme } from "./theme/theme";
import { useTranslation } from "react-i18next";
import AntdARLocale from "antd/locale/ar_EG";
import AntdENLocale from "antd/locale/en_US";

import DayjsENLocale from "dayjs/locale/en";
import DayjsARLocale from "dayjs/locale/ar";
import dayjs from "dayjs";
import type { AppLangs } from "./model/app/types/AppLangs.enum";

const AntdLocale = {
  en: AntdENLocale,
  ar: AntdARLocale,
};
const DayjsLocale = {
  en: DayjsENLocale,
  ar: DayjsARLocale,
};

const lang = localStorage.getItem("lang") as AppLangs | AppLangs.EN;

dayjs.locale(DayjsLocale[lang]);

type AntdConfigProviderProps = {
  children: React.ReactNode;
};

export const AntdConfigProvider: React.FC<AntdConfigProviderProps> = ({
  children,
}) => {
  const { i18n } = useTranslation();

  return (
    <ConfigProvider
      locale={AntdLocale[lang]}
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
