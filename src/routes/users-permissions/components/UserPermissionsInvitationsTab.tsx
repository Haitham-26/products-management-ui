import type React from "react";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { organizationActions } from "../../../redux/organization/organization.slice";
import organizationSliceSelectors from "../../../redux/organization/organization.selector";
import { Empty } from "../../../components/Empty";
import { Button } from "../../../components/Button";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons/faUserPlus";
import { Text } from "../../../components/Text";
import { InvitationItem } from "./InvitationItem";
import type { OwnerInvitation } from "../../../model/user/organization/types/OwnerInvitation";
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
  const [cancelInvitationLoading, setCancelInvitationLoading] = useState(false);

  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const invitations = useAppSelector(
    organizationSliceSelectors.selectOwnerInvitations,
  );
  const invitationsLoading = useAppSelector(
    organizationSliceSelectors.selectOwnerInvitationsLoading,
  );

  const onCancelInvitation = async () => {
    if (!selectedInvitation) {
      return;
    }

    try {
      setCancelInvitationLoading(true);

      await dispatch(
        organizationActions.cancelInvitation({
          invitationId: selectedInvitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(organizationActions.getOwnerInvitations()).unwrap();

      setSelectedInvitation(null);

      Toast.success("Invitation canceled successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setCancelInvitationLoading(false);
    }
  };

  useEffect(() => {
    dispatch(organizationActions.getOwnerInvitations());
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
        confirmLoading={cancelInvitationLoading}
      />
    </Container>
  );
};
