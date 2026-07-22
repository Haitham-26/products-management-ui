import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Button, type ButtonProps } from "./Button";
import { Popover } from "antd";
import { Input } from "./Input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../theme/Breakpoints";

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  @media (max-width: ${Breakpoints.SM}) {
    flex-direction: column;
    align-items: stretch;
  }
`;

const TitleBlock = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  min-width: 0;
`;

const IconBox = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: ${({ theme }) => theme.radius.md};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

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
  min-width: 0;
  flex: 1;

  .page-header-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  span {
    font-size: 0.75rem;
    color: ${({ theme }) => theme.colors.textSecondary};

    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
`;

const ActionWrapper = styled.div`
  flex-shrink: 0;

  @media (max-width: ${Breakpoints.SM}) {
    width: 100%;

    button {
      width: 100%;
      justify-content: center;
    }
  }
`;
//

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.xl};
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
  border: 1px solid ${({ theme }) => theme.colors.border};

  @media (min-width: ${Breakpoints.MD}) {
    backdrop-filter: blur(${({ theme }) => theme.glass.blur});
  }
`;

const Search = styled.div`
  position: relative;

  input {
    padding-inline-start: ${({ theme }) => theme.spacing.md};
    min-width: 14.5rem;
  }

  svg {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    inset-block-start: ${({ theme }) => theme.spacing.sm};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
  }

  @media (min-width: ${Breakpoints.SM}) {
    input {
      min-width: 16rem;
    }
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

  span {
    display: none;
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.primary};
  }

  @media (min-width: ${Breakpoints.MD}) {
    span {
      display: inline;
    }
  }
`;

const FixedContentContainer = styled.div`
  position: fixed;
  // 3.5rem = App bar's height
  bottom: 3.5rem;
  inset-inline: 0;
  z-index: 2;
  background-color: ${({ theme }) => theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: space-between;
  white-space: nowrap;
  gap: ${({ theme }) => theme.spacing.md};

  & > p:nth-child(1) {
    display: none;
  }

  @media (min-width: ${Breakpoints.MD}) {
    position: absolute;
    inset-inline: auto;
    inset: 0;
    width: 100%;
    height: 100%;
    border-radius: inherit;
    padding-inline-start: ${({ theme }) => theme.spacing.md};
    padding-inline-end: ${({ theme }) => theme.spacing.sm};

    & > p:nth-child(1) {
      display: block;
    }
  }
`;

const BulkActionsContentWrapper = styled.div`
  display: flex;
  align-items: center;
  overflow-x: auto;
  height: 100%;
  width: 100%;

  & > div:first-child {
    gap: 0;
  }

  @media (max-width: ${Breakpoints.MD}) {
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};

    button {
      flex-grow: 1;
      border-radius: 0;
      padding-inline: ${({ theme }) => theme.spacing.md};
      font-size: calc(${({ theme }) => theme.typography.small} * 0.9);
      height: 2.5rem !important;
    }
  }

  @media (min-width: ${Breakpoints.MD}) {
    & > div:first-child {
      gap: ${({ theme }) => theme.spacing.sm};
    }

    button {
      height: 2rem !important;
    }
  }
`;

const GlobalStyle = createGlobalStyle<{ hasSelection: boolean }>`
  ${({ hasSelection }) =>
    // 3.5rem = App bar's height
    // 2.5rem = Fixed content's height
    hasSelection
      ? `
    @media (max-width: ${Breakpoints.MD}) {
      #content-conatiner {
        margin-bottom: calc(3.5rem + 2.5rem)
      }
    }
  `
      : ""}
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

  extra?: React.ReactNode;

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
  className?: string;
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
  className,
  extra,
}) => {
  const [searchValue, setSearchValue] = useState("");
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <Wrapper className={className}>
      <Top>
        <TitleBlock>
          <IconBox>
            <Icon icon={icon} />
          </IconBox>

          <TitleGroup>
            <Text fontSize="title" className="page-header-title">
              {title}
            </Text>

            {subtitle ? <span>{subtitle}</span> : null}
          </TitleGroup>
        </TitleBlock>

        {extra || null}

        {action ? (
          <ActionWrapper>
            <Button
              icon={action.icon}
              onClick={action.onClick}
              variant={action.variant}
            >
              {action.title}
            </Button>
          </ActionWrapper>
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
                <span>{t("common.filters.title")}</span>
                {filters.activeCount ? ` (${filters.activeCount})` : ""}
              </FilterChip>
            </Popover>
          ) : null}

          {bulkActionsContent ? (
            <FixedContentContainer>
              <Text color="onPrimary" fontSize="small" fontWeight={"bold"}>
                {selectedTableItemsCount} {t("common.selected").toLowerCase()}
              </Text>

              <BulkActionsContentWrapper>
                {bulkActionsContent}
              </BulkActionsContentWrapper>
            </FixedContentContainer>
          ) : null}
        </ContextBar>
      ) : null}

      <GlobalStyle hasSelection={selectedTableItemsCount > 0} />
    </Wrapper>
  );
};
