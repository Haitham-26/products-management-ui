import type React from "react";
import styled from "styled-components";
import { useCallback, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { GetTagsDto } from "../../../model/tag/dto/GetTagsDto";
import { Select } from "../../../components/Select";
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

const getCreationDateOptions = (t: TFunction) => [
  {
    label: t("common.default"),
    value: null,
  },
  {
    label: t("common.filters.creationDate.newest"),
    value: CreationDateFilters.NEWEST,
  },
  {
    label: t("common.filters.creationDate.oldest"),
    value: CreationDateFilters.OLDEST,
  },
];

const PopoverBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 16rem;
  max-height: 45vh;
  overflow-y: auto;
  padding-inline-end: ${({ theme }) => theme.spacing.sm};
`;

const FiltersClearContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.md};
`;

const PopoverSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const PopoverLabel = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

const PopoverSeparator = styled.hr`
  height: 1px;
  border-color: ${({ theme }) => theme.colors.border}50;
`;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  input {
    flex: 1;
    min-width: 0;
  }
`;

const RangeDash = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

const PopoverFooter = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`;

type Range = {
  min?: number;
  max?: number;
} | null;

type TagsFiltersProps = {
  filters: Partial<GetTagsDto>;
  activeFiltersCount: number;
  applyFilter: (
    key: keyof GetTagsDto,
    value: GetTagsDto[keyof GetTagsDto],
    debounce?: boolean,
  ) => void;
};

export const TagsFilters: React.FC<TagsFiltersProps> = ({
  filters,
  activeFiltersCount,
  applyFilter,
}) => {
  const [usageCountRange, setUsageCountRange] = useState<Range>(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const { t } = useTranslation();

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });

    setUsageCountRange(null);
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <PopoverSection>
          <PopoverLabel>{t("common.filters.creationDate.title")}</PopoverLabel>
          <Select
            placeholder={t("common.default")}
            value={filters.creationDate}
            onChange={(val) => applyFilter("creationDate", val)}
            options={getCreationDateOptions(t)}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>{t("tags.fields.usageCount")}</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={usageCountRange?.min || ""}
              onChange={(e) => {
                setUsageCountRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={usageCountRange?.max || ""}
              onChange={(e) => {
                setUsageCountRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>
      </PopoverContent>

      {activeFiltersCount ? (
        <FiltersClearContainer>
          <PopoverSeparator />
          <PopoverFooter>
            <Button icon={faRotateLeft} onClick={resetFilters}>
              {t("common.clearAll")}
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
