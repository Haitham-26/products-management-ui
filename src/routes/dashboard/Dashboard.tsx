import type React from "react";
import { Container } from "../../components/Container";
import styled from "styled-components";
import { PageHeader } from "../../components/PageHeader";
import { Fragment, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { dashboardActions } from "../../redux/dashboard/dashboard.slice";
import dashboardSliceSelectors from "../../redux/dashboard/dashboard.selector";
import { SpinnerFullScreen } from "../../components/SpinnerFullScreen";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../../theme/Breakpoints";
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
import type { ThemeType } from "../../theme/theme";
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";
import { getDateRangeLabel } from "../../utils/Date";
import customParseFormat from "dayjs/plugin/customParseFormat";
import advancedFormat from "dayjs/plugin/advancedFormat";
import localeData from "dayjs/plugin/localeData";
import weekday from "dayjs/plugin/weekday";
import weekOfYear from "dayjs/plugin/weekOfYear";
import weekYear from "dayjs/plugin/weekYear";
import { DateInput } from "../../components/DateInput";

dayjs.extend(customParseFormat);
dayjs.extend(advancedFormat);
dayjs.extend(localeData);
dayjs.extend(weekday);
dayjs.extend(weekOfYear);
dayjs.extend(weekYear);

const { RangePicker } = DatePicker;

const StyledContainer = styled(Container)`
  flex-grow: 1;
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

const TotalProfitSpan = styled.span<{ color: keyof ThemeType["colors"] }>`
  color: ${({ theme, color }) => theme.colors[color]};
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

const StyledRangePicker = styled(RangePicker)`
  @media (max-width: ${Breakpoints.SM}) {
    display: none;
  }
`;

const DateInputWrapper = styled.div`
  display: flex;
  gap: 4px;

  @media (min-width: ${Breakpoints.SM}) {
    display: none;
  }
`;

const now = dayjs();

export const Dashboard: React.FC = () => {
  const [dateRange, setDateRange] = useState<[Dayjs, Dayjs]>([
    now.startOf("day"),
    now.endOf("day"),
  ]);

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

  const selectedPeriodLabel = getDateRangeLabel(dateRange, t);

  const {
    totalRevenue,
    totalProfit,
    ordersCountByStatus,
    productsCountByStatus,
  } = stats;

  const totalStockAlerts =
    productsCountByStatus.outOfStock + productsCountByStatus.lowStock;

  useEffect(() => {
    dispatch(
      dashboardActions.getDashboardStats({
        startDate: dateRange[0].format("YYYY-MM-DD"),
        endDate: dateRange[1].format("YYYY-MM-DD"),
      }),
    );
    dispatch(settingsActions.getSettings());
  }, [dispatch, dateRange]);

  return (
    <StyledContainer>
      <PageHeader
        icon={dashboard.icon}
        title={t(dashboard.titleKey)}
        extra={
          <Fragment>
            <StyledRangePicker
              value={dateRange}
              allowClear={false}
              onChange={(dates) => {
                if (dates && dates[0] && dates[1]) {
                  setDateRange([dates[0], dates[1]] as [Dayjs, Dayjs]);
                }
              }}
            />
            <DateInputWrapper>
              <DateInput
                title={t("common.startDate")}
                value={dateRange[0]}
                onChange={(date) => {
                  if (!date) {
                    return;
                  }

                  setDateRange((prev) => [
                    (date as Dayjs).startOf("day"),
                    prev[1],
                  ]);
                }}
                allowClear={false}
                maxDate={dateRange[1]}
                id="from"
              />

              <DateInput
                title={t("common.endDate")}
                value={dateRange[1]}
                onChange={(date) => {
                  if (!date) {
                    return;
                  }

                  setDateRange((prev) => [
                    prev[0],
                    (date as Dayjs).endOf("day"),
                  ]);
                }}
                allowClear={false}
                minDate={dateRange[0]}
                id="to"
              />
            </DateInputWrapper>
          </Fragment>
        }
      />

      {!loading ? (
        <GridsWrapper>
          <KPIsGrid>
            <DashboardKPICard
              icon={faSackDollar}
              title={t("dashboard.totalRevenues.title")}
              badgeContent={selectedPeriodLabel}
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
              badgeContent={selectedPeriodLabel}
              value={
                <TotalProfitSpan color={totalProfit >= 0 ? "primary" : "error"}>
                  {stringWithCurrencyCode(settings.currency, totalProfit)}
                </TotalProfitSpan>
              }
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
              badgeContent={t("common.allTime")}
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
              badgeContent={t("common.allTime")}
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
            <DashboardRevenueAndProfitChart dateRange={dateRange} />
            <DashboardOrdersChart />
            <DashboardTopProductsChart
              selectedDatePeriodLabel={selectedPeriodLabel}
            />
          </ChartsGrid>
        </GridsWrapper>
      ) : (
        <SpinnerFullScreen />
      )}
    </StyledContainer>
  );
};
