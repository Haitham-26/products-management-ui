import type React from "react";
import { Grid } from "antd";
import { Pagination, type PaginationProps } from "./Pagination";
import type { Product } from "../model/product/types/Product";
import { Empty } from "./Empty";
import { useTranslation } from "react-i18next";
import type { Order } from "../model/order/types/Order";
import type { Tag } from "../model/tag/types/Tag";
import type { Category } from "../model/category/types/Category";
import styled from "styled-components";
import { SpinnerFullScreen } from "./SpinnerFullScreen";
import { Text } from "./Text";
import { Button } from "./Button";
import type { Key } from "react";

const { useBreakpoint } = Grid;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const HeaderInfo = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledButton = styled(Button)`
  padding: 0;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
`;

const DataWrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.sm};
`;

type Data = Product | Order | Tag | Category;

type PaginatedDataCardsProps = {
  data: Array<Data>;
  itemRender: (item: Data) => React.ReactNode;
  paginationOptions: PaginationProps;
  loading?: boolean;
  selectedData: Key[];
  setSelectedData: VoidCallback<Key[]>;
};

export const PaginatedDataCards: React.FC<PaginatedDataCardsProps> = ({
  data = [],
  itemRender,
  paginationOptions,
  loading = false,
  selectedData = [],
  setSelectedData,
}) => {
  const { md } = useBreakpoint();
  const { t } = useTranslation();

  if (md) {
    return null;
  }

  if (loading) {
    return <SpinnerFullScreen />;
  }

  if (!data.length) {
    return <Empty description={t("table.emptyText")} />;
  }

  const total = paginationOptions.total || 0;
  const isAllSelected = selectedData.length && selectedData.length >= total;
  const hasSelection = Boolean(selectedData.length);

  return (
    <Container>
      <Header>
        <HeaderInfo>
          <Text>
            {hasSelection
              ? t("table.selectedCount", { count: selectedData.length, total })
              : t("table.total", { total })}
          </Text>
        </HeaderInfo>

        <StyledButton
          onClick={() =>
            setSelectedData(
              isAllSelected ? [] : [...new Set(data.map((p) => p._id))],
            )
          }
        >
          {isAllSelected
            ? `${t("common.clearSelected")} (${selectedData.length})`
            : t("common.selectAll")}
        </StyledButton>
      </Header>

      <DataWrapper>{data.map((p) => itemRender(p))}</DataWrapper>

      <Pagination {...paginationOptions} />
    </Container>
  );
};
