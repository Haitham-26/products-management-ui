import type React from "react";
import styled, { useTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Bar } from "react-chartjs-2";
import type { ThemeType } from "../../../theme/theme";
import type { ChartOptions } from "chart.js";
import i18n from "../../../i18n";
import { Breakpoints } from "../../../theme/Breakpoints";
import { useTranslation } from "react-i18next";

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

export const DashboardRevenueAndProfitChart: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();

  const data = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: t("dashboard.salesProfits.revenues"),
        data: [10, 20, 30, 40, 50, 60, 70],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
        backgroundColor: theme.colors.primary,
      },
      {
        label: t("dashboard.salesProfits.profits"),
        data: [20, 5, 45, 30, 10, 40, 50],
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
        backgroundColor: theme.colors.success,
      },
    ],
  };

  return (
    <Container>
      <Text color="primary" fontWeight={"bold"} fontSize="subtitle">
        {t("dashboard.salesProfits.title")}
      </Text>

      <ChartCanvasWrapper>
        <Bar
          data={data}
          options={getOptions(theme, i18n.dir(i18n.language) === "rtl")}
        />
      </ChartCanvasWrapper>
    </Container>
  );
};
