import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import React, { useState } from "react";
import styled from "styled-components";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Button, type ButtonProps } from "./Button";
import { Popover } from "antd";
import { Input } from "./Input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { useTranslation } from "react-i18next";

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
`;

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
`;

const IconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;

  background: ${({ theme }) => theme.colors.primary}15;
  border: 1px solid ${({ theme }) => theme.colors.primary}30;

  svg {
    color: ${({ theme }) => theme.colors.primary};
    font-size: 18px;
  }
`;

const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const ContextBar = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
  flex-wrap: wrap;
  position: relative;

  padding: ${({ theme }) => theme.spacing.sm};
  border-radius: ${({ theme }) => theme.radius.md};
  background: ${({ theme }) => theme.colors.glassBackground};
  backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Search = styled.div`
  position: relative;

  input {
    padding-inline-start: ${({ theme }) => theme.spacing.md};
    min-width: 17rem;
  }

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    inset-block-start: ${({ theme }) => theme.spacing.sm};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`;

const FilterChip = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-inline-start: auto;

  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  height: 28px;

  border-radius: ${({ theme }) => theme.radius.full};
  border: 1px solid
    ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.border};

  background: ${({ theme, active }) =>
    active ? `${theme.colors.primary}12` : theme.colors.surface};

  color: ${({ theme, active }) =>
    active ? theme.colors.primary : theme.colors.textSecondary};

  font-size: 0.75rem;
  cursor: pointer;

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const FixedContentContainer = styled.div`
  position: absolute;
  inset: 0;
  z-index: 2;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.primary};
  border-radius: inherit;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-inline-start: ${({ theme }) => theme.spacing.md};
  padding-inline-end: ${({ theme }) => theme.spacing.sm};
`;

type PageHeaderProps = {
  title: string;
  icon: IconProp;

  subtitle?: string;

  action?: {
    title: string;
    icon: IconProp;
    onClick: VoidFunction;
    variant?: ButtonProps["variant"];
  };

  search?: {
    placeholder?: string;
    onChange: (value: string) => void;
  };

  filters?: {
    content: React.ReactNode;
    activeCount: number;
  };

  bulkActionsContent?: React.ReactNode;
  selectedTableItemsCount?: number;
};

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  icon,
  subtitle,
  action,
  search,
  filters,
  bulkActionsContent,
  selectedTableItemsCount = 0,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <Wrapper>
      <Top>
        <TitleBlock>
          <IconBox>
            <Icon icon={icon} />
          </IconBox>

          <TitleGroup>
            <Text fontSize="title">{title}</Text>
            {subtitle ? <span>{subtitle}</span> : null}
          </TitleGroup>
        </TitleBlock>

        {action ? (
          <Button
            icon={action.icon}
            onClick={action.onClick}
            variant={action.variant}
          >
            {action.title}
          </Button>
        ) : null}
      </Top>

      {search || filters ? (
        <ContextBar>
          {search ? (
            <Search>
              <Icon icon={faMagnifyingGlass} />
              <Input
                placeholder={search.placeholder || `${t("common.search")}...`}
                value={searchValue}
                onChange={(e) => {
                  const val = e.target.value;
                  setSearchValue(val);
                  search.onChange(val);
                }}
                spellCheck={false}
              />
            </Search>
          ) : null}

          {filters ? (
            <Popover
              content={filters.content}
              trigger="click"
              open={open}
              onOpenChange={setOpen}
              arrow={false}
            >
              <FilterChip active={filters.activeCount > 0}>
                <Icon icon={faFilter} />
                {t("common.filters.title")}
                {filters.activeCount ? ` (${filters.activeCount})` : ""}
              </FilterChip>
            </Popover>
          ) : null}

          {bulkActionsContent ? (
            <FixedContentContainer>
              <Text color="onPrimary" fontSize="small" fontWeight={"bold"}>
                {selectedTableItemsCount} {t("common.selected")}
              </Text>

              {bulkActionsContent}
            </FixedContentContainer>
          ) : null}
        </ContextBar>
      ) : null}
    </Wrapper>
  );
};
