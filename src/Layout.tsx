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
import { organizationActions } from "./redux/organization/organization.slice";
import { Breakpoints } from "./theme/Breakpoints";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  /* 3.5rem = App bar's height on mobile */
  margin-bottom: 3.5rem;

  & > div:nth-child(2) {
    width: 100%;
    order: 0;
  }

  @media (max-width: ${Breakpoints.MD}) {
    & > div:nth-child(2) {
      flex-grow: 1;
    }
  }

  @media (min-width: ${Breakpoints.MD}) {
    flex-direction: row;
    margin-inline: calc(${({ theme }) => theme.spacing.lg} * 1.5);
    gap: ${({ theme }) => theme.spacing.lg};
    flex-grow: 0;
    order: 1;
    margin-bottom: ${({ theme }) => theme.spacing.lg};
  }
`;

export const Layout: React.FC = () => {
  const dispatch = useAppDispatch();

  const user = useAppSelector(userSliceSelectors.selectUser);

  useEffect(() => {
    if (!user?._id) {
      return;
    }

    dispatch(userActions.getUserById());

    if (!user.roles.includes(UserRoles.MEMBER)) {
      dispatch(organizationActions.getJoinOrgInvitations());
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
