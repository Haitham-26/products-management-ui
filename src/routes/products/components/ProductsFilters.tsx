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
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import { CreationDateFilters } from "../../../model/shared/types/CreationDateFilters.enum";
import { Checkbox } from "antd";
import { SearchSelect } from "../../../components/SearchSelect";
import { categoryActions } from "../../../redux/category/categories.slice";
import debounce from "lodash/debounce";
import userSliceSelectors from "../../../redux/user/user.selector";
import { tagActions } from "../../../redux/tag/tags.slice";
import { useTranslation } from "react-i18next";
import type { TFunction } from "i18next";
import camelCase from "lodash/camelCase";

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

const stockStatusOptions = (t: TFunction) => [
  {
    label: t("common.all"),
    value: null,
  },
  ...Object.values(ProductStockStatus).map((s) => ({
    label: t(`products.stockStatus.${camelCase(s)}`),
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
  const [purchasePriceRange, setPurchasePriceRange] = useState<Range>({
    min: filters.minPurchasePrice ?? 0,
    max: filters.maxPurchasePrice ?? 0,
  });
  const [salePriceRange, setSalePriceRange] = useState<Range>({
    min: filters.minSalePrice ?? 0,
    max: filters.maxSalePrice ?? 0,
  });
  const [finalSalePriceRange, setFinalSalePriceRange] = useState<Range>({
    min: filters.minFinalSalePrice ?? 0,
    max: filters.maxFinalSalePrice ?? 0,
  });
  const [profitRange, setProfitRange] = useState<Range>({
    min: filters.minProfit ?? 0,
    max: filters.maxProfit ?? 0,
  });
  const [quantityRange, setQuantityRange] = useState<Range>({
    min: filters.minQuantity ?? 0,
    max: filters.maxQuantity ?? 0,
  });

  const [searchCategoriesLoading, setSearchCategoriesLoading] = useState(false);
  const [searchTagsLoading, setSearchTagsLoading] = useState(false);

  const categories = useAppSelector(categorySliceSelectors.selectCategories);
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;

  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [, setSearchParams] = useSearchParams();

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

    setPurchasePriceRange(null);
    setSalePriceRange(null);
    setFinalSalePriceRange(null);
    setProfitRange(null);
    setQuantityRange(null);
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
          <Checkbox
            checked={filters.showDraft}
            onChange={(e) => applyFilter("showDraft", e.target.checked)}
          >
            <PopoverLabel>{t("products.filters.showDraft")}</PopoverLabel>
          </Checkbox>
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>
            {t("products.fields.purchasePrice")} ({settings.currency})
          </PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={purchasePriceRange?.min || ""}
              onChange={(e) => {
                setPurchasePriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minPurchasePrice",
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
              value={purchasePriceRange?.max || ""}
              onChange={(e) => {
                setPurchasePriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxPurchasePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>
            {t("products.fields.salePrice")} ({settings.currency})
          </PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={salePriceRange?.min || ""}
              onChange={(e) => {
                setSalePriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minSalePrice",
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
              value={salePriceRange?.max || ""}
              onChange={(e) => {
                setSalePriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxSalePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>
            {t("products.fields.finalSalePrice")} ({settings.currency})
          </PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={finalSalePriceRange?.min || ""}
              onChange={(e) => {
                setFinalSalePriceRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minFinalSalePrice",
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
              value={finalSalePriceRange?.max || ""}
              onChange={(e) => {
                setFinalSalePriceRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxFinalSalePrice",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
              min={0}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>
            {t("products.fields.profit")} ({settings.currency})
          </PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
              value={profitRange?.min || ""}
              onChange={(e) => {
                setProfitRange((prev) => ({
                  ...prev,
                  min: Number(e.target.value),
                }));
                applyFilter(
                  "minProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder={t("common.max")}
              value={profitRange?.max || ""}
              onChange={(e) => {
                setProfitRange((prev) => ({
                  ...prev,
                  max: Number(e.target.value),
                }));
                applyFilter(
                  "maxProfit",
                  e.target.value ? Number(e.target.value) : undefined,
                  true,
                );
              }}
            />
          </RangeRow>
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>
            {t("products.create-edit.price.discount.type.title")}
          </PopoverLabel>
          <Select
            placeholder={t("common.all")}
            value={filters.discountType}
            onChange={(val) => applyFilter("discountType", val)}
            allowClear
            options={[
              {
                label: t("common.all"),
                value: null,
              },
              {
                label: t(
                  "products.create-edit.price.discount.types.percentage",
                ),
                value: ProductDiscountTypes.PERCENTAGE,
              },

              {
                label: t("products.create-edit.price.discount.types.fixed", {
                  currency: settings.currency,
                }),
                value: ProductDiscountTypes.FIXED,
              },
            ]}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>{t("common.category")}</PopoverLabel>
          <SearchSelect
            value={filters.categoryId || undefined}
            onChange={(val) => applyFilter("categoryId", val)}
            options={categoriesOptions}
            onSearch={searchCategories}
            allowClear
            loading={searchCategoriesLoading}
            placeholder={t(
              "products.create-edit.taxonomy.category.placeholder",
            )}
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>{t("common.tags")}</PopoverLabel>
          <SearchSelect
            mode="multiple"
            value={filters.tagIds || undefined}
            onChange={(val) => applyFilter("tagIds", val)}
            options={tagsOptions}
            onSearch={searchTags}
            loading={searchTagsLoading}
            allowClear
            placeholder={t("products.create-edit.taxonomy.tags.placeholder")}
          />
        </PopoverSection>

        <PopoverSeparator />

        <PopoverSection>
          <PopoverLabel>{t("products.stockStatus.title")}</PopoverLabel>
          <Select
            placeholder={t("common.all")}
            value={filters.stockStatus}
            onChange={(val) => applyFilter("stockStatus", val)}
            allowClear
            options={stockStatusOptions(t)}
          />
        </PopoverSection>

        <PopoverSection>
          <PopoverLabel>{t("common.quantity")}</PopoverLabel>
          <RangeRow>
            <Input
              type="number"
              placeholder={t("common.min")}
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
              placeholder={t("common.max")}
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
              {t("common.clearAll")}
            </Button>
          </PopoverFooter>
        </FiltersClearContainer>
      ) : null}
    </PopoverBody>
  );
};
