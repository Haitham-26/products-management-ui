import React from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { NavLink, useLocation } from "react-router-dom";
import { Container } from "./Container";
import { Icon } from "./Icon";
import { appRoutes } from "../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../theme/Breakpoints";

const StyledContainer = styled(Container)`
  display: flex;
  flex-direction: column;
  height: 3.5rem;

  order: 1;

  position: fixed;
  z-index: 3;
  bottom: 0;
  width: 100%;

  @media (max-width: ${Breakpoints.MD}) {
    padding: 0 !important;
    background: ${({ theme }) => theme.colors.primary}20;
  }

  @media (min-width: ${Breakpoints.MD}) {
    width: 250px;

    /* 7.5rem = header's height */
    height: ${({ theme }) => `calc(100vh - 7.5rem - ${theme.spacing.lg})`};
    top: 7.5rem;

    position: sticky;
    order: 0;
  }
`;

const MenuStyle = createGlobalStyle`
  .ant-menu {
    border: 0 !important;
  }

  .ant-menu-item * {
    transition: all 0s ease !important; 
  }

  
  @media (max-width: ${Breakpoints.MD}) {
    .side-menu {
      display: flex;
    }

    .side-menu-item {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: ${({ theme: { spacing } }) => spacing.sm};
      margin: 0 !important;
      padding: ${({ theme: { spacing } }) => spacing.sm} !important;
      border-radius: 0 !important;
      height: 100% !important;
    }

    .side-menu-title-content {
      overflow: visible !important;
      margin: 0 !important;
      font-size: ${({ theme: { typography } }) => typography.small} !important;
      line-height: normal ;
    }
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
        mode={"inline"}
        theme="light"
        items={items}
        selectedKeys={[location.pathname]}
        overflowedIndicator={null}
        prefixCls="side-menu"
      />
      <MenuStyle />
    </StyledContainer>
  );
};
