import React, {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { createOrdersTableColumns } from "./components/createOrdersTableColumns";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import { OrdersFilters } from "./components/OrdersFilters";
import { PageHeader } from "../../components/PageHeader";
import { orderActions } from "../../redux/order/orders.slice";
import type { GetOrdersDto } from "../../model/order/dto/GetOrdersDto";
import type { Order } from "../../model/order/types/Order";
import orderSliceSelectors from "../../redux/order/orders.selector";
import {
  buildOrdersParams,
  countOrdersActiveFilters,
  parseOrdersFiltersFromParams,
} from "./utils/orderUtils";
import { OrderCreateDrawer } from "./components/OrderCreateDrawer";
import { OrderUpdateDrawer } from "./components/OrderUpdateDrawer";
import { OrderReadDrawer } from "./components/OrderReadDrawer";
import { OrderManageStatusModal } from "./components/OrderManageStatusModal";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { OrderToggleArchiveModal } from "./components/OrderToggleArchiveModal";
import settingsSliceSelectors from "../../redux/settings/settings.selector";
import { settingsActions } from "../../redux/settings/settings.slice";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";

const StyledContainer = styled(Container)`
  overflow: hidden;

  .pending-status {
    background-color: ${({ theme }) => theme.colors.pending} !important;
  }
  .confirmed-status {
    background-color: ${({ theme }) => theme.colors.confirmed} !important;
    color: ${({ theme }) => theme.colors.surface};
  }
  .cancelled-status {
    background-color: ${({ theme }) => theme.colors.cancelled} !important;
    color: ${({ theme }) => theme.colors.surface};
  }

  .archived {
    background-color: ${({ theme }) => theme.colors.cancelled} !important;
    color: ${({ theme }) => theme.colors.surface};
    opacity: 0.8;
  }
  .visible {
    background-color: ${({ theme }) => theme.colors.confirmed} !important;
    color: ${({ theme }) => theme.colors.surface};
  }
`;

export const Orders: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [orderEditVisible, setOrderEditVisible] = useState(false);
  const [orderReadVisible, setOrderReadVisible] = useState(false);
  const [orderCreateVisible, setOrderCreateVisible] = useState(false);
  const [orderManageStatusVisible, setOrderManageStatusVisible] =
    useState(false);
  const [orderToggleArchiveVisible, setOrderToggleArchiveVisible] =
    useState(false);

  const dispatch = useAppDispatch();

  const orders = useAppSelector(orderSliceSelectors.selectOrders);
  const ordersLoading = useAppSelector(orderSliceSelectors.selectOrdersLoading);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const user = useAppSelector(userSliceSelectors.selectUser)!;

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((nextParams) => {
        setSearchParams(nextParams, { replace: true });
      }, 800),
    [setSearchParams],
  );

  const permissions = checkPermissions(user, "orders");

  const handlePageChange = (page: number, pageSize: number) => {
    const newFilters = {
      ...filters,
      meta: {
        ...filters.meta,
        page,
        limit: pageSize,
      },
    };

    setSearchParams(buildOrdersParams(newFilters, searchParams), {
      replace: true,
    });
    debouncedSetSearchParams(newFilters);
  };

  const applyFilter = useCallback(
    (
      key: keyof GetOrdersDto,
      value: GetOrdersDto[keyof GetOrdersDto],
      debounce?: boolean,
    ) => {
      const newFilters = {
        ...filters,
        meta: {
          ...(filters?.meta || {}),
          page: key === "keyword" ? 0 : filters?.meta?.page || 0,
        },
        [key]: value,
      };

      const nextParams = buildOrdersParams(newFilters, searchParams);

      if (debounce) {
        debouncedSetSearchParams(nextParams);
      } else {
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countOrdersActiveFilters(filters);

  const onEdit = (order: Order) => {
    setCurrentOrder(order);
    setOrderEditVisible(true);
  };

  const onRead = (order: Order) => {
    setCurrentOrder(order);
    setOrderReadVisible(true);
  };

  const onManageStatus = (order: Order) => {
    setCurrentOrder(order);
    setOrderManageStatusVisible(true);
  };

  const onToggleArchive = (order: Order) => {
    setCurrentOrder(order);
    setOrderToggleArchiveVisible(true);
  };

  const tableColumns = useMemo(
    () =>
      createOrdersTableColumns({
        functions: {
          onEdit: permissions.UPDATE ? onEdit : undefined,
          onRead: permissions.READ ? onRead : undefined,
          onManageStatus: permissions.UPDATE ? onManageStatus : undefined,
          onToggleArchive: permissions.UPDATE ? onToggleArchive : undefined,
        },
        currency: settings.currency,
      }),
    [settings.currency, permissions],
  );

  useEffect(() => {
    dispatch(
      orderActions.getOrders({
        ...filters,
        userId,
      }),
    );
    dispatch(settingsActions.getSettings({ userId }));

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={faCartShopping}
        title="Orders"
        {...(permissions.CREATE
          ? {
              action: {
                title: "New Order",
                icon: faPlus,
                onClick: () => setOrderCreateVisible(true),
              },
            }
          : {})}
        {...(permissions.READ
          ? {
              filters: {
                activeCount: activeFiltersCount,
                content: (
                  <OrdersFilters
                    activeFiltersCount={activeFiltersCount}
                    filters={filters}
                    applyFilter={applyFilter}
                  />
                ),
              },
              search: {
                placeholder: "Search by customer's info ot ID...",
                onChange: (searchKeyword) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
      />

      {permissions.READ ? (
        <Table
          loading={ordersLoading}
          columns={tableColumns}
          dataSource={orders}
          pagination={{
            current: ordersMeta?.page || 1,
            pageSize: ordersMeta?.limit || 10,
            total: ordersMeta?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
            showTotal: (total) => `Total ${total} orders`,
          }}
        />
      ) : (
        <NoPermissions />
      )}

      {permissions.CREATE ? (
        <OrderCreateDrawer
          open={orderCreateVisible}
          onClose={() => setOrderCreateVisible(false)}
          filters={filters}
        />
      ) : null}

      {permissions.READ ? (
        <OrderReadDrawer
          open={orderReadVisible}
          onClose={() => setOrderReadVisible(false)}
          order={currentOrder}
        />
      ) : null}

      {permissions.UPDATE ? (
        <Fragment>
          <OrderUpdateDrawer
            open={orderEditVisible}
            onClose={() => setOrderEditVisible(false)}
            order={currentOrder}
            filters={filters}
          />

          <OrderManageStatusModal
            open={orderManageStatusVisible}
            onClose={() => setOrderManageStatusVisible(false)}
            order={currentOrder}
            filters={filters}
          />

          <OrderToggleArchiveModal
            open={orderToggleArchiveVisible}
            onClose={() => setOrderToggleArchiveVisible(false)}
            order={currentOrder}
            filters={filters}
          />
        </Fragment>
      ) : null}
    </StyledContainer>
  );
};
