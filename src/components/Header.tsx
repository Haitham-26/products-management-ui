import type React from "react";
import { Row } from "./Row";
import { Column } from "./Column";
import { Container } from "./Container";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";
import { Icon } from "./Icon";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { Dropdown } from "./Dropdown";
import type { MenuItemType } from "antd/es/menu/interface";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons/faUsersGear";

const getDropdownItems = (navigate: VoidCallback<string>) =>
  [
    {
      key: "1",
      label: "Users & Permissions",
      icon: <Icon icon={faUsersGear} />,
      onClick: () => navigate("/users-permissions"),
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

  return (
    <Wrapper>
      <Container>
        <Row justify="space-between" align="middle" gutter={16}>
          <Column>
            <h1>LOGO</h1>
          </Column>

          <Column>
            <EndContainer>
              <Link to={"/settings"}>
                <Icon icon={faGear} size="xl" />
              </Link>

              <Dropdown
                trigger={["click"]}
                menu={{ items: getDropdownItems(navigate) }}
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
