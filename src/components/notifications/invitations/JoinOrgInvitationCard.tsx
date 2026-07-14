import React, { useState } from "react";
import { Text } from "../../Text";
import { Button } from "../../Button";
import type { JoinOrgInvitation } from "../../../model/user/organization/types/JoinOrgInvitation";
import { organizationActions } from "../../../redux/organization/organization.slice";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Toast } from "../../../utils/Toast";
import styled from "styled-components";
import { userActions } from "../../../redux/user/user.slice";
import { Trans, useTranslation } from "react-i18next";

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

const BoldSpan = styled.span`
  font-weight: bold;
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
  const { t } = useTranslation(undefined, { keyPrefix: "joinOrgModal" });

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const company = invitation.inviter?.company || invitation.inviter.name;

  const onDecline = async () => {
    try {
      setDeclineLoading(true);

      await dispatch(
        organizationActions.declineInvitation({
          invitationId: invitation._id,
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

  const onAccept = async () => {
    try {
      setAcceptLoading(true);

      await dispatch(
        organizationActions.acceptInvitation({
          invitationId: invitation._id,
          userId,
        }),
      ).unwrap();
      await dispatch(userActions.getUserById()).unwrap();

      Toast.success(t("accept.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setAcceptLoading(false);
    }
  };

  return (
    <Container>
      <Text fontWeight={600}>{t("title", { company })}</Text>

      <Text color="textSecondary" fontSize="small">
        <Trans
          i18nKey="joinOrgModal.description"
          values={{ company }}
          components={[<BoldSpan />]}
        />
      </Text>

      <ActionsWrapper>
        <Button
          variant="secondary"
          onClick={onDecline}
          loading={declineLoading}
          spinnerColor="textPrimary"
        >
          {t("decline.title")}
        </Button>

        <Button variant="primary" onClick={onAccept} loading={acceptLoading}>
          {t("accept.title")}
        </Button>
      </ActionsWrapper>
    </Container>
  );
};
