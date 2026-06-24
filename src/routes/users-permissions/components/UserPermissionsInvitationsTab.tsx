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
import { InvitationItem } from "./InvitationItem";
import type { OwnerInvitation } from "../../../model/user/users-permissions/types/OwnerInvitation";
import { Toast } from "../../../utils/Toast";
import { WarningModal } from "../../../components/WarningModal";
import styled from "styled-components";
import { SpinnerFullScreen } from "../../../components/SpinnerFullScreen";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

type UserPermissionsInvitationsTabProps = {
  setInviteMembersModalVisible: VoidCallback<boolean>;
};

export const UserPermissionsInvitationsTab: React.FC<
  UserPermissionsInvitationsTabProps
> = ({ setInviteMembersModalVisible }) => {
  const [selectedInvitation, setSelectedInvitation] =
    useState<OwnerInvitation | null>(null);

  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const invitations = useAppSelector(
    usersPermissionsSliceSelectors.selectOwnerInvitations,
  );
  const invitationsLoading = useAppSelector(
    usersPermissionsSliceSelectors.selectOwnerInvitationsLoading,
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
        usersPermissionsActions.getOwnerInvitations({ userId }),
      ).unwrap();
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  useEffect(() => {
    dispatch(usersPermissionsActions.getOwnerInvitations({ userId }));
  }, [dispatch, userId]);

  if (!invitations.length && !invitationsLoading) {
    return (
      <Empty description="You didn't invite anyone yet">
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
      <Text fontWeight="bold">Invitations</Text>

      {!invitationsLoading ? (
        invitations.map((inv) => (
          <InvitationItem
            key={inv._id}
            invitation={inv}
            onCancel={() => setSelectedInvitation(inv)}
          />
        ))
      ) : (
        <SpinnerFullScreen />
      )}

      <WarningModal
        title={"Cancel Invitation"}
        description={
          <span>
            Are you sure you want to cancel the pending invitation for
            <strong> {selectedInvitation?.inviteeEmail}</strong>? The invitation
            link will be permanently invalidated.
          </span>
        }
        open={Boolean(selectedInvitation)}
        onClose={() => setSelectedInvitation(null)}
        onConfirm={onCancelInvitation}
      />
    </Container>
  );
};
