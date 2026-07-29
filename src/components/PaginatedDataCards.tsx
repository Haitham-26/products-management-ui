import type React from "react";
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
import type { Return } from "../model/return/types/Return";
import isFunction from "lodash/isFunction";
import { Breakpoints } from "../theme/Breakpoints";

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

  @media (min-width: ${Breakpoints.LG}) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (min-width: ${Breakpoints.XL}) {
    grid-template-columns: repeat(3, minmax(0, 1fr));
  }
`;

type Data = Product | Order | Tag | Category | Return;

type PaginatedDataCardsProps = {
  data: Array<Data>;
  itemRender: (item: Data) => React.ReactNode;
  paginationOptions: PaginationProps;
  loading?: boolean;
  selectedData?: Key[];
  setSelectedData?: VoidCallback<Key[]>;
};

export const PaginatedDataCards: React.FC<PaginatedDataCardsProps> = ({
  data = [],
  itemRender,
  paginationOptions,
  loading = false,
  selectedData,
  setSelectedData,
}) => {
  const { t } = useTranslation();

  if (loading) {
    return <SpinnerFullScreen />;
  }

  if (!data.length) {
    return <Empty description={t("table.emptyText")} />;
  }

  const total = paginationOptions.total || 0;

  const selectedCount = selectedData?.length;

  const isAllSelected = selectedCount && selectedCount >= total;
  const hasSelection = Boolean(selectedCount);

  return (
    <Container>
      <Header>
        <HeaderInfo>
          <Text>
            {hasSelection
              ? t("table.selectedCount", { count: selectedCount, total })
              : t("table.total", { total })}
          </Text>
        </HeaderInfo>

        {isFunction(setSelectedData) ? (
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
        ) : null}
      </Header>

      <DataWrapper>{data.map((p) => itemRender(p))}</DataWrapper>

      <Pagination {...paginationOptions} />
    </Container>
  );
};
