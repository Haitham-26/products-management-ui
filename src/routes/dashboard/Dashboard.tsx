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
  gap: 4px;
  margin-top: auto;
`;

const AlertBadge = styled(Tag)`
  flex-grow: 1;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 8px;

  .arrow-icon {
    opacity: 0;
    transition: all 0.2s ease-in-out;
  }

  html[dir="ltr"] & .arrow-icon {
    transform: translateX(-4px);
  }
  html[dir="rtl"] & .arrow-icon {
    transform: translateX(4px);
  }

  &:hover .arrow-icon {
    opacity: 1;
  }

  html[dir="ltr"] &:hover .arrow-icon {
    transform: translateX(-8px);
  }
  html[dir="rtl"] &:hover .arrow-icon {
    transform: translateX(0px);
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

  const { dashboard } = appRoutes;

  useEffect(() => {
    dispatch(dashboardActions.getDashboardStats({ datePeriod }));
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
              title={t("dashboard.totalRevenues")}
              value="$4,000"
            />

            <DashboardKPICard
              icon={faChartLine}
              title={t("dashboard.totalProfits")}
              value="$275"
            />

            <DashboardKPICard
              icon={faClock}
              title={t("dashboard.pendingOrders")}
              value="175"
            />

            <DashboardKPICard
              icon={faTriangleExclamation}
              title={t("dashboard.stockAlerts.title")}
              value={
                <BadgesWrapper>
                  <AlertBadge
                    color="error"
                    href={`/products?stockStatus=${ProductStockStatus.OUT_OF_STOCK}`}
                    variant="outlined"
                  >
                    <span>
                      {7} {t("dashboard.stockAlerts.out")}
                    </span>
                    <Icon
                      icon={
                        i18n.dir(i18n.language) === "ltr"
                          ? faArrowRight
                          : faArrowLeft
                      }
                      size="xs"
                      className="arrow-icon"
                    />
                  </AlertBadge>

                  <AlertBadge
                    href={`/products?stockStatus=${ProductStockStatus.LOW_STOCK}`}
                    color="warning"
                    variant="outlined"
                  >
                    <span>
                      {5} {t("dashboard.stockAlerts.low")}
                    </span>
                    <Icon
                      icon={
                        i18n.dir(i18n.language) === "ltr"
                          ? faArrowRight
                          : faArrowLeft
                      }
                      size="xs"
                      className="arrow-icon"
                    />
                  </AlertBadge>
                </BadgesWrapper>
              }
            />
          </KPIsGrid>

          <ChartsGrid>
            <DashboardRevenueAndProfitChart />

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
