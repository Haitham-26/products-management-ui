import type React from "react";
import styled from "styled-components";
import { Select } from "../../../components/Select";
import { useAppSelector } from "../../../redux/store";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { useCallback, useMemo, useState } from "react";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { useSearchParams } from "react-router-dom";
import {
  buildProductsParams,
  parseProductsFiltersFromParams,
} from "../utils/productUtils";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import productSliceSelectors from "../../../redux/product/products.selector";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { ProductStockStatus } from "../../../model/product/types/ProductStockStatus.enum";
import capitalize from "lodash/capitalize";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import debounce from "lodash/debounce";
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

const stockStatusOptions = [
  {
    label: "All",
    value: null,
  },
  ...Object.values(ProductStockStatus).map((s) => ({
    label: capitalize(s.replaceAll("_", " ")),
    value: s,
  })),
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

type ProductsFiltersProps = {
  activeFiltersCount: number;
};

export const ProductsFilter: React.FC<ProductsFiltersProps> = ({
  activeFiltersCount,
}) => {
  const [basePriceRange, setBasePriceRange] = useState<Range>(null);
  const [finalPriceRange, setFinalPriceRange] = useState<Range>(null);
  const [quantityRange, setQuantityRange] = useState<Range>(null);

  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const productsMeta = useAppSelector(productSliceSelectors.selectProductsMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseProductsFiltersFromParams(searchParams, productsMeta),
    [searchParams, productsMeta],
  );

  const applyFilter = useCallback(
    (key: keyof GetProductsDto, value: unknown) => {
      setSearchParams(
        buildProductsParams(
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

  const debouncedApplyFilter = useMemo(() => {
    return debounce(applyFilter, 400);
  }, [applyFilter]);

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
          <PopoverLabel>Base Price ({settings.currency})</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={basePriceRange?.min || ""}
              onChange={(e) => {
                setBasePriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "minBasePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={basePriceRange?.max || ""}
              onChange={(e) => {
                setBasePriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "maxBasePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Final Price ({settings.currency})</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={finalPriceRange?.min || ""}
              onChange={(e) => {
                setFinalPriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "minFinalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={finalPriceRange?.max || ""}
              onChange={(e) => {
                setFinalPriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "maxFinalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Offer Type</PopoverLabel>
          <Select
            placeholder="Any"
            value={filters.discountType}
            onChange={(val) => applyFilter("discountType", val)}
            allowClear
            options={[
              {
                label: "Any",
                value: null,
              },
              {
                label: "Fixed Value",
                value: ProductDiscountTypes.FIXED,
              },
              {
                label: "Percentage",
                value: ProductDiscountTypes.PERCENTAGE,
              },
            ]}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>Category</PopoverLabel>
          <Select
            placeholder="All categories"
            value={filters.categoryId}
            onChange={(val) => applyFilter("categoryId", val)}
            allowClear
            options={categories.map((c) => ({
              label: c.name,
              value: c._id,
            }))}
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Tags</PopoverLabel>
          <Select
            mode="multiple"
            placeholder="Select tags"
            maxTagCount="responsive"
            value={filters.tagIds}
            onChange={(vals) => applyFilter("tagIds", vals)}
            options={tags.map((tag) => ({
              label: tag.name,
              value: tag._id,
            }))}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>Stock Status</PopoverLabel>
          <Select
            placeholder="All"
            value={filters.stockStatus}
            onChange={(val) => applyFilter("stockStatus", val)}
            allowClear
            options={stockStatusOptions}
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Quantity</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={quantityRange?.min || ""}
              onChange={(e) => {
                setQuantityRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "minQuantity",
                  e.target.value ? Number(e.target.value) : undefined,
                );
              }}
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={quantityRange?.max || ""}
              onChange={(e) => {
                setQuantityRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                debouncedApplyFilter(
                  "maxQuantity",
                  e.target.value ? Number(e.target.value) : undefined,
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
              Clear all
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
