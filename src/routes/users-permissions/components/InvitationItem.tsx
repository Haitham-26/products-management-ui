import type React from "react";
import styled from "styled-components";
import type { OwnerInvitation } from "../../../model/user/users-permissions/types/OwnerInvitation";
import { Text } from "../../../components/Text";
import { Button } from "../../../components/Button";
import { formatDate } from "../../../utils/Date";
import { InvitationStatus } from "../../../model/user/users-permissions/types/InvitationStatus.enum";
import { Toast } from "../../../utils/Toast";
import { useState } from "react";
import { Breakpoints } from "../../../theme/Breakpoints";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";
import userSliceSelectors from "../../../redux/user/user.selector";

const Card = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  gap: ${({ theme }) => theme.spacing.lg};
  overflow: hidden;
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);

  &::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: transparent;
    transition: background-color 0.2s ease;
  }

  &:hover {
    transform: translateY(-2px);
    box-shadow: ${({ theme }) => theme.shadow.md};
    border-color: ${({ theme }) => theme.colors.primary}40;

    &::before {
      background: ${({ theme }) => theme.colors.primary};
    }
  }

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const MainContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  flex: 1;
`;

const HeaderGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;
`;

const EmailText = styled(Text)`
  font-size: ${({ theme }) => theme.typography.body};
  color: ${({ theme }) => theme.colors.textPrimary};
  letter-spacing: -0.01em;
`;

const StatusBadge = styled.span<{ status: InvitationStatus }>`
  display: inline-flex;
  align-items: center;
  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: ${({ theme }) => theme.radius.full};
  text-transform: uppercase;
  letter-spacing: 0.05em;

  ${({ status, theme }) => {
    switch (status) {
      case InvitationStatus.ACCEPTED:
        return `
          background-color: ${theme.colors.success}10;
          color: ${theme.colors.success};
        `;
      case InvitationStatus.PENDING:
        return `
          background-color: ${theme.colors.warning}10;
          color: ${theme.colors.warning};
        `;
      case InvitationStatus.DECLINED:
      case InvitationStatus.CANCELLED:
      default:
        return `
          background-color: ${theme.colors.error}10;
          color: ${theme.colors.error};
        `;
    }
  }}
`;

const MetaGrid = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  flex-wrap: wrap;
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const MetaLabel = styled(Text)`
  font-size: 0.7rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${({ theme }) => theme.colors.textSecondary};
  opacity: 0.8;
`;

const ActionsSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  button {
    min-width: 10rem;
  }

  @media (max-width: ${Breakpoints.MD}) {
    width: 100%;
    border-top: 1px solid ${({ theme }) => theme.colors.border};
    padding-top: ${({ theme }) => theme.spacing.md};
    justify-content: flex-end;

    button {
      flex: 1;
    }
  }
`;

type PendingInvitationItemProps = {
  invitation: OwnerInvitation;
  onCancel: VoidFunction;
};

export const InvitationItem: React.FC<PendingInvitationItemProps> = ({
  invitation,
  onCancel,
}) => {
  const [reinviteLoading, setReinviteLoading] = useState(false);

  const dispatch = useAppDispatch();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const onReinvite = async () => {
    try {
      setReinviteLoading(true);

      await dispatch(
        usersPermissionsActions.inviteMembers({
          userId,
          // @ts-expect-error the emails type is { content: string }[] just
          // to get the useFieldArray to work in another file
          emails: [invitation.inviteeEmail],
        }),
      ).unwrap();
      await dispatch(
        usersPermissionsActions.getOwnerInvitations({ userId }),
      ).unwrap();

      Toast.success("Invitation re-sent successfully");
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setReinviteLoading(false);
    }
  };

  const getExpirationDate = (sentAt: Date) => {
    const sentDate = new Date(sentAt);
    sentDate.setDate(sentDate.getDate() + 30);

    return formatDate(sentDate.toISOString(), true);
  };

  return (
    <Card>
      <MainContent>
        <HeaderGroup>
          <EmailText fontWeight="bold">{invitation.inviteeEmail}</EmailText>
          <StatusBadge status={invitation.status}>
            {invitation.status.toLowerCase()}
          </StatusBadge>
        </HeaderGroup>

        <MetaGrid>
          <MetaItem>
            <MetaLabel>Sent On</MetaLabel>
            <Text color="textSecondary" fontSize="small">
              {formatDate(invitation.sentAt, true)}
            </Text>
          </MetaItem>

          {invitation.status === InvitationStatus.PENDING ? (
            <MetaItem>
              <MetaLabel>Valid Until</MetaLabel>
              <Text color="textSecondary" fontSize="small">
                {getExpirationDate(invitation.createdAt)}
              </Text>
            </MetaItem>
          ) : null}
        </MetaGrid>
      </MainContent>

      {invitation.status !== InvitationStatus.ACCEPTED ? (
        <ActionsSection>
          {[InvitationStatus.DECLINED, InvitationStatus.CANCELLED].includes(
            invitation.status,
          ) ? (
            <Button onClick={onReinvite} loading={reinviteLoading}>
              Re-invite
            </Button>
          ) : null}

          {invitation.status === InvitationStatus.PENDING ? (
            <Button variant="danger" onClick={onCancel}>
              Cancel Invitation
            </Button>
          ) : null}
        </ActionsSection>
      ) : null}
    </Card>
  );
};
