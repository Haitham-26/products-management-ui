import type React from "react";
import { Fragment, useEffect } from "react";
import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Text } from "../../../components/Text";
import { Button } from "../../../components/Button";
import usersPermissionsSliceSelectors from "../../../redux/users-permissions/users-permissions.selector";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight";
import { SpinnerFullScreen } from "../../../components/SpinnerFullScreen";
import { usersPermissionsActions } from "../../../redux/users-permissions/users-permissions.slice";

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

const OrgAvatar = styled.div`
  width: 64px;
  height: 64px;
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};
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

type UsersPermissionsOrgTabProps = {
  setLeaveOrgModalVisible: VoidCallback<boolean>;
};

export const UsersPermissionsOrgTab: React.FC<UsersPermissionsOrgTabProps> = ({
  setLeaveOrgModalVisible,
}) => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(userSliceSelectors.selectUser);
  const isOrgMember = useAppSelector(userSliceSelectors.selectIsOrgMember);
  const members = useAppSelector(
    usersPermissionsSliceSelectors.selectOrganizationMembers,
  );
  const membersLoading = useAppSelector(
    usersPermissionsSliceSelectors.selectOrganizationMembersLoading,
  );

  const orgOwner = members.find((m) => m._id === user.organizationId);

  const company = orgOwner?.company || orgOwner?.name;

  useEffect(() => {
    dispatch(
      usersPermissionsActions.getOrganizationMembers({ userId: user._id }),
    );
  }, [dispatch, user._id]);

  if (membersLoading) {
    return <SpinnerFullScreen />;
  }

  if (!isOrgMember) {
    return null;
  }

  return (
    <Fragment>
      <Container>
        <HeaderSection>
          <OrgAvatar>
            <Text fontWeight="bold" fontSize="title">
              {company?.charAt(0).toUpperCase()}
            </Text>
          </OrgAvatar>
          <InfoGroup>
            <Text fontWeight="bold" fontSize="subtitle">
              {company}
            </Text>
            <Text color="textSecondary" fontSize="small">
              Organization Owner: {orgOwner?.name}
            </Text>
          </InfoGroup>
        </HeaderSection>

        <ActionSection>
          <Text fontWeight="bold" color="textPrimary">
            Danger Zone
          </Text>
          <Text color="textSecondary" fontSize="small">
            Leaving this organization will immediately revoke your access to all
            shared resources.
          </Text>

          <LeaveButton
            variant="danger"
            icon={faPersonWalkingArrowRight}
            onClick={() => setLeaveOrgModalVisible(true)}
          >
            Leave organization
          </LeaveButton>
        </ActionSection>
      </Container>
    </Fragment>
  );
};
