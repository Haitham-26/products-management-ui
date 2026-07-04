import type React from "react";
import { Header } from "./components/Header";
import { Outlet, ScrollRestoration } from "react-router-dom";
import { Fragment, useEffect } from "react";
import styled from "styled-components";
import { SideMenu } from "./components/SideMenu";
import { JoinOrganizationInvitationModal } from "./JoinOrganizationInvitationModal";
import { useAppDispatch, useAppSelector } from "./redux/store";
import { userActions } from "./redux/user/user.slice";
import userSliceSelectors from "./redux/user/user.selector";
import { UserRoles } from "./model/user/types/UserRoles.enum";
import { usersPermissionsActions } from "./redux/users-permissions/users-permissions.slice";

const Container = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-inline: calc(${({ theme }) => theme.spacing.lg} * 1.5);

  & > div:nth-child(2) {
    width: 100%;
  }
`;

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(userSliceSelectors.selectUser);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    dispatch(userActions.getUserById({ userId: user._id }));

    if (!user.roles.includes(UserRoles.MEMBER)) {
      dispatch(
        usersPermissionsActions.getJoinOrgInvitatios({ userId: user._id }),
      );
    }
    // eslint-disable-next-line
  }, [user?._id, dispatch]);

  return (
    <Fragment>
      <JoinOrganizationInvitationModal />

      <Header />

      <Container>
        <SideMenu />

        <Outlet />
      </Container>

      <ScrollRestoration />
    </Fragment>
  );
};
