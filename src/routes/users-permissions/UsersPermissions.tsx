import type React from "react";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { Tabs } from "../../components/Tabs";
import { Icon } from "../../components/Icon";
import { faUsers } from "@fortawesome/free-solid-svg-icons/faUsers";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons/faEnvelope";
import { UserPermissionsMembersTab } from "./components/UserPermissionsMembersTab";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { InviteMembersModal } from "./components/InviteMembersModal";
import { UserPermissionsInvitationsTab } from "./components/UserPermissionsInvitationsTab";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import userSliceSelectors from "../../redux/user/user.selector";
import { useEffect, useState } from "react";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight";
import { Toast } from "../../utils/Toast";
import { organizationActions } from "../../redux/organization/organization.slice";
import { userActions } from "../../redux/user/user.slice";
import { WarningModal } from "../../components/WarningModal";
import { useNavigate } from "react-router-dom";
import { UsersPermissionsOrgTab } from "./components/UsersPermissionsOrgTab";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";

export const UsersPermissions: React.FC = () => {
  const [inviteMembersModalVisible, setInviteMembersModalVisible] =
    useState(false);
  const [leaveOrgModalVisible, setLeaveOrgModalVisible] = useState(false);
  const [leaveOrgLoading, setLeaveOrgLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const isMember = useAppSelector(userSliceSelectors.selectIsOrgMember);

  const leaveOrg = async () => {
    try {
      setLeaveOrgLoading(true);

      await dispatch(organizationActions.leaveOrg()).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      navigate(appRoutes.dashboard.path, { replace: true });

      Toast.success(t("usersPermissions.org.leave.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLeaveOrgLoading(false);
    }
  };

  useEffect(() => {
    dispatch(userActions.getUserById());
  }, [dispatch]);

  return (
    <Container>
      <PageHeader
        title={t(appRoutes.usersPermissions.titleKey)}
        icon={appRoutes.usersPermissions.icon}
        action={
          !isMember
            ? {
                icon: faUserPlus,
                title: t("usersPermissions.actions.inviteMembers"),
                onClick: () => setInviteMembersModalVisible(true),
              }
            : {
                icon: faPersonWalkingArrowRight,
                title: t("usersPermissions.actions.leaveOrg"),
                onClick: () => setLeaveOrgModalVisible(true),
                variant: "danger",
              }
        }
      />

      <Tabs
        items={[
          ...(isMember
            ? [
                {
                  key: "Organization",
                  label: t("usersPermissions.org.title"),
                  icon: <Icon icon={faBuilding} />,
                  children: (
                    <UsersPermissionsOrgTab
                      setLeaveOrgModalVisible={setLeaveOrgModalVisible}
                    />
                  ),
                },
              ]
            : []),
          {
            key: "members",
            label: t("usersPermissions.members.title"),
            icon: <Icon icon={faUsers} />,
            children: (
              <UserPermissionsMembersTab
                setInviteMembersModalVisible={setInviteMembersModalVisible}
              />
            ),
          },
          ...(!isMember
            ? [
                {
                  key: "invitations",
                  label: t("usersPermissions.invitations.title"),
                  icon: <Icon icon={faEnvelope} />,
                  children: (
                    <UserPermissionsInvitationsTab
                      setInviteMembersModalVisible={
                        setInviteMembersModalVisible
                      }
                    />
                  ),
                },
              ]
            : []),
        ]}
      />

      {!isMember ? (
        <InviteMembersModal
          open={inviteMembersModalVisible}
          onClose={() => setInviteMembersModalVisible(false)}
        />
      ) : null}

      {isMember ? (
        <WarningModal
          title={t("usersPermissions.org.leave.title")}
          description={t("usersPermissions.org.leave.description")}
          onConfirm={leaveOrg}
          confirmText={t("usersPermissions.org.leave.actions.leave")}
          confirmLoading={leaveOrgLoading}
          open={leaveOrgModalVisible}
          onClose={() => setLeaveOrgModalVisible(false)}
        />
      ) : null}
    </Container>
  );
};
