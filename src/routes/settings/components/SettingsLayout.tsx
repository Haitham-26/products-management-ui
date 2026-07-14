import type React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faSliders } from "@fortawesome/free-solid-svg-icons/faSliders";
import { Container } from "../../../components/Container";
import { PageHeader } from "../../../components/PageHeader";
import { PageSidebar } from "../../../components/PageSidebar";
import { SettingsKeys } from "../../../model/settings/types/SettingsKeys.enum";
import { faShield } from "@fortawesome/free-solid-svg-icons/faShield";
import type { User } from "../../../model/user/types/User";
import { useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { SignUpMethods } from "../../../model/user/types/SignUpMethods";
import { appRoutes } from "../../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";

const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Content = styled.div`
  flex: 1;
`;

const getSections = (user: User, t: TFunction) => [
  {
    key: SettingsKeys.GENERAL,
    label: t("settings.pages.general.title"),
    icon: faSliders,
  },
  {
    key: SettingsKeys.INVENTORY,
    label: t("settings.pages.inventory.title"),
    icon: faBox,
  },
  ...(user.signUpMethod === SignUpMethods.EMAIL
    ? [
        {
          key: SettingsKeys.SECURITY,
          label: t("settings.pages.security.title"),
          icon: faShield,
        },
      ]
    : []),
];

export const SettingsLayout: React.FC = () => {
  const { t } = useTranslation();

  const user = useAppSelector(userSliceSelectors.selectUser);

  const sections = getSections(user, t);

  return (
    <Container>
      <PageHeader
        icon={appRoutes.settings.icon}
        title={t(appRoutes.settings.titleKey)}
      />

      <Layout>
        <PageSidebar
          pageRoute={appRoutes.settings.path.replace("/", "")}
          sections={sections}
        />

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Container>
  );
};
