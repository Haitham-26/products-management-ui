import type { IconProp } from "@fortawesome/fontawesome-svg-core";
import React, { useState } from "react";
import styled, { createGlobalStyle } from "styled-components";
import { Icon } from "./Icon";
import { Text } from "./Text";
import { Button, type ButtonProps } from "./Button";
import { Input } from "./Input";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons/faMagnifyingGlass";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../theme/Breakpoints";
import { FiltersPopover, type FiltersPopoverProps } from "./FiltersPopover";
import { DataDisplayLayout } from "../model/app/types/DataDisplayLayout.enum";
import type { PermissionEntities } from "../model/user/types/PermissionEntities";
import { useAppDispatch, useAppSelector } from "../redux/store";
import appSliceSelectors from "../redux/app/app.selector";
import { appActions } from "../redux/app/app.slice";
import { faTableList } from "@fortawesome/free-solid-svg-icons/faTableList";
import { faTableCellsLarge } from "@fortawesome/free-solid-svg-icons/faTableCellsLarge";

const Top = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};
  flex-wrap: wrap;

  @media (max-width: ${Breakpoints.MD}) {
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
  width: 100%;

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
  flex: 1;
  min-width: 16rem;

  input {
    width: 100%;
    min-width: 0;
    padding-inline-start: ${({ theme }) => theme.spacing.xl};
  }

  svg {
    position: absolute;
    top: 50%;
    z-index: 1;
    transform: translateY(-50%);
    inset-block-start: 50%;
    inset-inline-start: ${({ theme }) => theme.spacing.sm};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.textSecondary};
    pointer-events: none;
  }

  @media (min-width: ${Breakpoints.SM}) {
    max-width: 24rem;
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
    // This is to leave a a breath space on mobile
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

const LayoutToggle = styled.div`
  display: none;

  @media (min-width: ${Breakpoints.MD}) {
    display: flex;
    align-items: center;
    border-radius: ${({ theme }) => theme.radius.md};
    border: 1px solid ${({ theme }) => theme.colors.border};
    overflow: hidden;
    flex-shrink: 0;
  }
`;

const LayoutToggleButton = styled(Button)<{ active: boolean }>`
  width: 2rem;
  height: 2rem;
  background: ${({ theme, active }) =>
    active ? `${theme.colors.primary}15` : "transparent"};

  svg {
    font-size: 14px;
    color: ${({ theme, active }) =>
      active ? theme.colors.primary : theme.colors.textSecondary};
  }

  &:hover {
    background: ${({ theme }) => theme.colors.primary}10;
  }
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

  filters?: FiltersPopoverProps;

  layoutToggle?: {
    key: PermissionEntities;
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
  layoutToggle,
  bulkActionsContent,
  selectedTableItemsCount = 0,
  className,
  extra,
}) => {
  const [searchValue, setSearchValue] = useState("");

  const { t } = useTranslation();
  const dispatch = useAppDispatch();

  const activeLayout = useAppSelector((s) =>
    layoutToggle?.key
      ? appSliceSelectors.selectEntityDisplayLayout(s, layoutToggle.key)
      : undefined,
  );

  const handleLayoutChange = (layout: DataDisplayLayout) => {
    if (!layoutToggle) {
      return;
    }

    dispatch(
      appActions.setDataEntityDisplayLayout({
        entity: layoutToggle.key,
        layout,
      }),
    );
  };

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

          {filters ? <FiltersPopover {...filters} /> : null}

          {layoutToggle ? (
            <LayoutToggle>
              <LayoutToggleButton
                active={activeLayout === DataDisplayLayout.TABLE}
                onClick={() => handleLayoutChange(DataDisplayLayout.TABLE)}
              >
                <Icon icon={faTableList} />
              </LayoutToggleButton>
              <LayoutToggleButton
                active={activeLayout === DataDisplayLayout.CARDS}
                onClick={() => handleLayoutChange(DataDisplayLayout.CARDS)}
              >
                <Icon icon={faTableCellsLarge} />
              </LayoutToggleButton>
            </LayoutToggle>
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
