import React, { useState } from "react";
import { Text } from "../../Text";
import { Button } from "../../Button";
import type { JoinOrgInvitation } from "../../../model/user/users-permissions/types/JoinOrgInvitation";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import styled from "styled-components";
import { userActions } from "../../../redux/user/user.slice";

const Container = styled.div`
  padding: ${({ theme }) => theme.spacing.md};
  border: ${({ theme }) => `1px solid ${theme.colors.border}`};
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.background};
`;

const ActionsWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.sm};
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

type JoinOrgInvitationCardProps = {
  invitation: JoinOrgInvitation;
};

export const JoinOrgInvitationCard: React.FC<JoinOrgInvitationCardProps> = ({
  invitation,
}) => {
  const [declineLoading, setDeclineLoading] = useState(false);
  const [acceptLoading, setAcceptLoading] = useState(false);

  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const company = invitation.inviter?.company || invitation.inviter.name;

  const onDecline = async () => {
    try {
      setDeclineLoading(true);

      await dispatch(
        usersPermissionsActions.declineInvitation({
          invitationId: invitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(
        usersPermissionsActions.getJoinOrgInvitatios({ userId }),
      ).unwrap();
      await dispatch(userActions.getUserById({ userId })).unwrap();

      Toast.success("Invitation declined successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setDeclineLoading(false);
    }
  };

  const onAccept = async () => {
    try {
      setAcceptLoading(true);

      await dispatch(
        usersPermissionsActions.acceptInvitation({
          invitationId: invitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(userActions.getUserById({ userId })).unwrap();

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

  return (
    <Container>
      <Text fontWeight={600}>
        {company} invited you to join their organization
      </Text>

      <Text color="textSecondary" fontSize="small">
        You have been invited to join
        <strong> {company}'s</strong> organization. Please note that your
        personal account data will be hidden while you are a member, and will
        become visible again if you choose to leave the organization.
      </Text>

      <ActionsWrapper>
        <Button
          variant="secondary"
          onClick={onDecline}
          loading={declineLoading}
          spinnerColor="textPrimary"
        >
          Decline
        </Button>

        <Button variant="primary" onClick={onAccept} loading={acceptLoading}>
          Accept
        </Button>
      </ActionsWrapper>
    </Container>
  );
};
