import type React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import {
  buildCategoriesParams,
  countCategoriesActiveFilters,
  parseCategoriesFiltersFromParams,
} from "../utils/categoryUtils";
import type { GetCategoriesDto } from "../../../model/category/dto/GetCategoriesDto";

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

const PopoverSeparator = styled.div`
  height: 1px;
  background: ${({ theme }) => theme.colors.border};
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

export const CategoriesFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const categoriesMeta = useAppSelector(
    categorySliceSelectors.selectCategoriesMeta,
  );

  const filters = useMemo(
    () => parseCategoriesFiltersFromParams(searchParams, categoriesMeta),
    [searchParams, categoriesMeta],
  );
  const activeCount = countCategoriesActiveFilters(filters);

  const applyFilter = useCallback(
    (key: keyof GetCategoriesDto, value: unknown) => {
      setSearchParams(
        buildCategoriesParams(
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
          <PopoverLabel>Children count</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minChildrenCount}
              onChange={(e) =>
                applyFilter(
                  "minChildrenCount",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxChildrenCount}
              onChange={(e) =>
                applyFilter(
                  "maxChildrenCount",
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
