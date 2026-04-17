import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import type React from "react";
import styled from "styled-components";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Button } from "./Button";
import { Popover } from "antd";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { Input } from "./Input";
import { useState } from "react";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faChevronDown } from "@fortawesome/free-solid-svg-icons/faChevronDown";

const Header = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const TopRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.md};
`;

const FilterBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
`;

const SearchWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  min-width: 10rem;

  input {
    padding-inline-end: ${({ theme }) => theme.spacing.md};
    min-width: 16rem;
  }

  svg {
    position: absolute;
    z-index: 2;
    inset-inline-end: ${({ theme }) => theme.spacing.sm};
    color: ${({ theme }) => theme.colors.textSecondary};
    pointer-events: none;
    font-size: 13px;
  }
`;

const FilterButton = styled.button<{ active?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  height: 2rem;
  padding: 0 ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.border};
  background: ${({ theme, active }) =>
    active ? `${theme.colors.primary}12` : theme.colors.surface};
  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;
  margin-inline-start: auto;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FilterBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1rem;
  height: 1rem;
  border-radius: ${({ theme }) => theme.radius.full};
  background: ${({ theme }) => theme.colors.primary};
  color: #fff;
  font-size: 0.65rem;
  font-weight: 700;
  line-height: 1;
`;

type PageHeaderProps = {
  title: string;
  icon: IconProp;
  action?: {
    title: string;
    icon: IconProp;
    onClick: VoidFunction;
  };
  filters?: {
    content: React.ReactNode;
    activeCount: number;
  };
  search?: {
    placeholder?: string;
    onChange: (value: string) => void;
  };
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  action,
  filters,
  search,
}) => {
  const [searchKeyword, setSearchKeyword] = useState("");
  const [popoverOpen, setPopoverOpen] = useState(false);

  return (
    <Header>
      <TopRow>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <Icon icon={icon} color="primary" size="xl" />
          <Text fontSize="title">{title}</Text>
        </div>
        {action ? (
          <Button icon={action.icon} onClick={action.onClick}>
            {action.title}
          </Button>
        ) : null}
      </TopRow>

      {search || filters ? (
        <FilterBar>
          {search ? (
            <SearchWrapper>
              <Icon icon={faMagnifyingGlass} />
              <Input
                placeholder={search?.placeholder || "Search..."}
                value={searchKeyword}
                onChange={(e) => {
                  const value = e.target.value;

                  setSearchKeyword(value);
                  search.onChange(value);
                }}
              />
            </SearchWrapper>
          ) : null}

          {filters ? (
            <Popover
              content={filters.content}
              trigger="click"
              placement="bottomLeft"
              open={popoverOpen}
              onOpenChange={setPopoverOpen}
              arrow={false}
            >
              <FilterButton active={Boolean(filters.activeCount)}>
                <Icon icon={faFilter} />
                Filters
                {filters.activeCount ? (
                  <FilterBadge>{filters.activeCount}</FilterBadge>
                ) : (
                  <Icon icon={faChevronDown} />
                )}
              </FilterButton>
            </Popover>
          ) : null}
        </FilterBar>
      ) : null}
    </Header>
  );
};
