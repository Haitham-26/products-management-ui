import type React from "react";
import { Container } from "../../components/Container";
import styled from "styled-components";
import { faChartBar } from "@fortawesome/free-solid-svg-icons/faChartBar";
import { PageHeader } from "../../components/PageHeader";
import { DashboardTopCard } from "./components/DashboardTopCard";
import { DashboardTopProductsCard } from "./components/DashboardTopProductsCard";
import { ProductStockStatus } from "../../model/product/types/ProductStockStatus.enum";

const StyledContainer = styled(Container)`
  flex-grow: 1;
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  align-items: stretch;

  grid-template-columns: 1fr;
  grid-template-areas:
    "total-products"
    "total-orders"
    "low-stock"
    "out-of-stock"
    "top-products";

  @media (min-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
    grid-template-areas:
      "total-products total-orders"
      "low-stock       out-of-stock"
      "top-products   top-products";
  }

  @media (min-width: 1200px) {
    grid-template-columns: repeat(3, 1fr);
    grid-template-areas:
      "total-products total-orders   low-stock"
      "top-products   top-products   out-of-stock";
  }
`;

const AreaWrapper = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  display: flex;
  flex-direction: column;
`;

export const Dashboard: React.FC = () => {
  return (
    <StyledContainer>
      <PageHeader icon={faChartBar} title="Dashboard" />

      <DashboardGrid>
        <AreaWrapper area="total-products">
          <DashboardTopCard
            title="Total Products"
            link="/products"
            totalCount={50}
            trends={{
              today: 1,
              lastWeek: 5,
              lastMonth: 10,
            }}
            variant="MAIN"
          />
        </AreaWrapper>

        <AreaWrapper area="total-orders">
          <DashboardTopCard
            title="Total Orders"
            link="/orders"
            totalCount={20}
            trends={{
              today: 1,
              lastWeek: 5,
              lastMonth: 10,
            }}
          />
        </AreaWrapper>

        <AreaWrapper area="top-products">
          <DashboardTopProductsCard />
        </AreaWrapper>

        <AreaWrapper area="low-stock">
          <DashboardTopCard
            title="Low Stock Products"
            link={`/products?stockStatus=${ProductStockStatus.LOW_STOCK}`}
            totalCount={50}
            variant="WARNING"
          />
        </AreaWrapper>

        <AreaWrapper area="out-of-stock">
          <DashboardTopCard
            title="Out of Stock Products"
            link={`/products?stockStatus=${ProductStockStatus.OUT_OF_STOCK}`}
            totalCount={12}
            variant="DANGER"
          />
        </AreaWrapper>
      </DashboardGrid>
    </StyledContainer>
  );
};
