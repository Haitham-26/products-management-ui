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
import { OrderToggleArchiveModal } from "./components/OrderToggleArchiveModal";
import settingsSliceSelectors from "../../redux/settings/settings.selector";
import { settingsActions } from "../../redux/settings/settings.slice";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import type { Key } from "antd/es/table/interface";
import { WarningModal } from "../../components/WarningModal";
import { Button } from "../../components/Button";
import { faBoxOpen } from "@fortawesome/free-solid-svg-icons/faBoxOpen";
import { faBoxArchive } from "@fortawesome/free-solid-svg-icons/faBoxArchive";
import { OrderVisibility } from "../../model/order/types/OrderVisibility.enum";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";
import { OrderBulkManageStatusModal } from "./components/OrderBulkManageStatusModal";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const StyledContainer = styled(Container)`
  overflow: hidden;

  .pending-status {
    background-color: ${({ theme }) => theme.colors.pending} !important;
  }
  .delivered-status {
    background-color: ${({ theme }) => theme.colors.delivered} !important;
    color: ${({ theme }) => theme.colors.surface};
  }
  .canceled-status {
    background-color: ${({ theme }) => theme.colors.canceled} !important;
    color: ${({ theme }) => theme.colors.surface};
  }

  .archived {
    background-color: ${({ theme }) => theme.colors.canceled} !important;
    color: ${({ theme }) => theme.colors.surface};
    opacity: 0.8;
  }
  .visible {
    background-color: ${({ theme }) => theme.colors.delivered} !important;
    color: ${({ theme }) => theme.colors.surface};
  }

  .negative-profit,
  .positive-profit {
    font-weight: 700;
    direction: ltr;
    text-align: -webkit-match-parent;
  }
  .negative-profit {
    color: ${({ theme }) => theme.colors.error};
  }
  .positive-profit {
    color: ${({ theme }) => theme.colors.success};
  }
`;

const BulkActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.sm};

  button {
    height: auto;
  }
`;

export const Orders: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<Key[]>([]);

  const [orderEditVisible, setOrderEditVisible] = useState(false);
  const [orderReadVisible, setOrderReadVisible] = useState(false);
  const [orderCreateVisible, setOrderCreateVisible] = useState(false);
  const [orderManageStatusVisible, setOrderManageStatusVisible] =
    useState(false);
  const [orderToggleArchiveVisible, setOrderToggleArchiveVisible] =
    useState(false);

  const [ordersBulkManageStatusVisible, setOrdersBulkManageStatusVisible] =
    useState(false);

  const [ordersBulkToggleArchiveLoading, setOrdersBulkToggleArchiveLoading] =
    useState(false);
  const [ordersBulkArchiveVisible, setOrdersBulkArchiveVisible] =
    useState(false);
  const [ordersBulkUnarchiveVisible, setOrdersBulkUnarchiveVisible] =
    useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const orders = useAppSelector(orderSliceSelectors.selectOrders);
  const ordersLoading = useAppSelector(orderSliceSelectors.selectOrdersLoading);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);
  const user = useAppSelector(userSliceSelectors.selectUser)!;

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
          t,
        },
        currency: settings.currency,
      }),
    [settings.currency, permissions, t],
  );

  const fetchOrders = async (removedItemsCount: number = 0) => {
    try {
      const meta = ordersMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - removedItemsCount;

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      setSearchParams(
        buildOrdersParams(
          {
            ...filters,
            meta: {
              ...(filters?.meta || {}),
              page: newPage,
            },
          },
          searchParams,
        ),
        {
          replace: true,
        },
      );
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    }
  };

  const bulkManageOrderVisibility = async (visibility: OrderVisibility) => {
    try {
      setOrdersBulkToggleArchiveLoading(true);

      await dispatch(
        orderActions.bulkManageOrderVisibility({
          orderIds: selectedRowIds.map((id) => id.toString()),
          visibility,
          userId,
        }),
      ).unwrap();

      const nonArchivedCount = selectedRowIds.filter((id) =>
        orders.find((p) => p._id === id && p.isArchived !== true),
      ).length;

      await fetchOrders(
        !filters.showArchived && visibility === OrderVisibility.ARCHIVED
          ? nonArchivedCount
          : 0,
      );

      if (visibility === OrderVisibility.ACTIVE) {
        setOrdersBulkUnarchiveVisible(false);
      } else {
        setOrdersBulkArchiveVisible(false);
      }
      setSelectedRowIds([]);

      Toast.success(
        t(
          `orders.${visibility === OrderVisibility.ACTIVE ? "bulkUnarchive" : "bulkArchive"}.success`,
        ),
      );
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setOrdersBulkToggleArchiveLoading(false);
    }
  };

  useEffect(() => {
    dispatch(
      orderActions.getOrders({
        ...filters,
        userId,
      }),
    );
    dispatch(settingsActions.getSettings());

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={appRoutes.orders.icon}
        title={t(appRoutes.orders.titleKey)}
        {...(permissions.CREATE
          ? {
              action: {
                title: t("orders.subheader.action"),
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
                placeholder: t("orders.subheader.inputPlaceholder"),
                onChange: (searchKeyword) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
        bulkActionsContent={
          selectedRowIds.length ? (
            <BulkActionsWrapper>
              {permissions.UPDATE ? (
                <Fragment>
                  <Button
                    onClick={() => setOrdersBulkArchiveVisible(true)}
                    icon={faBoxArchive}
                    variant="secondary"
                  >
                    {t("orders.actions.archive")}
                  </Button>

                  <Button
                    onClick={() => setOrdersBulkUnarchiveVisible(true)}
                    icon={faBoxOpen}
                    variant="secondary"
                  >
                    {t("orders.actions.unarchive")}
                  </Button>

                  <Button
                    onClick={() => setOrdersBulkManageStatusVisible(true)}
                    icon={faGear}
                    variant="secondary"
                  >
                    {t("orders.actions.manageStatus")}
                  </Button>
                </Fragment>
              ) : null}
            </BulkActionsWrapper>
          ) : null
        }
        selectedTableItemsCount={selectedRowIds.length}
      />

      {permissions.READ ? (
        <Table
          loading={ordersLoading}
          columns={tableColumns}
          dataSource={orders}
          rowSelection={{
            selectedRowKeys: selectedRowIds,
            onChange(newSelectedRowKeys) {
              setSelectedRowIds(newSelectedRowKeys);
            },
          }}
          pagination={{
            current: ordersMeta?.page || 1,
            pageSize: ordersMeta?.limit || 10,
            total: ordersMeta?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            placement: ["bottomEnd"],
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
            fetchOrders={fetchOrders}
            filters={filters}
          />

          <WarningModal
            title={t("orders.bulkArchive.title", {
              count: selectedRowIds.length,
            })}
            description={t("orders.bulkArchive.description")}
            open={ordersBulkArchiveVisible}
            onClose={() => setOrdersBulkArchiveVisible(false)}
            confirmLoading={ordersBulkToggleArchiveLoading}
            onConfirm={() =>
              bulkManageOrderVisibility(OrderVisibility.ARCHIVED)
            }
          />

          <WarningModal
            title={t("orders.bulkUnarchive.title", {
              count: selectedRowIds.length,
            })}
            description={t("orders.bulkUnarchive.description")}
            open={ordersBulkUnarchiveVisible}
            onClose={() => setOrdersBulkUnarchiveVisible(false)}
            confirmLoading={ordersBulkToggleArchiveLoading}
            onConfirm={() => bulkManageOrderVisibility(OrderVisibility.ACTIVE)}
          />

          <OrderBulkManageStatusModal
            open={ordersBulkManageStatusVisible}
            onClose={() => setOrdersBulkManageStatusVisible(false)}
            orderIds={selectedRowIds}
            filters={filters}
            setSelctedRowIds={setSelectedRowIds}
          />
        </Fragment>
      ) : null}
    </StyledContainer>
  );
};
