import type React from "react";
import styled, { useTheme } from "styled-components";
import { Text } from "../../../components/Text";
import { Pie } from "react-chartjs-2";
import type { ChartOptions } from "chart.js";
import i18n from "../../../i18n";
import { Breakpoints } from "../../../theme/Breakpoints";
import type { ThemeType } from "../../../theme/theme";
import { useTranslation } from "react-i18next";
import { useNavigate, type NavigateFunction } from "react-router-dom";
import type { TFunction } from "i18next";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";

const getOptions = (
  theme: ThemeType,
  isRTL: boolean,
  navigate: NavigateFunction,
  t: TFunction,
): ChartOptions<"pie"> => ({
  responsive: true,
  onClick: (_, elements, chart) => {
    if (!elements.length) {
      return;
    }

    const index = elements[0].index;
    const label = chart.data.labels?.[index] as string;

    switch (label) {
      case t("orders.status.pending"):
        navigate(`/orders?status=${OrderStatus.PENDING}`);
        break;

      case t("orders.status.delivered"):
        navigate(`/orders?status=${OrderStatus.DELIVERED}`);
        break;

      case t("orders.status.canceled"):
        navigate(`/orders?status=${OrderStatus.CANCELED}`);
        break;
    }
  },
  onHover: (event, elements) => {
    const canvas = event.native?.target as HTMLCanvasElement;

    if (canvas) {
      canvas.style.cursor = elements.length ? "pointer" : "default";
    }
  },
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "top",
      rtl: isRTL,
      labels: {
        color: theme.colors.textPrimary,
        usePointStyle: true,
        pointStyle: "circle",
        padding: 20,
      },
    },
    tooltip: {
      enabled: true,
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

export const DashboardOrdersChart: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const data = {
    labels: [
      t("orders.status.pending"),
      t("orders.status.canceled"),
      t("orders.status.delivered"),
    ],
    datasets: [
      {
        data: [12, 18, 43],
        backgroundColor: [
          theme.colors.warning,
          theme.colors.error,
          theme.colors.success,
        ],
        borderColor: theme.colors.surface,
        borderWidth: 2,
      },
    ],
  };
  return (
    <Container>
      <Text color="primary" fontWeight={"bold"} fontSize="subtitle">
        {t("dashboard.orderStatus.title")}
      </Text>

      <ChartCanvasWrapper>
        <Pie
          data={data}
          options={getOptions(
            theme,
            i18n.dir(i18n.language) === "rtl",
            navigate,
            t,
          )}
        />
      </ChartCanvasWrapper>
    </Container>
  );
};
