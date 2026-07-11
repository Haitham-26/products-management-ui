import type React from "react";
import { Container } from "../../components/Container";
import styled from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { DashboardTopCard } from "./components/DashboardTopCard";
import { DashboardTopProductsCard } from "./components/DashboardTopProductsCard";
import { ProductStockStatus } from "../../model/product/types/ProductStockStatus.enum";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { dashboardActions } from "../../redux/dashboard/dashboard.slice";
import userSliceSelectors from "../../redux/user/user.selector";
import dashboardSliceSelectors from "../../redux/dashboard/dashboard.selector";
import { SpinnerFullScreen } from "../../components/SpinnerFullScreen";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";

const StyledContainer = styled(Container)`
  flex-grow: 1;
`;

const DashboardGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.lg};
  align-items: start;
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
      "total-products total-orders   top-products"
      "low-stock       out-of-stock   top-products";
  }
`;

const AreaWrapper = styled.div<{ area: string }>`
  grid-area: ${({ area }) => area};
  display: flex;
  flex-direction: column;
  align-self: stretch;
`;

export const Dashboard: React.FC = () => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const stats = useAppSelector(dashboardSliceSelectors.selectDashboardStats);
  const loading = useAppSelector(
    dashboardSliceSelectors.selectDashboardStatsLoading,
  );

  const { dashboard } = appRoutes;

  const { products, orders, lowStockProducts, outOfStockProducts } = stats;

  useEffect(() => {
    dispatch(dashboardActions.getDashboardStats());
  }, [dispatch, userId]);

  return (
    <StyledContainer>
      <PageHeader icon={dashboard.icon} title={t(dashboard.titleKey)} />

      {!loading ? (
        <DashboardGrid>
          <AreaWrapper area="total-products">
            <DashboardTopCard
              title="Total Products"
              link="/products"
              totalCount={products?.totalCount || 0}
              trends={{
                today: products?.todayCount || 0,
                lastWeek: products?.lastWeekCount || 0,
                lastMonth: products?.lastMonthCount || 0,
              }}
              variant="MAIN"
            />
          </AreaWrapper>

          <AreaWrapper area="total-orders">
            <DashboardTopCard
              title="Total Orders"
              link="/orders"
              totalCount={orders?.totalCount || 0}
              trends={{
                today: orders?.todayCount || 0,
                lastWeek: orders?.lastWeekCount || 0,
                lastMonth: orders?.lastMonthCount || 0,
              }}
            />
          </AreaWrapper>

          <AreaWrapper area="low-stock">
            <DashboardTopCard
              title="Low Stock Products"
              link={`/products?stockStatus=${ProductStockStatus.LOW_STOCK}`}
              totalCount={lowStockProducts?.totalCount}
              variant="WARNING"
            />
          </AreaWrapper>

          <AreaWrapper area="out-of-stock">
            <DashboardTopCard
              title="Out of Stock Products"
              link={`/products?stockStatus=${ProductStockStatus.OUT_OF_STOCK}`}
              totalCount={outOfStockProducts?.totalCount}
              variant="DANGER"
            />
          </AreaWrapper>

          <AreaWrapper area="top-products">
            <DashboardTopProductsCard />
          </AreaWrapper>
        </DashboardGrid>
      ) : (
        <SpinnerFullScreen />
      )}
    </StyledContainer>
  );
};
