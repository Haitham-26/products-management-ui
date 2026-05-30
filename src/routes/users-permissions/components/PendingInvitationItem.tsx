import type React from "react";
import styled from "styled-components";
import type { PendingInvitation } from "../../../model/user/users-permissions/types/PendingInvitation";
import { Text } from "../../../components/Text";
import { Button } from "../../../components/Button";
import { Toast } from "../../../utils/Toast";
import { formatDate } from "../../../utils/Date";

const Card = styled.div`
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: ${({ theme }) => theme.spacing.md} ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    padding: ${({ theme }) => theme.spacing.md};
  }
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  @media (max-width: 640px) {
    width: 100%;
    justify-content: flex-end;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: ${({ theme }) => theme.spacing.sm};

    button {
      flex: 1;
    }
  }
`;

type PendingInvitationItemProps = {
  invitation: PendingInvitation;
  onCancel: VoidFunction;
};

export const PendingInvitationItem: React.FC<PendingInvitationItemProps> = ({
  invitation,
  onCancel,
}) => {
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(invitation._id);
    Toast.success("Invitation link copied to clipboard");
  };

  return (
    <Card>
      <InfoSection>
        <Text fontWeight="bold">{invitation.email}</Text>
        <Text color="textSecondary" fontSize="small">
          Sent {formatDate(invitation.createdAt, true)}
        </Text>
      </InfoSection>

      <ActionsSection>
        <Button variant="secondary" onClick={handleCopyLink}>
          Copy Invitation Link
        </Button>
        <Button variant="danger" onClick={onCancel}>
          Cancel Invitation
        </Button>
      </ActionsSection>
    </Card>
  );
};
