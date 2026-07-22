import type React from "react";
import { Container } from "../../components/Container";
import styled from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { dashboardActions } from "../../redux/dashboard/dashboard.slice";
import dashboardSliceSelectors from "../../redux/dashboard/dashboard.selector";
import { SpinnerFullScreen } from "../../components/SpinnerFullScreen";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../../theme/Breakpoints";
import { Select } from "../../components/Select";
import { DatePeriodFilters } from "../../model/shared/types/DatePeriodFilters.enum";
import type { TFunction } from "i18next";
import camelCase from "lodash/camelCase";
import { DashboardKPICard } from "./components/DashboardKPICard";
import { faSackDollar } from "@fortawesome/free-solid-svg-icons/faSackDollar";
import { faChartLine } from "@fortawesome/free-solid-svg-icons/faChartLine";
import { faClock } from "@fortawesome/free-solid-svg-icons/faClock";
import { faTriangleExclamation } from "@fortawesome/free-solid-svg-icons/faTriangleExclamation";
import { Icon } from "../../components/Icon";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons/faArrowRight";
import { Tag } from "antd";
import i18n from "../../i18n";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons/faArrowLeft";
import { DashboardRevenueAndProfitChart } from "./components/DashboardRevenueAndProfitChart";
import { DashboardOrdersChart } from "./components/DashboardOrdersChart";
import { DashboardTopProductsChart } from "./components/DashboardTopProductsChart";
import { ProductStockStatus } from "../../model/product/types/ProductStockStatus.enum";
import { Text } from "../../components/Text";
import { Link } from "react-router-dom";
import { OrderStatus } from "../../model/order/types/OrderStatus.enum";
import { stringWithCurrencyCode } from "../../utils/String";
import { settingsActions } from "../../redux/settings/settings.slice";
import settingsSliceSelectors from "../../redux/settings/settings.selector";

const getDateRangeOptions = (t: TFunction) =>
  Object.values(DatePeriodFilters).map((d) => ({
    label: t(`common.${camelCase(d)}`),
    value: d,
  }));

const StyledContainer = styled(Container)`
  flex-grow: 1;
`;

const StyledSelect = styled(Select)`
  min-width: 8rem;
`;

const GridsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
`;

const KPIsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: 1fr;

  @media (min-width: ${Breakpoints.SM}) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (min-width: ${Breakpoints.LG}) {
    grid-template-columns: repeat(4, 1fr);
  }
`;

const ChartsGrid = styled.div`
  display: grid;
  gap: ${({ theme }) => theme.spacing.md};
  grid-template-columns: 1fr;

  @media (min-width: ${Breakpoints.LG}) {
    grid-template-columns: 2fr 1fr;

    & > :nth-child(3) {
      grid-column: 1 / -1;
    }
  }
`;

const BadgesWrapper = styled.div`
  display: flex;
  gap: 6px;
  width: 100%;
`;

const AlertBadge = styled(Tag)`
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: 4px;
  padding: 2px 6px;
  margin: 0;

  .arrow-icon {
    opacity: 0;
    transition:
      transform 0.2s ease-in-out,
      opacity 0.2s ease-in-out;
  }

  &:hover .arrow-icon {
    opacity: 1;
  }

  html[dir="ltr"] &:hover .arrow-icon {
    transform: translateX(2px);
  }

  html[dir="rtl"] &:hover .arrow-icon {
    transform: translateX(-2px);
  }
`;

const ExtraWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 8px;
  width: fit-content;
  border-radius: 9999px;
  background: ${({ theme }) => `${theme.colors.success}0d`};
  user-select: none;

  p {
    font-size: calc(${({ theme }) => theme.typography.small} * 0.75);
  }
`;

const StatusDot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: ${({ theme }) => theme.radius.circle};
  background: ${({ theme }) => theme.colors.success};
`;

const ViewOrdersLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: calc(${({ theme }) => theme.typography.small} * 0.85);
  color: ${({ theme }) => theme.colors.primary} !important;
  text-decoration: none;
  font-weight: 500;

  .arrow-icon {
    transition: transform 0.2s ease-in-out;
  }

  &:hover .arrow-icon {
    html[dir="ltr"] & {
      transform: translateX(3px);
    }
    html[dir="rtl"] & {
      transform: translateX(-3px);
    }
  }
`;

export const Dashboard: React.FC = () => {
  const [datePeriod, setDatePeriod] = useState<DatePeriodFilters>(
    DatePeriodFilters.TODAY,
  );

  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const stats = useAppSelector(dashboardSliceSelectors.selectDashboardStats);
  const loading = useAppSelector(
    dashboardSliceSelectors.selectDashboardStatsLoading,
  );
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const { dashboard, orders } = appRoutes;
  const isRtl = i18n.dir(i18n.language) === "rtl";
  const arrowIcon = isRtl ? faArrowLeft : faArrowRight;

  const {
    totalRevenue,
    totalProfit,
    ordersCountByStatus,
    productsCountByStatus,
  } = stats;

  const totalStockAlerts =
    productsCountByStatus.outOfStock + productsCountByStatus.lowStock;

  useEffect(() => {
    dispatch(dashboardActions.getDashboardStats({ datePeriod }));
    dispatch(settingsActions.getSettings());
  }, [dispatch, datePeriod]);

  return (
    <StyledContainer>
      <PageHeader
        icon={dashboard.icon}
        title={t(dashboard.titleKey)}
        extra={
          <StyledSelect
            value={datePeriod}
            onChange={setDatePeriod}
            options={getDateRangeOptions(t)}
          />
        }
      />

      {!loading ? (
        <GridsWrapper>
          <KPIsGrid>
            <DashboardKPICard
              icon={faSackDollar}
              title={t("dashboard.totalRevenues.title")}
              value={stringWithCurrencyCode(settings.currency, totalRevenue)}
              extra={
                <ExtraWrapper>
                  <StatusDot />
                  <Text fontSize="small" color="success">
                    {t("dashboard.totalRevenues.note")}
                  </Text>
                </ExtraWrapper>
              }
            />

            <DashboardKPICard
              icon={faChartLine}
              title={t("dashboard.totalProfits.title")}
              value={stringWithCurrencyCode(settings.currency, totalProfit)}
              extra={
                <ExtraWrapper>
                  <StatusDot />
                  <Text fontSize="small" color="success">
                    {t("dashboard.totalProfits.note")}
                  </Text>
                </ExtraWrapper>
              }
            />

            <DashboardKPICard
              icon={faClock}
              title={t("dashboard.pendingOrders.title")}
              value={ordersCountByStatus.pending}
              extra={
                <ViewOrdersLink
                  to={`${orders.path}?status=${OrderStatus.PENDING}`}
                >
                  <span>{t("dashboard.pendingOrders.action")}</span>
                  <Icon icon={arrowIcon} size="xs" className="arrow-icon" />
                </ViewOrdersLink>
              }
            />

            <DashboardKPICard
              icon={faTriangleExclamation}
              title={t("dashboard.stockAlerts.title")}
              value={totalStockAlerts}
              extra={
                <BadgesWrapper>
                  <AlertBadge
                    color="error"
                    href={`/products?stockStatus=${ProductStockStatus.OUT_OF_STOCK}`}
                    variant="outlined"
                  >
                    <span>
                      {productsCountByStatus.outOfStock}{" "}
                      {t("dashboard.stockAlerts.out")}
                    </span>
                    <Icon icon={arrowIcon} size="xs" className="arrow-icon" />
                  </AlertBadge>

                  <AlertBadge
                    color="warning"
                    href={`/products?stockStatus=${ProductStockStatus.LOW_STOCK}`}
                    variant="outlined"
                  >
                    <span>
                      {productsCountByStatus.lowStock}{" "}
                      {t("dashboard.stockAlerts.low")}
                    </span>
                    <Icon icon={arrowIcon} size="xs" className="arrow-icon" />
                  </AlertBadge>
                </BadgesWrapper>
              }
            />
          </KPIsGrid>

          <ChartsGrid>
            <DashboardRevenueAndProfitChart selectedDatePeriod={datePeriod} />
            <DashboardOrdersChart />
            <DashboardTopProductsChart />
          </ChartsGrid>
        </GridsWrapper>
      ) : (
        <SpinnerFullScreen />
      )}
    </StyledContainer>
  );
};
