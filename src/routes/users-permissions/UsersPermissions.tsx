import type React from "react";
import { Container } from "../../components/Container";
import { PageHeader } from "../../components/PageHeader";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons/faUsersGear";
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
import { usersPermissionsActions } from "../../redux/users-permissions/users-permissions.slice";
import { userActions } from "../../redux/user/user.slice";
import { WarningModal } from "../../components/WarningModal";
import { useNavigate } from "react-router-dom";
import { UsersPermissionsOrgTab } from "./components/UsersPermissionsOrgTab";
import { faBuilding } from "@fortawesome/free-solid-svg-icons/faBuilding";

export const UsersPermissions: React.FC = () => {
  const [inviteMembersModalVisible, setInviteMembersModalVisible] =
    useState(false);
  const [leaveOrgModalVisible, setLeaveOrgModalVisible] = useState(false);
  const [leaveOrgLoading, setLeaveOrgLoading] = useState(false);

  const navigate = useNavigate();

  const dispatch = useAppDispatch();

  const isMember = useAppSelector(userSliceSelectors.selectIsOrgMember);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const leaveOrg = async () => {
    try {
      setLeaveOrgLoading(true);

      await dispatch(usersPermissionsActions.leaveOrg({ userId })).unwrap();
      await dispatch(userActions.getUserById({ userId })).unwrap();

      navigate("/dashboard", { replace: true });

      Toast.success("You left the organization successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setLeaveOrgLoading(false);
    }
  };

  useEffect(() => {
    dispatch(userActions.getUserById({ userId }));
  }, [dispatch, userId]);

  return (
    <Container>
      <PageHeader
        title="Users & Permissions"
        icon={faUsersGear}
        action={
          !isMember
            ? {
                icon: faUserPlus,
                title: "Invite members",
                onClick: () => setInviteMembersModalVisible(true),
              }
            : {
                icon: faPersonWalkingArrowRight,
                title: "Leave organization",
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
                  label: "Organization",
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
            label: "Members",
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
                  label: "Invitations",
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
          title="Leave organization"
          description="Are you sure you want to leave the organization? You’ll need a new invitation from the owner to rejoin."
          onConfirm={leaveOrg}
          confirmText="Leave"
          confirmLoading={leaveOrgLoading}
          open={leaveOrgModalVisible}
          onClose={() => setLeaveOrgModalVisible(false)}
        />
      ) : null}
    </Container>
  );
};
