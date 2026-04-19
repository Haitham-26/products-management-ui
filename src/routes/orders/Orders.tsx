import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { WarningModal } from "../../components/WarningModal";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { createOrdersTableColumns } from "./components/createOrdersTableColumns";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { OrdersFilter } from "./components/OrdersFilter";
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
import { productActions } from "../../redux/product/products.slice";
import type { GetProductsDto } from "../../model/product/dto/GetProductsDto";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

export const Orders: React.FC = () => {
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const [orderEditVisible, setOrderEditVisible] = useState(false);
  const [orderDeleteVisible, setOrderDeleteVisible] = useState(false);
  const [orderReadVisible, setOrderReadVisible] = useState(false);
  const [orderCreateVisible, setOrderCreateVisible] = useState(false);
  const [orderDeleteLoading, setOrderDeleteLoading] = useState(false);

  const dispatch = useAppDispatch();

  const orders = useAppSelector(orderSliceSelectors.selectOrders);
  const ordersLoading = useAppSelector(orderSliceSelectors.selectOrdersLoading);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);

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
    (key: keyof GetOrdersDto, value: unknown) => {
      const newFilters = {
        ...filters,
        meta: {
          ...(filters?.meta || {}),
          page: key === "keyword" ? 0 : filters?.meta?.page || 0,
        },
        [key]: value,
      };

      const nextParams = buildOrdersParams(newFilters, searchParams);

      if (key === "keyword") {
        debouncedSetSearchParams(nextParams);
      } else {
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countOrdersActiveFilters(filters);

  const onDelete = (order: Order) => {
    setCurrentOrder(order);
    setOrderDeleteVisible(true);
  };

  const onEdit = (order: Order) => {
    setCurrentOrder(order);
    setOrderEditVisible(true);
  };

  const onRead = (order: Order) => {
    setCurrentOrder(order);
    setOrderReadVisible(true);
  };

  const deleteOrder = async () => {
    if (!currentOrder) {
      return;
    }

    try {
      setOrderDeleteLoading(true);

      const meta = ordersMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - 1;

      await dispatch(
        orderActions.deleteOrder({
          orderId: currentOrder?._id,
          userId,
        }),
      ).unwrap();

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

      setOrderDeleteVisible(false);
      setCurrentOrder(null);
    } catch (e) {
      console.log(e);
    } finally {
      setOrderDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createOrdersTableColumns({
        onDelete,
        onEdit,
        onRead,
      }),
    [],
  );

  useEffect(() => {
    dispatch(
      orderActions.getOrders({
        ...filters,
        userId,
      } as GetOrdersDto),
    );
    dispatch(productActions.getProducts({ userId } as GetProductsDto));

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={faFolder}
        title="Orders"
        action={{
          title: "New Order",
          icon: faPlus,
          onClick: () => setOrderCreateVisible(true),
        }}
        filters={{
          activeCount: activeFiltersCount,
          content: <OrdersFilter />,
        }}
        search={{
          placeholder: "Search by ID...",
          onChange: (searchKeyword) => applyFilter("keyword", searchKeyword),
        }}
      />

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
          pageSizeOptions: ["2", "10", "20", "50", "100"],
          position: ["bottomRight"],
          showTotal: (total) => `Total ${total} orders`,
        }}
      />

      <WarningModal
        title={`Delete "${currentOrder?._id}" order?`}
        description={`Are you sure you want to delete "${currentOrder?._id}" order? Once you confirm, you cannot undo it later.`}
        open={orderDeleteVisible}
        onClose={() => setOrderDeleteVisible(false)}
        onConfirm={deleteOrder}
        confirmText="Delete"
        cancelText="Cancel"
        confirmLoading={orderDeleteLoading}
      />

      <OrderCreateDrawer
        open={orderCreateVisible}
        onClose={() => setOrderCreateVisible(false)}
      />

      <OrderUpdateDrawer
        open={orderEditVisible}
        onClose={() => setOrderEditVisible(false)}
        order={currentOrder}
      />

      <OrderReadDrawer
        open={orderReadVisible}
        onClose={() => setOrderReadVisible(false)}
        order={currentOrder}
      />
    </StyledContainer>
  );
};
