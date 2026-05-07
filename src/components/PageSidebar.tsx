import type React from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import { Icon } from "./Icon";

const Wrapper = styled.aside`
  width: 240px;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Item = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};

  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;

  border: 1px solid transparent;

  transition: all 0.15s ease;

  &:hover {
    background: ${({ theme }) => `${theme.colors.primary}10`};
    color: ${({ theme }) => theme.colors.primary};
  }

  &.active {
    background: ${({ theme }) => `${theme.colors.primary}15`};
    color: ${({ theme }) => theme.colors.primary};
    border-color: ${({ theme }) => `${theme.colors.primary}30`};
  }
`;

const IconWrapper = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    font-size: 14px;
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
  return (
    <Wrapper>
      {sections.map((section) => (
        <Item key={section.key} to={`/${pageRoute}/${section.key}`}>
          <IconWrapper>
            <Icon icon={section.icon} />
          </IconWrapper>
          {section.label}
        </Item>
      ))}
    </Wrapper>
  );
};
