import type React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";
import usersPermissionsSliceSelectors from "../../../redux/users-permissions/users-permissions.selector";
import { Empty } from "../../../components/Empty";
import { Button } from "../../../components/Button";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { Text } from "../../../components/Text";
import { PendingInvitationItem } from "./PendingInvitationItem";
import type { PendingInvitation } from "../../../model/user/users-permissions/types/PendingInvitation";
import { Toast } from "../../../utils/Toast";
import { WarningModal } from "../../../components/WarningModal";
import styled from "styled-components";
import { Icon } from "../../../components/Icon";
import { faCircle } from "@fortawesome/free-solid-svg-icons/faCircle";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled(Text)`
  font-weight: bold;

  svg {
    font-size: calc(${({ theme }) => theme.typography.small} / 2);
    margin-inline-end: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.pending};
    vertical-align: middle;
  }
`;

type UserPermissionsInvitationsTabProps = {
  setInviteMembersModalVisible: VoidCallback<boolean>;
};

export const UserPermissionsInvitationsTab: React.FC<
  UserPermissionsInvitationsTabProps
> = ({ setInviteMembersModalVisible }) => {
  const [selectedInvitation, setSelectedInvitation] =
    useState<PendingInvitation | null>(null);

  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const invitations = useAppSelector(
    usersPermissionsSliceSelectors.selectPendingInvitations,
  );

  const onCancelInvitation = async () => {
    if (!selectedInvitation) {
      return;
    }

    try {
      await dispatch(
        usersPermissionsActions.cancelInvitation({
          invitationId: selectedInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(
        usersPermissionsActions.getPendingInvitations({ userId }),
      ).unwrap();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  useEffect(() => {
    dispatch(usersPermissionsActions.getPendingInvitations({ userId }));
  }, [dispatch, userId]);

  if (!invitations.length) {
    return (
      <Empty description="No pending invitations">
        <Button
          icon={faUserPlus}
          onClick={() => setInviteMembersModalVisible(true)}
        >
          Invite Members
        </Button>
      </Empty>
    );
  }

  return (
    <Container>
      <Title>
        <Icon icon={faCircle} />
        Pending Invitations
      </Title>

      {invitations.map((inv) => (
        <PendingInvitationItem
          key={inv._id}
          invitation={inv}
          onCancel={() => setSelectedInvitation(inv)}
        />
      ))}

      <WarningModal
        title={"Cancel Invitation"}
        description={
          <span>
            Are you sure you want to cancel the pending invitation for
            <strong> {selectedInvitation?.email}</strong>? The invitation link
            will be permanently invalidated.
          </span>
        }
        open={Boolean(selectedInvitation)}
        onClose={() => setSelectedInvitation(null)}
        onConfirm={onCancelInvitation}
      />
    </Container>
  );
};
