import type React from "react";
import styled, { useTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Bar } from "react-chartjs-2";
import type { ThemeType } from "../../../theme/theme";
import type { ChartOptions } from "chart.js";
import i18n from "../../../i18n";
import { Breakpoints } from "../../../theme/Breakpoints";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "../../../redux/store";
import dashboardSliceSelectors from "../../../redux/dashboard/dashboard.selector";
import { DatePeriodFilters } from "../../../model/shared/types/DatePeriodFilters.enum";
import type { TFunction } from "i18next";
import type { GetDashboardStatsResponseDto } from "../../../model/dashboard/dto/GetDashboardStatsResponseDto";
import { useMemo } from "react";
import { Tag } from "antd";
import camelCase from "lodash/camelCase";

const getLabels = (
  selectedDatePeriod: DatePeriodFilters,
  dates: Array<
    GetDashboardStatsResponseDto["profitAndRevenue"][number]["date"]
  >,
  t: TFunction,
) => {
  const currentLang = i18n.language;

  switch (selectedDatePeriod) {
    case DatePeriodFilters.LAST_7_DAYS:
    case DatePeriodFilters.LAST_30_DAYS:
      return dates.map((dateStr) => {
        if (!dateStr) {
          return "";
        }

        const options: Intl.DateTimeFormatOptions =
          selectedDatePeriod === DatePeriodFilters.LAST_7_DAYS
            ? { weekday: "long" }
            : { day: "numeric", month: "short" };

        const date = new Date(dateStr);

        return new Intl.DateTimeFormat(currentLang, options).format(date);
      });

    case DatePeriodFilters.TODAY:
    default:
      return [t("common.today")];
  }
};

const getOptions = (theme: ThemeType, isRTL: boolean): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      rtl: isRTL,
    },
    title: {
      display: true,
    },
  },
  scales: {
    x: {
      reverse: isRTL,
      grid: { display: false },
      ticks: {
        color: theme.colors.textSecondary,
        callback: function (value) {
          const label = this.getLabelForValue(value as number);
          return label.length > 12 ? label.slice(0, 10) + "..." : label;
        },
      },
    },
    y: {
      position: isRTL ? "right" : "left",
      grid: {
        color: `${theme.colors.border}20`,
      },
      ticks: {
        color: theme.colors.textSecondary,
      },
    },
  },
});

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.md};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.radius.md};
  height: 100%;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const Title = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.typography.subtitle};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
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

const ChartCanvasWrapper = styled.div`
  flex: 1;
  position: relative;
  min-width: 0;

  canvas {
    max-width: 100% !important;
  }

  @media (min-width: ${Breakpoints.MD}) {
    min-height: 16rem;
  }
`;

const StyledTag = styled(Tag)`
  font-size: calc(${({ theme }) => theme.typography.small} * 0.75);
  font-weight: 500;
`;

type DashboardRevenueAndProfitChartProps = {
  selectedDatePeriod: DatePeriodFilters;
};

export const DashboardRevenueAndProfitChart: React.FC<
  DashboardRevenueAndProfitChartProps
> = ({ selectedDatePeriod }) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const { profitAndRevenue } = useAppSelector(
    dashboardSliceSelectors.selectDashboardStats,
  );

  const dates = useMemo(
    () => profitAndRevenue.map((item) => item.date),
    [profitAndRevenue],
  );
  const profitData = useMemo(
    () => profitAndRevenue.map((item) => item.profit),
    [profitAndRevenue],
  );
  const revenueData = useMemo(
    () => profitAndRevenue.map((item) => item.revenue),
    [profitAndRevenue],
  );

  const data = {
    labels: getLabels(selectedDatePeriod, dates, t),
    datasets: [
      {
        label: t("dashboard.salesProfits.revenues"),
        data: revenueData,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
        backgroundColor: theme.colors.primary,
      },
      {
        label: t("dashboard.salesProfits.profits"),
        data: profitData,
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
        backgroundColor: theme.colors.success,
      },
    ],
  };

  return (
    <Container>
      <Header>
        <Title>
          <span>{t("dashboard.salesProfits.title")}</span>

          <StyledTag color={"blue"}>
            {t(`common.${camelCase(selectedDatePeriod)}`)}
          </StyledTag>
        </Title>

        <ExtraWrapper>
          <StatusDot />
          <Text fontSize="small" color="success">
            {t("dashboard.totalProfits.note")}
          </Text>
        </ExtraWrapper>
      </Header>

      <ChartCanvasWrapper>
        <Bar
          data={data}
          options={getOptions(theme, i18n.dir(i18n.language) === "rtl")}
        />
      </ChartCanvasWrapper>
    </Container>
  );
};
