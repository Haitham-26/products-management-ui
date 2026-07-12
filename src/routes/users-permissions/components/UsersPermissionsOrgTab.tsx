import type React from "react";
import { Fragment, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Text } from "../../../components/Text";
import { Button } from "../../../components/Button";
import organizationSliceSelectors from "../../../redux/organization/organization.selector";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight";
import { SpinnerFullScreen } from "../../../components/SpinnerFullScreen";
import { organizationActions } from "../../../redux/organization/organization.slice";
import { UserAvatar } from "../../../components/UserAvatar";
import isEmpty from "lodash/isEmpty";
import { Trans, useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xl};
  padding: ${({ theme }) => theme.spacing.lg};
  background: ${({ theme }) => theme.colors.surface};
  border-radius: ${({ theme }) => theme.radius.lg};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const HeaderSection = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
`;

const InfoGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const ActionSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.sm};
  padding-top: ${({ theme }) => theme.spacing.lg};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
`;

const LeaveButton = styled(Button)`
  width: fit-content;
  margin-top: ${({ theme }) => theme.spacing.sm};
`;

const BoldSpan = styled.span`
  font-weight: bold;
`;

type UsersPermissionsOrgTabProps = {
  setLeaveOrgModalVisible: VoidCallback<boolean>;
};

export const UsersPermissionsOrgTab: React.FC<UsersPermissionsOrgTabProps> = ({
  setLeaveOrgModalVisible,
}) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const user = useAppSelector(userSliceSelectors.selectUser);
  const isOrgMember = useAppSelector(userSliceSelectors.selectIsOrgMember);
  const members = useAppSelector(
    organizationSliceSelectors.selectOrganizationMembers,
  );
  const membersLoading = useAppSelector(
    organizationSliceSelectors.selectOrganizationMembersLoading,
  );

  const orgOwner = members.find((m) => m._id === user.organizationId);

  const company = orgOwner?.company || orgOwner?.name;

  useEffect(() => {
    dispatch(organizationActions.getOrganizationMembers());
  }, [dispatch, user._id]);

  if (membersLoading) {
    return <SpinnerFullScreen />;
  }

  if (!isOrgMember || isEmpty(orgOwner)) {
    return null;
  }

  return (
    <Fragment>
      <Container>
        <HeaderSection>
          <UserAvatar user={orgOwner} width={"5rem"} borderRadius="lg" />

          <InfoGroup>
            <Text fontWeight="bold" fontSize="subtitle">
              {company}
            </Text>
            <Text color="textSecondary" fontSize="small">
              <Trans
                i18nKey="usersPermissions.org.subtitle"
                values={{ owner: orgOwner.name }}
                components={[<BoldSpan />]}
              />
            </Text>
          </InfoGroup>
        </HeaderSection>

        <ActionSection>
          <Text fontWeight="bold" color="textPrimary">
            {t("usersPermissions.org.leaveSection.title")}
          </Text>
          <Text color="textSecondary" fontSize="small">
            {t("usersPermissions.org.leaveSection.description")}
          </Text>

          <LeaveButton
            variant="danger"
            icon={faPersonWalkingArrowRight}
            onClick={() => setLeaveOrgModalVisible(true)}
          >
            {t("usersPermissions.actions.leaveOrg")}
          </LeaveButton>
        </ActionSection>
      </Container>
    </Fragment>
  );
};
