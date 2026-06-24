import type React from "react";
import { Drawer } from "../Drawer";
import { useAppSelector } from "../../redux/store";
import usersPermissionsSliceSelectors from "../../redux/users-permissions/users-permissions.selector";
import { Text } from "../Text";
import { JoinOrgInvitationCard } from "./invitations/JoinOrgInvitationCard";

type NotificationsDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const invitations = useAppSelector(
    usersPermissionsSliceSelectors.selectJoinOrgInvitations,
  );

  return (
    <Drawer title="Notifications" open={open} onClose={onClose}>
      {!invitations.length ? (
        <Text color="textSecondary" fontSize="small" textAlign="center">
          No notifications
        </Text>
      ) : null}

      {invitations.map((invitation) => (
        <JoinOrgInvitationCard key={invitation._id} invitation={invitation} />
      ))}
    </Drawer>
  );
};
