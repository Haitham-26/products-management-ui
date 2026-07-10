import type React from "react";
import { WarningModal } from "./components/WarningModal";
import { useAppDispatch, useAppSelector } from "./redux/store";
import appSliceSelectors from "./redux/app/app.selector";
import { appActions } from "./redux/app/app.slice";
import last from "lodash/last";
import { Toast } from "./utils/Toast";
import { Fragment, useState } from "react";
import usersPermissionsSliceSelectors from "./redux/users-permissions/users-permissions.selector";
import { usersPermissionsActions } from "./redux/users-permissions/users-permissions.slice";
import userSliceSelectors from "./redux/user/user.selector";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";
import { userActions } from "./redux/user/user.slice";
import { useNavigate } from "react-router-dom";

export const JoinOrganizationInvitationModal: React.FC = () => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const lastSeenInvitationId = useAppSelector(
    appSliceSelectors.selectLastSeenInvitationId,
  );
  const invitations = useAppSelector(
    usersPermissionsSliceSelectors.selectJoinOrgInvitations,
  );
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const lastInvitation = last(invitations);

  const company =
    lastInvitation?.inviter?.company || lastInvitation?.inviter.name;

  const open = Boolean(
    lastInvitation &&
    invitations.length &&
    lastInvitation._id !== lastSeenInvitationId,
  );

  const onClose = () => {
    if (!lastInvitation) {
      return;
    }
    dispatch(appActions.setLastSeenInvitationId(lastInvitation._id));
  };

  const onAccept = async () => {
    if (!lastInvitation) {
      return;
    }

    try {
      setAcceptLoading(true);

      await dispatch(
        usersPermissionsActions.acceptInvitation({
          invitationId: lastInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      navigate("/dashboard", { replace: true });

      Toast.success(
        "Invitation accepted successfully! You are now a member of the organization",
      );
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setAcceptLoading(false);
    }
  };

  const onDecline = async () => {
    if (!lastInvitation) {
      return;
    }

    try {
      setDeclineLoading(true);

      await dispatch(
        usersPermissionsActions.declineInvitation({
          invitationId: lastInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(
        usersPermissionsActions.getJoinOrgInvitatios({ userId }),
      ).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      Toast.success("Invitation declined successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setDeclineLoading(false);
    }
  };

  return (
    <WarningModal
      title="Join Organization Invitation"
      icon={faEnvelopeOpenText}
      variantColor="primary"
      description={
        <Fragment>
          You have been invited to join
          <strong> {company}'s </strong>
          organization. Please note that your personal account data will be
          hidden while you are a member, and will become visible again if you
          choose to leave the organization.
        </Fragment>
      }
      open={open}
      onClose={onClose}
      confirmText="Accept"
      cancelText="Decline"
      onConfirm={onAccept}
      onCancel={onDecline}
      confirmLoading={acceptLoading}
      cancelLoading={declineLoading}
    />
  );
};
