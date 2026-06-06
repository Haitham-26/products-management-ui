import type React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import type { GetTagsDto } from "../../../model/tag/dto/GetTagsDto";
import {
  buildTagsParams,
  countTagsActiveFilters,
  parseTagsFiltersFromParams,
} from "../utils/tagUtils";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { Select } from "../../../components/Select";
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";

const creationDateOptions = [
  {
    label: "Default",
    value: null,
  },
  {
    label: "Newest First",
    value: CreationDateFilters.NEWEST,
  },
  {
    label: "Oldest First",
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

export const TagsFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const tagsMeta = useAppSelector(tagSliceSelectors.selectTagsMeta);

  const filters = useMemo(
    () => parseTagsFiltersFromParams(searchParams, tagsMeta),
    [searchParams, tagsMeta],
  );
  const activeCount = countTagsActiveFilters(filters);

  const applyFilter = useCallback(
    (key: keyof GetTagsDto, value: unknown) => {
      setSearchParams(
        buildTagsParams(
          {
            ...filters,
            meta: { ...(filters?.meta || {}), page: 0 },
            [key]: value,
          },
          searchParams,
        ),
        {
          replace: true,
        },
      );
    },
    [filters, searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <PopoverSection>
          <PopoverLabel>Creation date</PopoverLabel>
          <Select
            placeholder="Default"
            value={filters.creationDate}
            onChange={(val) => applyFilter("creationDate", val)}
            options={creationDateOptions}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>Usage count</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minUsageCount || ""}
              onChange={(e) =>
                applyFilter(
                  "minUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxUsageCount || ""}
              onChange={(e) =>
                applyFilter(
                  "maxUsageCount",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
          </RangeRow>
        </PopoverSection>
      </PopoverContent>

      {activeCount ? (
        <FiltersClearContainer>
          <PopoverSeparator />
          <PopoverFooter>
            <Button icon={faRotateLeft} onClick={resetFilters}>
              Clear all
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
