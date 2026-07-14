import type React from "react";
import { Row } from "./Row";
import { Column } from "./Column";
import { Container } from "./Container";
import styled, { createGlobalStyle } from "styled-components";
import { Link, useNavigate, type NavigateFunction } from "react-router-dom";
import { Icon } from "./Icon";
import { Dropdown } from "./Dropdown";
import type { MenuItemType } from "antd/es/menu/interface";
import { faPersonWalkingArrowRight } from "@fortawesome/free-solid-svg-icons/faPersonWalkingArrowRight";
import { userActions } from "../redux/user/user.slice";
import {
  useAppDispatch,
  useAppSelector,
  type AppDispatch,
} from "../redux/store";
import { Image } from "./Image";
import { Images } from "../assets";
import { Button } from "./Button";
import { faBell } from "@fortawesome/free-solid-svg-icons/faBell";
import { NotificationsDrawer } from "./notifications/NotificationsDrawer";
import { useState } from "react";
import organizationSliceSelectors from "../redux/organization/organization.selector";
import userSliceSelectors from "../redux/user/user.selector";
import type { User } from "../model/user/types/User";
import { SignUpMethods } from "../model/user/types/SignUpMethods";
import { googleLogout } from "@react-oauth/google";
import { UserAvatar } from "./UserAvatar";
import { appRoutes } from "../utils/appRoutes";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const getDropdownItems = (
  navigate: NavigateFunction,
  dispatch: AppDispatch,
  user: User,
  t: TFunction,
) =>
  [
    {
      key: appRoutes.profile.path,
      label: t(appRoutes.profile.titleKey),
      icon: <Icon icon={appRoutes.profile.icon} />,
      onClick: () => navigate(appRoutes.profile.path),
    },
    {
      key: appRoutes.usersPermissions.path,
      label: t(appRoutes.usersPermissions.titleKey),
      icon: <Icon icon={appRoutes.usersPermissions.icon} />,
      onClick: () => navigate(appRoutes.usersPermissions.path),
    },
    {
      key: "hr-1",
      type: "divider",
    },
    {
      key: "logout",
      label: (
        <LogoutButton icon={faPersonWalkingArrowRight} variant="danger">
          {t("common.logout")}
        </LogoutButton>
      ),
      onClick: async () => {
        if (user.signUpMethod === SignUpMethods.GOOGLE) {
          googleLogout();
        }
        await dispatch(userActions.logout());
        navigate("/login", { replace: true });
      },
      className: "logout",
    },
  ] as MenuItemType[];

const GlobalStyle = createGlobalStyle`
    .logout {
      padding: 0 !important;
    }
`;

const LogoutButton = styled(Button)`
  width: 100%;
`;

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
  const { t } = useTranslation();

  const joinOrgInvitations = useAppSelector(
    organizationSliceSelectors.selectJoinOrgInvitations,
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
              <Link to={appRoutes.settings.path}>
                <Icon icon={appRoutes.settings.icon} size="xl" />
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
                menu={{ items: getDropdownItems(navigate, dispatch, user, t) }}
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

      <GlobalStyle />
    </Wrapper>
  );
};
