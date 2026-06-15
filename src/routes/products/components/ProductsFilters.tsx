import type React from "react";
import styled from "styled-components";
import { Select } from "../../../components/Select";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import categorySliceSelectors from "../../../redux/category/categories.selector";
import tagSliceSelectors from "../../../redux/tag/tags.selector";
import { useCallback, useMemo, useState } from "react";
import type { GetProductsDto } from "../../../model/product/dto/GetProductsDto";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import { ProductDiscountTypes } from "../../../model/product/types/ProductDiscountTypes.enum";
import { ProductStockStatus } from "../../../model/product/types/ProductStockStatus.enum";
import capitalize from "lodash/capitalize";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";
import { Checkbox } from "antd";
import { SearchSelect } from "../../../components/SearchSelect";
import { categoryActions } from "../../../redux/category/categories.slice";
import debounce from "lodash/debounce";
import userSliceSelectors from "../../../redux/user/user.selector";
import { tagActions } from "../../../redux/tag/tags.slice";

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
  filters: Partial<GetProductsDto>;
  applyFilter: (
    key: keyof GetProductsDto,
    value: GetProductsDto[keyof GetProductsDto],
    debounce?: boolean,
  ) => void;
};

export const ProductsFilters: React.FC<ProductsFiltersProps> = ({
  activeFiltersCount,
  filters,
  applyFilter,
}) => {
  const [basePriceRange, setBasePriceRange] = useState<Range>(null);
  const [finalPriceRange, setFinalPriceRange] = useState<Range>(null);
  const [quantityRange, setQuantityRange] = useState<Range>(null);
  const [searchCategoriesLoading, setSearchCategoriesLoading] = useState(false);
  const [searchTagsLoading, setSearchTagsLoading] = useState(false);

  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchCategories = useCallback(
    debounce(async (keyword: string) => {
      try {
        setSearchCategoriesLoading(true);

        await dispatch(
          categoryActions.getCategories({
            userId,
            keyword,
            meta: { page: 1, limit: 50 },
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setSearchCategoriesLoading(false);
      }
    }, 800),
    [dispatch, userId],
  );
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const searchTags = useCallback(
    debounce(async (keyword: string) => {
      try {
        setSearchTagsLoading(true);

        await dispatch(
          tagActions.getTags({
            userId,
            keyword,
            meta: {
              page: 1,
              limit: 50,
            },
          }),
        ).unwrap();
      } catch (e) {
        console.log(e);
      } finally {
        setSearchTagsLoading(false);
      }
    }, 800),
    [dispatch, userId],
  );

  const categoriesOptions = useMemo(
    () =>
      categories.map((c) => ({
        label: c.name,
        value: c._id,
      })),
    [categories],
  );

  const tagsOptions = useMemo(
    () =>
      tags.map((t) => ({
        label: t.name,
        value: t._id,
      })),
    [tags],
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
          <Checkbox
            checked={filters.showDraft}
            onChange={(e) => applyFilter("showDraft", e.target.checked)}
          >
            <PopoverLabel>Show draft</PopoverLabel>
          </Checkbox>
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
                applyFilter(
                  "minBasePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
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
                applyFilter(
                  "maxBasePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
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
                applyFilter(
                  "minFinalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
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
                applyFilter(
                  "maxFinalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
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
          <SearchSelect
            value={filters.categoryId || undefined}
            onChange={(val) => applyFilter("categoryId", val)}
            options={categoriesOptions}
            onSearch={searchCategories}
            allowClear
            loading={searchCategoriesLoading}
            placeholder="Search for a category..."
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>Tags</PopoverLabel>
          <SearchSelect
            mode="multiple"
            value={filters.tagIds || undefined}
            onChange={(val) => applyFilter("tagIds", val)}
            options={tagsOptions}
            onSearch={searchTags}
            loading={searchTagsLoading}
            allowClear
            placeholder="Search for tags..."
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
                applyFilter(
                  "minQuantity",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
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
                applyFilter(
                  "maxQuantity",
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
              Clear all
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
