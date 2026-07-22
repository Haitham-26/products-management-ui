import type React from "react";
import styled from "styled-components";
import type { OwnerInvitation } from "../../../model/user/organization/types/OwnerInvitation";
import { Text } from "../../../components/Text";
import { Button } from "../../../components/Button";
import { formatDate } from "../../../utils/Date";
import { InvitationStatus } from "../../../model/user/organization/types/InvitationStatus.enum";
import { useState } from "react";
import { Breakpoints } from "../../../theme/Breakpoints";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import { organizationActions } from "../../../redux/organization/organization.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../../components/toast/useAppToast";
import { Tag } from "antd";

const getStatusColor = (status: InvitationStatus) => {
  switch (status) {
    case InvitationStatus.ACCEPTED:
      return "success";
    case InvitationStatus.CANCELED:
    case InvitationStatus.DECLINED:
      return "error";
    case InvitationStatus.PENDING:
      return "warning";
  }
};

const Card = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  box-shadow: ${({ theme }) => theme.shadow.sm};
  gap: ${({ theme }) => theme.spacing.lg};

  @media (min-width: ${Breakpoints.MD}) {
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

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const onReinvite = async () => {
    try {
      setReinviteLoading(true);

      await dispatch(
        organizationActions.inviteMembers({
          userId,
          // @ts-expect-error the emails type is { content: string }[] just
          // to get the useFieldArray to work in another file
          emails: [invitation.inviteeEmail],
        }),
      ).unwrap();
      await dispatch(organizationActions.getOwnerInvitations()).unwrap();

      Toast.success(t("usersPermissions.invitations.resend.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setReinviteLoading(false);
    }
  };

  const getExpirationDate = (sentAt: Date | string) => {
    const expirationDate = new Date(sentAt);

    expirationDate.setMonth(expirationDate.getMonth() + 1);

    return formatDate(expirationDate, true);
  };

  return (
    <Card>
      <MainContent>
        <HeaderGroup>
          <EmailText fontWeight="bold">{invitation.inviteeEmail}</EmailText>
          <Tag color={getStatusColor(invitation.status)}>
            {t(
              `usersPermissions.invitations.status.${invitation.status.toLowerCase()}`,
            )}
          </Tag>
        </HeaderGroup>

        <MetaGrid>
          <MetaItem>
            <MetaLabel>{t("usersPermissions.invitations.sentOn")}</MetaLabel>
            <Text color="textSecondary" fontSize="small">
              {formatDate(invitation.sentAt, true)}
            </Text>
          </MetaItem>

          {invitation.status === InvitationStatus.PENDING ? (
            <MetaItem>
              <MetaLabel>
                {t("usersPermissions.invitations.validUntil")}
              </MetaLabel>
              <Text color="textSecondary" fontSize="small">
                {getExpirationDate(invitation.sentAt)}
              </Text>
            </MetaItem>
          ) : null}
        </MetaGrid>
      </MainContent>

      {invitation.status !== InvitationStatus.ACCEPTED ? (
        <ActionsSection>
          {[InvitationStatus.DECLINED, InvitationStatus.CANCELED].includes(
            invitation.status,
          ) ? (
            <Button onClick={onReinvite} loading={reinviteLoading}>
              {t("common.resend")}
            </Button>
          ) : null}

          {invitation.status === InvitationStatus.PENDING ? (
            <Button variant="danger" onClick={onCancel}>
              {t("common.cancel")}
            </Button>
          ) : null}
        </ActionsSection>
      ) : null}
    </Card>
  );
};
