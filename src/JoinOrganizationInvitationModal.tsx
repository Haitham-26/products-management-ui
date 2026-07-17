import type React from "react";
import { WarningModal } from "./components/WarningModal";
import { useAppDispatch, useAppSelector } from "./redux/store";
import appSliceSelectors from "./redux/app/app.selector";
import { appActions } from "./redux/app/app.slice";
import last from "lodash/last";
import { useState } from "react";
import organizationSliceSelectors from "./redux/organization/organization.selector";
import { organizationActions } from "./redux/organization/organization.slice";
import userSliceSelectors from "./redux/user/user.selector";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons/faEnvelopeOpenText";
import { userActions } from "./redux/user/user.slice";
import { useNavigate } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "./components/toast/useAppToast";

export const JoinOrganizationInvitationModal: React.FC = () => {
  const [acceptLoading, setAcceptLoading] = useState(false);
  const [declineLoading, setDeclineLoading] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation(undefined, { keyPrefix: "joinOrgModal" });
  const Toast = useAppToast();

  const lastSeenInvitationId = useAppSelector(
    appSliceSelectors.selectLastSeenInvitationId,
  );
  const invitations = useAppSelector(
    organizationSliceSelectors.selectJoinOrgInvitations,
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
        organizationActions.acceptInvitation({
          invitationId: lastInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      navigate("/dashboard", { replace: true });

      Toast.success(t("accept.success"));
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
        organizationActions.declineInvitation({
          invitationId: lastInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(organizationActions.getJoinOrgInvitations()).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      Toast.success(t("decline.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setDeclineLoading(false);
    }
  };

  return (
    <WarningModal
      title={t("title", { company })}
      icon={faEnvelopeOpenText}
      variantColor="primary"
      description={
        <Trans
          i18nKey="joinOrgModal.description"
          values={{ company }}
          components={[<strong />]}
        />
      }
      open={open}
      onClose={onClose}
      confirmText={t("accept.title")}
      cancelText={t("decline.title")}
      onConfirm={onAccept}
      onCancel={onDecline}
      confirmLoading={acceptLoading}
      cancelLoading={declineLoading}
    />
  );
};
