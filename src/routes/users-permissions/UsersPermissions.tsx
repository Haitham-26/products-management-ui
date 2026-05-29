import type React from "react";
import styled from "styled-components";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons/faUsersGear";
import { Tabs, type TabsProps } from "../../components/Tabs";
import { Icon } from "../../components/Icon";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { UserPermissionsMembersTab } from "./components/UserPermissionsMembersTab";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";

const tabs: TabsProps["items"] = [
  {
    key: "members",
    label: "Members",
    icon: <Icon icon={faUsers} />,
    children: <UserPermissionsMembersTab />,
  },
  {
    key: "invites",
    label: "Invitations",
    icon: <Icon icon={faEnvelope} />,
    children: <div>Roles</div>,
  },
];

const StyledContainer = styled(Container)``;

export const UsersPermissions: React.FC = () => {
  return (
    <StyledContainer>
      <PageHeader
        title="Users & Permissions"
        icon={faUsersGear}
        action={{ icon: faUserPlus, title: "Invite member", onClick: () => {} }}
      />

      <Tabs items={tabs} />
    </StyledContainer>
  );
};
