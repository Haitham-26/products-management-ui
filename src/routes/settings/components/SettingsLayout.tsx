import type React from "react";
import styled from "styled-components";
import { Outlet } from "react-router-dom";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
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

const Layout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xl};
`;

const Content = styled.div`
  flex: 1;
`;

const getSections = (user: User) => [
  { key: SettingsKeys.GENERAL, label: "General", icon: faSliders },
  { key: SettingsKeys.INVENTORY, label: "Inventory", icon: faBox },
  ...(user.signUpMethod === SignUpMethods.EMAIL
    ? [{ key: SettingsKeys.SECURITY, label: "Security", icon: faShield }]
    : []),
];

export const SettingsLayout: React.FC = () => {
  const user = useAppSelector(userSliceSelectors.selectUser);

  const sections = getSections(user);

  return (
    <Container>
      <PageHeader
        icon={faGear}
        title="Settings"
        subtitle="Manage your system configuration"
      />

      <Layout>
        <PageSidebar pageRoute="settings" sections={sections} />

        <Content>
          <Outlet />
        </Content>
      </Layout>
    </Container>
  );
};
