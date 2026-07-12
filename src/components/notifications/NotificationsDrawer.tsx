import type React from "react";
import { Drawer } from "../Drawer";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import organizationSliceSelectors from "../../redux/organization/organization.selector";
import { Text } from "../Text";
import { JoinOrgInvitationCard } from "./invitations/JoinOrgInvitationCard";
import { useEffect } from "react";
import { organizationActions } from "../../redux/organization/organization.slice";
import userSliceSelectors from "../../redux/user/user.selector";
import { useTranslation } from "react-i18next";

type NotificationsDrawerProps = {
  open: boolean;
  onClose: VoidFunction;
};

export const NotificationsDrawer: React.FC<NotificationsDrawerProps> = ({
  open = false,
  onClose,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation(undefined, { keyPrefix: "notifications" });

  const invitations = useAppSelector(
    organizationSliceSelectors.selectJoinOrgInvitations,
  );
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  useEffect(() => {
    if (open) {
      dispatch(organizationActions.getJoinOrgInvitations());
    }
  }, [open, dispatch, userId]);

  return (
    <Drawer title={t("title")} open={open} onClose={onClose}>
      {!invitations.length ? (
        <Text color="textSecondary" fontSize="small" textAlign="center">
          {t("empty")}
        </Text>
      ) : null}

      {invitations.map((invitation) => (
        <JoinOrgInvitationCard key={invitation._id} invitation={invitation} />
      ))}
    </Drawer>
  );
};
