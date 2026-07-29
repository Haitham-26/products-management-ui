import { Popover } from "antd";
import type React from "react";
import { Icon } from "./Icon";
import { useTranslation } from "react-i18next";
import { faFilter } from "@fortawesome/free-solid-svg-icons/faFilter";
import { Fragment, useState } from "react";
import styled from "styled-components";
import { Breakpoints } from "../theme/Breakpoints";
import { Button } from "./Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";

const FilterChip = styled.button<{ active?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};
  margin-inline-start: auto;

  padding: ${({ theme }) => `${theme.spacing.xs} ${theme.spacing.sm}`};
  height: 1.5rem;

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

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ItemsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 16rem;
  max-height: 40vh;
  overflow-y: auto;
  padding-inline-end: ${({ theme }) => theme.spacing.sm};
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const Separator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
`;

const ResetButton = styled(Button)`
  margin-inline-start: auto;
`;

export type FiltersPopoverProps = {
  activeFiltersCount: number;
  items: {
    type: "separator" | "item";
    title?: string;
    children?: React.ReactNode;
  }[];
  onResetFilters: VoidFunction;
};

export const FiltersPopover: React.FC<FiltersPopoverProps> = ({
  activeFiltersCount = 0,
  items = [],
  onResetFilters,
}) => {
  const [open, setOpen] = useState(false);

  const { t } = useTranslation();

  return (
    <Popover
      content={
        <Container>
          <ItemsWrapper>
            {items.map(({ title, type, children }) =>
              type === "item" && children ? (
                <Section>
                  {title ? <Label>{title}</Label> : null}

                  {children}
                </Section>
              ) : (
                <Separator />
              ),
            )}
          </ItemsWrapper>

          {activeFiltersCount ? (
            <Fragment>
              <Separator />

              <ResetButton icon={faRotateLeft} onClick={onResetFilters}>
                {t("common.clearAll")}
              </ResetButton>
            </Fragment>
          ) : null}
        </Container>
      }
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      arrow={false}
    >
      <FilterChip active={activeFiltersCount > 0}>
        <Icon icon={faFilter} />
        <span>{t("common.filters.title")}</span>
        {activeFiltersCount ? ` (${activeFiltersCount})` : ""}
      </FilterChip>
    </Popover>
  );
};
