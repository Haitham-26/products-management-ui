import React, { useMemo, type Key } from "react";
import styled from "styled-components";
import { ProductMainImage } from "./ProductMainImage";
import { Text } from "../../../components/Text";
import { stringWithCurrencyCode } from "../../../utils/String";
import { useAppSelector } from "../../../redux/store";
import settingsSliceSelectors from "../../../redux/settings/settings.selector";
import type { Product } from "../../../model/product/types/Product";
import { ProductStatus } from "../../../model/product/types/ProductStatus.enum";
import { useTranslation } from "react-i18next";
import { Checkbox, Tag } from "antd";
import { ProductStockStatus } from "../../../model/product/types/ProductStockStatus.enum";
import { ProductActionsDropdown } from "./ProductActionsDropdown";

const Card = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.lg};
  overflow: hidden;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.lg};
  padding: ${({ theme }) => theme.spacing.md};
  flex-grow: 1;
`;

const CheckboxWrapper = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.background};
  border-inline-end: 1px solid ${({ theme }) => theme.colors.border};
  padding: ${({ theme }) => `${theme.spacing.md} ${theme.spacing.sm}`};
`;

const Header = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Identifier = styled(Text)`
  direction: ltr;
  text-align: start;

  html[dir="rtl"] & {
    text-align: end;
  }
`;

const Details = styled.div`
  flex: 1;
  min-width: 0;
`;

const Stats = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: ${({ theme }) => theme.spacing.md};
`;

const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

type FNType = VoidCallback<Product> | undefined;

type ProductCardProps = {
  product: Product;
  functions: {
    onEdit: FNType;
    onRead: FNType;
    onDelete: FNType;
    onToggleStatus: FNType;
    onManageStock: FNType;
  };
  selectedData: Key[];
  setSelectedData: React.Dispatch<React.SetStateAction<Key[]>>;
};

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  functions,
  selectedData,
  setSelectedData,
}) => {
  const { t } = useTranslation();

  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const getStockColor = () => {
    const threshold = product.minStock || settings.inventory.defaultMinStock;

    const isOutOfStock = product.quantity <= 0;
    const isLowStock = !isOutOfStock && product.quantity <= threshold;

    const stockStatus = isOutOfStock
      ? ProductStockStatus.OUT_OF_STOCK
      : isLowStock
        ? ProductStockStatus.LOW_STOCK
        : ProductStockStatus.IN_STOCK;

    switch (stockStatus) {
      case ProductStockStatus.OUT_OF_STOCK:
        return "error";
      case ProductStockStatus.LOW_STOCK:
        return "warning";
      default:
        return "success";
    }
  };

  const isSelected = useMemo(
    () => selectedData.includes(product._id),
    [selectedData, product._id],
  );

  return (
    <Card>
      <CheckboxWrapper>
        <Checkbox
          checked={isSelected}
          onChange={() =>
            setSelectedData((prev) =>
              prev.includes(product._id)
                ? prev.filter((id) => id !== product._id)
                : [...prev, product._id],
            )
          }
        />
      </CheckboxWrapper>

      <Content>
        <Header>
          <ProductMainImage
            url={product.mainImage?.secureUrl}
            width="5rem"
            borderRadius="md"
          />

          <Details>
            <Text fontWeight="700">{product.name}</Text>
            <Identifier color="textSecondary" fontSize="small">
              #{product.identifier}
            </Identifier>
            <Tag
              color={
                product.status === ProductStatus.PUBLISHED ? "success" : "error"
              }
            >
              {t(`products.status.${product.status.toLowerCase()}`)}
            </Tag>
          </Details>

          <ProductActionsDropdown product={product} actions={functions} />
        </Header>

        <Stats>
          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("products.fields.finalSalePrice")}
            </Text>

            <Text fontWeight="600">
              {stringWithCurrencyCode(
                settings.currency,
                product.finalSalePrice,
              )}
            </Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("products.fields.profit")}
            </Text>

            <Text
              color={product.profit >= 0 ? "success" : "error"}
              fontWeight="600"
            >
              {stringWithCurrencyCode(settings.currency, product.profit)}
            </Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("common.quantity")}
            </Text>

            <Text color={getStockColor()}>{product.quantity}</Text>
          </Stat>

          <Stat>
            <Text color="textSecondary" fontSize="small">
              {t("common.category")}
            </Text>

            <Text>{product.category?.name || "-"}</Text>
          </Stat>
        </Stats>
      </Content>
    </Card>
  );
};
