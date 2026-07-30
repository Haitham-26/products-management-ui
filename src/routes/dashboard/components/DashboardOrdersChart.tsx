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
import { useAppSelector } from "../../../redux/store";
import dashboardSliceSelectors from "../../../redux/dashboard/dashboard.selector";
import { Tag } from "antd";
import camelCase from "lodash/camelCase";
import { useMemo } from "react";
import { Empty } from "../../../components/Empty";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { Icon } from "../../../components/Icon";

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
      case t("orders.status.returned"):
        navigate(`/orders?status=${OrderStatus.RETURNED}`);
        break;
      case t("orders.status.partiallyReturned"):
        navigate(`/orders?status=${OrderStatus.PARTIALLY_RETURNED}`);
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
  min-height: 10rem;

  canvas {
    max-width: 100% !important;
  }

  @media (min-width: ${Breakpoints.MD}) {
    min-height: 16rem;
  }
`;

const Title = styled(Text)`
  color: ${({ theme }) => theme.colors.primary};
  font-weight: bold;
  font-size: ${({ theme }) => theme.typography.subtitle};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};
`;

const StyledTag = styled(Tag)`
  font-size: calc(${({ theme }) => theme.typography.small} * 0.75);
  font-weight: 500;
`;

const StyledEmpty = styled(Empty)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;

  .ant-empty-image {
    height: fit-content;
  }

  svg {
    font-size: ${({ theme }) => theme.typography.title};
    color: ${({ theme }) => theme.colors.textSecondary}99;
  }
`;

export const DashboardOrdersChart: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { ordersCountByStatus } = useAppSelector(
    dashboardSliceSelectors.selectDashboardStats,
  );

  const orderedStatuses = useMemo(
    () => [
      OrderStatus.PENDING,
      OrderStatus.CANCELED,
      OrderStatus.DELIVERED,
      OrderStatus.RETURNED,
      OrderStatus.PARTIALLY_RETURNED,
    ],
    [],
  );

  const totalOrders = useMemo(
    () =>
      orderedStatuses.reduce(
        (total, status) =>
          total +
          (ordersCountByStatus[
            camelCase(status) as keyof typeof ordersCountByStatus
          ] ?? 0),
        0,
      ),
    [ordersCountByStatus, orderedStatuses],
  );

  const data = {
    labels: orderedStatuses.map((s) => t(`orders.status.${camelCase(s)}`)),
    datasets: [
      {
        data: orderedStatuses.map(
          (s) =>
            ordersCountByStatus[
              camelCase(s) as keyof typeof ordersCountByStatus
            ],
        ),
        backgroundColor: orderedStatuses.map(
          (s) => theme.colors[camelCase(s) as keyof ThemeType["colors"]],
        ),
        borderColor: theme.colors.surface,
        borderWidth: 2,
      },
    ],
  };

  return (
    <Container>
      <Title>
        <span>{t("dashboard.orderStatus.title")}</span>

        <StyledTag color={"blue"}>{t(`common.allTime`)}</StyledTag>
      </Title>

      <ChartCanvasWrapper>
        {totalOrders ? (
          <Pie
            data={data}
            options={getOptions(
              theme,
              i18n.dir(i18n.language) === "rtl",
              navigate,
              t,
            )}
          />
        ) : (
          <StyledEmpty
            description={t("dashboard.orderStatus.emptyText")}
            image={<Icon icon={faBoxOpen} />}
          />
        )}
      </ChartCanvasWrapper>
    </Container>
  );
};
