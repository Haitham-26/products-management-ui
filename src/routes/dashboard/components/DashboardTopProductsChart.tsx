import type React from "react";
import styled, { useTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Bar } from "react-chartjs-2";

import { useAppSelector } from "../../../redux/store";
import type { ThemeType } from "../../../theme/theme";
import dashboardSliceSelectors from "../../../redux/dashboard/dashboard.selector";
import { customChartJsTooltip } from "../utils/customChartJsTooltip";
import { useTranslation } from "react-i18next";
import { Breakpoints } from "../../../theme/Breakpoints";
import i18n from "../../../i18n";
import type { ChartOptions } from "chart.js";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  min-height: 22rem;
  gap: ${({ theme }) => theme.spacing.md};
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.radius.lg};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
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

  .chartjs-tooltip {
    position: absolute;
    pointer-events: none;
    background: white;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.12);
    border-radius: 8px;
    padding: 10px;
    display: flex;
    align-items: center;
    gap: 10px;
    transform: translate(-50%, -120%);
    transition: all 0.08s ease;
    z-index: 9999;
  }
`;

const getChartColors = (theme: ThemeType) => [
  theme.colors.primary,
  `${theme.colors.primary}dd`,
  `${theme.colors.primary}ba`,
  `${theme.colors.primary}99`,
  `${theme.colors.primary}70`,
];

const getOptions = (theme: ThemeType, isRTL: boolean): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
      rtl: isRTL,
    },
    tooltip: {
      enabled: false,
      external: customChartJsTooltip,
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

export const DashboardTopProductsChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const rawProducts = useAppSelector(
    dashboardSliceSelectors.selectDashboardStats,
  );

  const products = [...(rawProducts?.mostSoldProducts || [])].sort(
    (a, b) => b.totalSold - a.totalSold,
  );

  const data = {
    labels: [...products.map((p) => p.name), ...products.map((p) => p.name)],
    datasets: [
      {
        data: [
          ...products.map((p) => p.totalSold),
          ...products.map((p) => p.totalSold),
        ],
        backgroundColor: getChartColors(theme).slice(0, products.length),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
        productImages: products.map((p) => p.image),
      },
    ],
  };

  return (
    <Container>
      <Header>
        <Text fontWeight="bold" fontSize="subtitle" color="primary">
          {t("dashboard.mostSoldProducts.title")}
        </Text>
      </Header>

      <ChartCanvasWrapper>
        <Bar
          options={getOptions(theme, i18n.dir(i18n.language) === "rtl")}
          data={data}
        />
      </ChartCanvasWrapper>
    </Container>
  );
};
