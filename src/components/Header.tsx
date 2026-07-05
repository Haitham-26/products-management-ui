import type React from "react";
import { Row } from "./Row";
import { Column } from "./Column";
import { Container } from "./Container";
import styled from "styled-components";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import { Icon } from "./Icon";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { Dropdown } from "./Dropdown";
import type { MenuItemType } from "antd/es/menu/interface";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons/faUsersGear";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight";
import { userActions } from "../redux/user/user.slice";
import {
  useAppDispatch,
  useAppSelector,
  type AppDispatch,
} from "../redux/store";
import { Image } from "./Image";
import { Images } from "../assets";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { Button } from "./Button";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { NotificationsDrawer } from "./notifications/NotificationsDrawer";
import { useState } from "react";
import usersPermissionsSliceSelectors from "../redux/users-permissions/users-permissions.selector";
import userSliceSelectors from "../redux/user/user.selector";
import type { User } from "../model/user/types/User";
import { SignUpMethods } from "../model/user/types/SignUpMethods";
import { googleLogout } from "@react-oauth/google";
import { UserAvatar } from "./UserAvatar";

const getDropdownItems = (
  navigate: NavigateFunction,
  dispatch: AppDispatch,
  user: User,
) =>
  [
    {
      key: "profile",
      label: "Profile",
      icon: <Icon icon={faUser} />,
      onClick: () => navigate("/profile"),
    },
    {
      key: "users-permissions",
      label: "Users & Permissions",
      icon: <Icon icon={faUsersGear} />,
      onClick: () => navigate("/users-permissions"),
    },
    {
      key: "hr-1",
      type: "divider",
    },
    {
      key: "logout",
      label: "Logout",
      icon: <Icon icon={faPersonWalkingArrowRight} />,
      onClick: async () => {
        if (user.signUpMethod === SignUpMethods.GOOGLE) {
          googleLogout();
        }
        await dispatch(userActions.logout());
        navigate("/login", { replace: true });
      },
      danger: true,
    },
  ] as MenuItemType[];

const Wrapper = styled.div`
  position: sticky;
  top: 0;
  height: 7.5rem;
  padding: ${({ theme: { spacing } }) =>
    `${spacing.lg} calc(${spacing.lg} * 1.5)`};
  z-index: 100;
`;

const LogoLink = styled(Link)`
  width: calc(250px - ${({ theme: { spacing } }) => spacing.lg} * 3);
  display: block;
`;

const NotificationsButtonWrapper = styled.div`
  position: relative;
`;

const NotificationsDot = styled.div`
  position: absolute;
  top: 0;
  inset-inline-end: 0;
  width: 0.9rem;
  height: 0.9rem;
  border-radius: ${({ theme: { radius } }) => radius.full};
  background-color: ${({ theme: { colors } }) => colors.error};
  padding: ${({ theme: { spacing } }) => spacing.xs};
  display: flex;
  align-items: center;
  justify-content: center;

  span {
    color: ${({ theme: { colors } }) => colors.surface};
    font-size: 0.65rem;
    font-weight: 600;
  }
`;

const IconButton = styled(Button)`
  background-color: transparent;
  padding: 0;
  color: ${({ theme }) => theme.colors.textPrimary};
`;

const EndContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme: { spacing } }) => spacing.md};
`;

export const Header: React.FC = () => {
  const [notificationsDrawerVisible, setNotificationsDrawerVisible] =
    useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const joinOrgInvitations = useAppSelector(
    usersPermissionsSliceSelectors.selectJoinOrgInvitations,
  );
  const user = useAppSelector(userSliceSelectors.selectUser)!;

  return (
    <Wrapper>
      <Container>
        <Row justify="space-between" align="middle" gutter={16}>
          <Column>
            <LogoLink to="/">
              <Image src={Images.Logo} alt="Inventix" />
            </LogoLink>
          </Column>

          <Column>
            <EndContainer>
              <Link to={"/settings"}>
                <Icon icon={faGear} size="xl" />
              </Link>

              <NotificationsButtonWrapper>
                <IconButton
                  icon={faBell}
                  iconSize="2x"
                  onClick={() => setNotificationsDrawerVisible(true)}
                />

                {joinOrgInvitations.length ? (
                  <NotificationsDot>
                    <span>{joinOrgInvitations.length}</span>
                  </NotificationsDot>
                ) : null}
              </NotificationsButtonWrapper>

              <Dropdown
                trigger={["click"]}
                menu={{ items: getDropdownItems(navigate, dispatch, user) }}
              >
                <span>
                  <UserAvatar user={user} />
                </span>
              </Dropdown>
            </EndContainer>
          </Column>
        </Row>
      </Container>

      <NotificationsDrawer
        open={notificationsDrawerVisible}
        onClose={() => setNotificationsDrawerVisible(false)}
      />
    </Wrapper>
  );
};
