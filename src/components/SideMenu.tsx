import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { appRoutes } from "../utils/appRoutes";
import { useTranslation } from "react-i18next";

const StyledContainer = styled(Container)`
  width: 250px;
  /* 7.5rem = header's height */
  height: ${({ theme }) => `calc(100vh - 7.5rem - ${theme.spacing.lg})`};
  top: 7.5rem;
  display: flex;
  flex-direction: column;
  position: sticky;
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
  const { t } = useTranslation();

  const items: MenuProps["items"] = [
    "dashboard",
    "products",
    "orders",
    "categories",
    "tags",
  ].map((key) => {
    const route = appRoutes[key as keyof typeof appRoutes];

    return {
      key: route.path,
      ...route,
      icon: <Icon icon={route.icon} />,
      label: <NavLink to={route.path}>{t(route.titleKey)}</NavLink>,
    };
  });

  return (
    <StyledContainer>
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
