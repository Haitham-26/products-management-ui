import type React from "react";
import styled, { useTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
  type ChartOptions,
} from "chart.js";
import { useAppSelector } from "../../../redux/store";
import type { ThemeType } from "../../../theme/theme";
import dashboardSliceSelectors from "../../../redux/dashboard/dashboard.selector";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getOptions = (theme: ThemeType) =>
  ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: theme.colors.surface,
        titleColor: theme.colors.textPrimary,
        bodyColor: theme.colors.textPrimary,
        borderColor: theme.colors.border,
        borderWidth: 1,
        padding: 12,
        cornerRadius: 8,
        displayColors: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: theme.colors.textSecondary,
          font: {
            family: "inherit",
            size: 11,
          },
          callback: function (value, index) {
            const label = this.getLabelForValue(index as number);
            return label.length > 12 ? `${label.substring(0, 10)}...` : label;
          },
        },
      },
      y: {
        grid: {
          color: `${theme.colors.border}20`,
        },
        border: {
          dash: [4, 4],
        },
        ticks: {
          color: theme.colors.textSecondary,
          font: {
            family: "inherit",
            size: 11,
          },
        },
      },
    },
  }) as ChartOptions<"bar">;

const getChartColors = (theme: ThemeType) => [
  theme.colors.primary,
  `${theme.colors.primary}dd`,
  `${theme.colors.primary}ba`,
  `${theme.colors.primary}99`,
  `${theme.colors.primary}70`,
];

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
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.md};
`;

const ChartCanvasWrapper = styled.div`
  flex-grow: 1;
  width: 100%;
  position: relative;
  min-height: 16rem;
`;

export const DashboardTopProductsCard: React.FC = () => {
  const theme = useTheme();

  const rawProducts = useAppSelector(
    dashboardSliceSelectors.selectDashboardStats,
  );

  const products = [...(rawProducts?.mostSoldProducts || [])].sort(
    (a, b) => b.totalSold - a.totalSold,
  );

  const labels = products?.map((product) => product.name);

  const data = {
    labels,
    datasets: [
      {
        data: products?.map((product) => product.totalSold),
        backgroundColor: getChartColors(theme).slice(0, products?.length),
        borderRadius: 6,
        borderSkipped: false,
        maxBarThickness: 32,
      },
    ],
  };

  return (
    <Container>
      <Header>
        <Text fontWeight="bold" fontSize="subtitle">
          Most Sold Products
        </Text>
      </Header>

      <ChartCanvasWrapper>
        <Bar options={getOptions(theme)} data={data} />
      </ChartCanvasWrapper>
    </Container>
  );
};
