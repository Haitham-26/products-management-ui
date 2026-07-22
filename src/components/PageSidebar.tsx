import type React from "react";
import styled from "styled-components";
import { NavLink, useLocation } from "react-router-dom";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";
import { Grid, Menu, type MenuProps } from "antd";
import { Breakpoints } from "../theme/Breakpoints";

const StyledMenu = styled(Menu)`
  border: 0 !important;
  background: transparent;

  .ant-menu-item {
    display: flex;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.sm};

    height: auto;
    line-height: normal;
    margin: 0;
    margin-bottom: ${({ theme }) => theme.spacing.xs};

    padding: ${({ theme }) => theme.spacing.sm} !important;
    border-radius: ${({ theme }) => theme.radius.md};

    color: ${({ theme }) => theme.colors.textSecondary};
    font-size: 0.9rem;
    font-weight: 500;

    border: 1px solid transparent;
    transition: all 0.15s ease;

    &::after {
      display: none !important;
    }

    .ant-menu-title-content {
      margin-inline-start: 0 !important;
    }

    svg {
      font-size: 14px;
    }

    &:hover {
      background: ${({ theme }) => `${theme.colors.primary}10`} !important;
      color: ${({ theme }) => theme.colors.primary} !important;
    }
  }

  .ant-menu-item-selected {
    background: ${({ theme }) => `${theme.colors.primary}15`} !important;
    color: ${({ theme }) => theme.colors.primary} !important;
    border-color: ${({ theme }) => `${theme.colors.primary}30`} !important;

    &::after {
      display: none !important;
    }

    a,
    svg {
      color: inherit !important;
    }
  }

  .ant-menu-item-icon {
    font-size: 14px !important;
    min-width: 14px;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  @media (min-width: ${Breakpoints.LG}) {
    width: 240px !important;
  }
`;

type Section = {
  key: string;
  label: string;
  icon: IconProp;
};

type PageSidebarProps = {
  pageRoute: string;
  sections: Section[];
};

export const PageSidebar: React.FC<PageSidebarProps> = ({
  pageRoute,
  sections,
}) => {
  const { lg } = Grid.useBreakpoint();

  const location = useLocation();

  const items: MenuProps["items"] = sections.map((sect) => {
    const path = `${pageRoute}/${sect.key}`;

    return {
      key: path,
      icon: <Icon icon={sect.icon} />,
      label: <NavLink to={path}>{sect.label}</NavLink>,
    };
  });

  return (
    <StyledMenu
      mode={lg ? "inline" : "horizontal"}
      items={items}
      selectedKeys={[location.pathname]}
    />
  );
};
