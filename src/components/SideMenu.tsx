import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { faChartBar } from "@fortawesome/free-solid-svg-icons/faChartBar";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";

const StyledContainer = styled(Container)`
  width: 250px;
  /* 7rem = header's height */
  height: ${({ theme }) => `calc(100vh - 7rem - ${theme.spacing.lg})`};
  display: flex;
  flex-direction: column;
  position: sticky;
  /* 7rem = header's height */
  top: 7rem;
`;

const Logo = styled.div`
  font-size: 1.5rem;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.textPrimary};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
  text-align: center;
`;

const MenuStyle = createGlobalStyle`
  .ant-menu {
    border: 0 !important;
  }

  .ant-menu-item * {
    transition: all 0s ease !important; 
  }
  `;

const StyledMenu = styled(Menu)`
  border: 0;
  background: transparent;
`;

export const SideMenu: React.FC = () => {
  const location = useLocation();

  const items: MenuProps["items"] = [
    {
      label: "Dashboard",
      path: "/",
      icon: <Icon icon={faChartBar} />,
    },
    {
      label: "Products",
      path: "/products",
      icon: <Icon icon={faBox} />,
    },
    {
      label: "Categories",
      path: "/categories",
      icon: <Icon icon={faFolder} />,
    },
    {
      label: "Tags",
      path: "/tags",
      icon: <Icon icon={faTags} />,
    },
  ].map((item) => ({
    key: item.path,
    icon: item.icon,
    label: <NavLink to={item.path}>{item.label}</NavLink>,
  }));

  return (
    <StyledContainer>
      <Logo>LOGO</Logo>
      <StyledMenu
        mode="inline"
        theme="light"
        items={items}
        selectedKeys={[location.pathname]}
      />
      <MenuStyle />
    </StyledContainer>
  );
};
