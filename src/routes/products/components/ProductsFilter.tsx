import type React from "react";
import styled from "styled-components";
import { Select } from "../../../components/Select";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { useCallback, useMemo } from "react";
import { Option } from "antd/es/mentions";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { useSearchParams } from "react-router-dom";
import {
  buildParams,
  countActiveFilters,
  parseFiltersFromParams,
} from "../utils/productUtils";
import debounce from "lodash/debounce";
import { productActions } from "../../../redux/product/products.slice";
import userSliceSelectors from "../../../redux/user/user.selector";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";

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

export const ProductsFilter: React.FC = () => {
  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(
    () => parseFiltersFromParams(searchParams),
    [searchParams],
  );
  const activeCount = countActiveFilters(filters);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFetch = useCallback(
    debounce((f: Partial<GetProductsDto>) => {
      dispatch(productActions.getProducts({ ...f, userId } as GetProductsDto));
    }, 400),
    [dispatch, userId],
  );

  const applyFilter = useCallback(
    (key: keyof GetProductsDto, value: unknown) => {
      setSearchParams(buildParams({ ...filters, [key]: value }, searchParams), {
        replace: true,
      });
      if (key === "keyword") {
        debouncedFetch({ ...filters, [key as keyof GetProductsDto]: value });
      }
    },
    [filters, searchParams, setSearchParams, debouncedFetch],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <PopoverSection>
          <PopoverLabel>Tags</PopoverLabel>
          <Select
            mode="multiple"
            placeholder="Select tags"
            maxTagCount="responsive"
            value={filters.tagIds}
            onChange={(vals) => applyFilter("tagIds", vals)}
            style={{ width: "100%" }}
          >
            {tags?.map((tag) => (
              <Option key={tag._id} value={tag._id}>
                {tag.name}
              </Option>
            ))}
          </Select>
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>Category</PopoverLabel>
          <Select
            placeholder="All categories"
            value={filters.categoryId}
            onChange={(val) => applyFilter("categoryId", val)}
            allowClear
            style={{ width: "100%" }}
          >
            {categories.map((c) => (
              <Option key={c._id} value={c._id}>
                {c.name}
              </Option>
            ))}
          </Select>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Offer Type</PopoverLabel>
          <Select
            placeholder="Any"
            value={filters.discountType}
            onChange={(val) => applyFilter("discountType", val)}
            allowClear
            style={{ width: "100%" }}
          >
            <Option value="percentage">Percentage</Option>
            <Option value="fixed">Fixed Price</Option>
          </Select>
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>Price ($)</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minPrice}
              onChange={(e) =>
                applyFilter(
                  "minPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxPrice}
              onChange={(e) =>
                applyFilter(
                  "maxPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Quantity</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minQuantity}
              onChange={(e) =>
                applyFilter(
                  "minQuantity",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxQuantity}
              onChange={(e) =>
                applyFilter(
                  "maxQuantity",
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
