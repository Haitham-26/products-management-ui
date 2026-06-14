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
import { useAppDispatch, type AppDispatch } from "../redux/store";
import { Image } from "./Image";
import { Images } from "../assets";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";

const getDropdownItems = (navigate: NavigateFunction, dispatch: AppDispatch) =>
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
      onClick: () => {
        dispatch(userActions.logout());
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

const EndContainer = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme: { spacing } }) => spacing.md};
`;

const ImagePlaceholder = styled.div`
  width: 3rem;
  height: 3rem;
  border-radius: ${({ theme: { radius } }) => radius.full};
  border: ${({ theme: { colors } }) => `1px solid ${colors.border}`};
`;

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

              <Dropdown
                trigger={["click"]}
                menu={{ items: getDropdownItems(navigate, dispatch) }}
              >
                <ImagePlaceholder />
              </Dropdown>
            </EndContainer>
          </Column>
        </Row>
      </Container>
    </Wrapper>
  );
};
