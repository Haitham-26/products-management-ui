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
import { WarningModal } from "../../components/WarningModal";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { createReturnsTableColumns } from "./components/createReturnsTableColumns";
import { useSearchParams } from "react-router-dom";
import debounce from "lodash/debounce";
import { PageHeader } from "../../components/PageHeader";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import { appRoutes } from "../../utils/appRoutes";
import { Trans, useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";
import { Grid } from "antd";
import { PaginatedDataCards } from "../../components/PaginatedDataCards";
import { Breakpoints } from "../../theme/Breakpoints";
import settingsSliceSelectors from "../../redux/settings/settings.selector";
import {
  buildReturnsParams,
  countReturnsActiveFilters,
  parseReturnsFiltersFromParams,
} from "./utils/returnUtils";
import returnSliceSelectors from "../../redux/return/returns.selector";
import type { GetReturnsDto } from "../../model/return/dto/GetReturnsDto";
import type { Return } from "../../model/return/types/Return";
import { returnActions } from "../../redux/return/returns.slice";
import { ReturnCard } from "./components/ReturnCard";
import { ReturnCreateDrawer } from "./components/ReturnCreateDrawer";
import { ReturnsFilters } from "./components/ReturnsFilters";
import { orderActions } from "../../redux/order/orders.slice";
import { OrderStatus } from "../../model/order/types/OrderStatus.enum";
import { ReturnReadDrawer } from "./components/ReturnReadDrawer";
import { ReturnUpdateDrawer } from "./components/ReturnUpdateDrawer";
import { Text } from "../../components/Text";

const StyledContainer = styled(Container)`
  overflow: hidden;

  .active-return,
  .canceled-return {
    color: ${({ theme }) => theme.colors.surface};
  }

  .active-return {
    background-color: ${({ theme }) => theme.colors.delivered} !important;
  }
  .canceled-return {
    background-color: ${({ theme }) => theme.colors.error} !important;
  }

  @media (max-width: ${Breakpoints.MD}) {
    backdrop-filter: none;
    -webkit-backdrop-filter: none;
  }
`;

const WarningModalDescriptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  text-align: start;

  ul {
    list-style-position: inside;
  }
`;

const BoldSpan = styled.span`
  font-weight: bold;
`;

export const Returns: React.FC = () => {
  const [currentReturn, setCurrentReturn] = useState<Return | null>(null);

  const [returnEditVisible, setReturnEditVisible] = useState(false);
  const [returnCancelVisible, setReturnCancelVisible] = useState(false);
  const [returnActivateVisible, setReturnActivateVisible] = useState(false);
  const [returnReadVisible, setReturnReadVisible] = useState(false);
  const [returnCreateVisible, setReturnCreateVisible] = useState(false);

  const [returnCancelLoading, setReturnCancelLoading] = useState(false);
  const [returnActivateLoading, setReturnActivateLoading] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { md } = Grid.useBreakpoint();

  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const returns = useAppSelector(returnSliceSelectors.selectReturns);
  const returnsLoading = useAppSelector(
    returnSliceSelectors.selectReturnsLoading,
  );
  const returnsMeta = useAppSelector(returnSliceSelectors.selectReturnsMeta);
  const settings = useAppSelector(settingsSliceSelectors.selectSettings);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseReturnsFiltersFromParams(searchParams, returnsMeta),
    [searchParams, returnsMeta],
  );

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((nextParams) => {
        setSearchParams(nextParams, { replace: true });
      }, 800),
    [setSearchParams],
  );

  const permissions = checkPermissions(user, "returns");

  const handlePageChange = (page: number, pageSize: number) => {
    const newFilters = {
      ...filters,
      meta: {
        ...filters.meta,
        page,
        limit: pageSize,
      },
    };

    setSearchParams(buildReturnsParams(newFilters, searchParams), {
      replace: true,
    });
    debouncedSetSearchParams(newFilters);
  };

  const sharedPaginationOptions = {
    current: returnsMeta?.page || 1,
    pageSize: returnsMeta?.limit || 10,
    total: returnsMeta?.total || 0,
    onChange: handlePageChange,
    showSizeChanger: true,
    pageSizeOptions: ["10", "20", "50", "100"],
  };

  const applyFilter = useCallback(
    (
      key: keyof GetReturnsDto,
      value: GetReturnsDto[keyof GetReturnsDto],
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

      const nextParams = buildReturnsParams(newFilters, searchParams);

      if (debounce) {
        debouncedSetSearchParams(nextParams);
      } else {
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countReturnsActiveFilters(filters);

  const onCancel = (_return: Return) => {
    setCurrentReturn(_return);
    setReturnCancelVisible(true);
  };

  const onActivate = (_return: Return) => {
    setCurrentReturn(_return);
    setReturnActivateVisible(true);
  };

  const onEdit = (_return: Return) => {
    setCurrentReturn(_return);
    setReturnEditVisible(true);
  };

  const onRead = (_return: Return) => {
    setCurrentReturn(_return);
    setReturnReadVisible(true);
  };

  const tableActions = useMemo(
    () => ({
      onCancel: permissions.UPDATE ? onCancel : undefined,
      onActivate: permissions.UPDATE ? onActivate : undefined,
      onEdit: permissions.UPDATE ? onEdit : undefined,
      onRead: permissions.READ ? onRead : undefined,
    }),
    [permissions.READ, permissions.UPDATE],
  );

  const tableColumns = useMemo(
    () =>
      createReturnsTableColumns({
        functions: { ...tableActions, t },
        settings,
      }),
    [t, tableActions, settings],
  );

  const cancelReturn = async () => {
    if (!currentReturn) {
      return;
    }

    try {
      setReturnCancelLoading(true);

      await dispatch(
        returnActions.cancelReturn({
          returnId: currentReturn._id,
        }),
      ).unwrap();

      setSearchParams(buildReturnsParams(filters, searchParams), {
        replace: true,
      });

      setReturnCancelVisible(false);
      setCurrentReturn(null);

      Toast.success(t("returns.cancel.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setReturnCancelLoading(false);
    }
  };

  const activateReturn = async () => {
    if (!currentReturn) {
      return;
    }

    try {
      setReturnActivateLoading(true);

      await dispatch(
        returnActions.activateReturn({
          returnId: currentReturn._id,
        }),
      ).unwrap();

      setSearchParams(buildReturnsParams(filters, searchParams), {
        replace: true,
      });

      setReturnActivateVisible(false);
      setCurrentReturn(null);

      Toast.success(t("returns.activate.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setReturnActivateLoading(false);
    }
  };

  useEffect(() => {
    dispatch(returnActions.getReturns(filters as GetReturnsDto));
    dispatch(
      orderActions.getOrders({
        meta: { page: 1, limit: 10 },
        status: OrderStatus.DELIVERED,
      }),
    );

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={appRoutes.returns.icon}
        title={t(appRoutes.returns.titleKey)}
        {...(permissions.CREATE
          ? {
              action: {
                title: t("returns.subheader.action"),
                icon: faPlus,
                onClick: () => setReturnCreateVisible(true),
              },
            }
          : {})}
        {...(permissions.READ
          ? {
              filters: {
                activeCount: activeFiltersCount,
                content: (
                  <ReturnsFilters
                    filters={filters}
                    activeFiltersCount={activeFiltersCount}
                    applyFilter={applyFilter}
                  />
                ),
              },
              search: {
                placeholder: t("returns.subheader.inputPlaceholder"),
                onChange: (searchKeyword) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
      />

      {permissions.READ ? (
        md ? (
          <Table
            loading={returnsLoading}
            columns={tableColumns}
            dataSource={returns}
            pagination={{
              ...sharedPaginationOptions,
              placement: ["bottomEnd"],
            }}
          />
        ) : (
          <PaginatedDataCards
            data={returns}
            loading={returnsLoading}
            paginationOptions={sharedPaginationOptions}
            itemRender={(item) => (
              <ReturnCard record={item as Return} actions={tableActions} />
            )}
          />
        )
      ) : (
        <NoPermissions />
      )}

      {permissions.CREATE ? (
        <ReturnCreateDrawer
          open={returnCreateVisible}
          onClose={() => setReturnCreateVisible(false)}
          filters={filters}
        />
      ) : null}

      {permissions.UPDATE ? (
        <Fragment>
          <ReturnUpdateDrawer
            open={returnEditVisible}
            onClose={() => setReturnEditVisible(false)}
            filters={filters}
            returnRecord={currentReturn}
          />

          <WarningModal
            title={t("returns.cancel.title", {
              orderIdentifier: currentReturn?.orderIdentifier,
            })}
            description={
              <WarningModalDescriptionContainer>
                <Text fontSize="small" color="textSecondary">
                  {t("returns.cancel.description.paragraph")}
                </Text>

                <ul>
                  {Array.from({ length: 3 }, (_, index) => (
                    <Text
                      fontSize="small"
                      color="textSecondary"
                      as="li"
                      key={index}
                    >
                      <Trans
                        i18nKey={`returns.cancel.description.listItems.${index}`}
                        components={[<BoldSpan />]}
                      />
                    </Text>
                  ))}
                </ul>
              </WarningModalDescriptionContainer>
            }
            open={returnCancelVisible}
            onClose={() => setReturnCancelVisible(false)}
            confirmLoading={returnCancelLoading}
            onConfirm={cancelReturn}
          />

          <WarningModal
            title={t("returns.activate.title", {
              orderIdentifier: currentReturn?.orderIdentifier,
            })}
            description={
              <WarningModalDescriptionContainer>
                <Text fontSize="small" color="textSecondary">
                  {t("returns.activate.description.paragraph")}
                </Text>

                <ul>
                  {Array.from({ length: 3 }, (_, index) => (
                    <Text
                      fontSize="small"
                      color="textSecondary"
                      as="li"
                      key={index}
                    >
                      <Trans
                        i18nKey={`returns.activate.description.listItems.${index}`}
                        components={[<BoldSpan />]}
                      />
                    </Text>
                  ))}
                </ul>
              </WarningModalDescriptionContainer>
            }
            open={returnActivateVisible}
            onClose={() => setReturnActivateVisible(false)}
            confirmLoading={returnActivateLoading}
            onConfirm={activateReturn}
          />
        </Fragment>
      ) : null}

      <ReturnReadDrawer
        open={returnReadVisible}
        onClose={() => setReturnReadVisible(false)}
        returnRecord={currentReturn}
      />
    </StyledContainer>
  );
};
