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
import { Breakpoints } from "../../../theme/Breakpoints";

const Layout = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};

  @media (min-width: ${Breakpoints.LG}) {
    flex-direction: row;
  }
`;

const Content = styled.div`
  flex: 1;

  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  padding: ${({ theme }) => theme.spacing.lg};
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.02);
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
        <PageSidebar pageRoute={appRoutes.settings.path} sections={sections} />

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Container>
  );
};
