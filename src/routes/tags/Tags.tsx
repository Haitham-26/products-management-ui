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
import { TagCreateDrawer } from "./components/TagCreateDrawer";
import { TagUpdateDrawer } from "./components/TagUpdateDrawer";
import { createTagsTableColumns } from "./components/createTagsTableColumns";
import type { Tag } from "../../model/tag/types/Tag";
import { tagActions } from "../../redux/tag/tags.slice";
import { TagReadDrawer } from "./components/TagReadDrawer";
import tagSliceSelectors from "../../redux/tag/tags.selector";
import type { GetTagsDto } from "../../model/tag/dto/GetTagsDto";
import { useSearchParams } from "react-router-dom";
import {
  buildTagsParams,
  countTagsActiveFilters,
  parseTagsFiltersFromParams,
} from "./utils/tagUtils";
import debounce from "lodash/debounce";
import { PageHeader } from "../../components/PageHeader";
import { TagsFilters } from "./components/TagsFilters";
import { checkPermissions } from "../../utils/checkPermissions";
import { NoPermissions } from "../../components/NoPermissions";
import type { Key } from "antd/es/table/interface";
import { Button } from "../../components/Button";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { appRoutes } from "../../utils/appRoutes";
import { useTranslation } from "react-i18next";
import { useAppToast } from "../../components/toast/useAppToast";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

const BulkActionsWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.md};

  button {
    height: auto;
  }
`;

export const Tags: React.FC = () => {
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);

  const [selectedRowIds, setSelectedRowIds] = useState<Key[]>([]);

  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDeleteVisible, setTagDeleteVisible] = useState(false);
  const [tagReadVisible, setTagReadVisible] = useState(false);
  const [tagCreateVisible, setTagCreateVisible] = useState(false);

  const [tagDeleteLoading, setTagDeleteLoading] = useState(false);
  const [tagsBulkDeleteLoading, setTagsBulkDeleteLoading] = useState(false);
  const [tagsBulkDeleteVisible, setTagsBulkDeleteVisible] = useState(false);

  const Toast = useAppToast();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();

  const user = useAppSelector(userSliceSelectors.selectUser)!;
  const tags = useAppSelector(tagSliceSelectors.selectTags);
  const tagsLoading = useAppSelector(tagSliceSelectors.selectTagsLoading);
  const userId = useAppSelector(userSliceSelectors.selectUserId)!;
  const tagsMeta = useAppSelector(tagSliceSelectors.selectTagsMeta);

  const [searchParams, setSearchParams] = useSearchParams();

  const filters = useMemo(
    () => parseTagsFiltersFromParams(searchParams, tagsMeta),
    [searchParams, tagsMeta],
  );

  const debouncedSetSearchParams = useMemo(
    () =>
      debounce((nextParams) => {
        setSearchParams(nextParams, { replace: true });
      }, 800),
    [setSearchParams],
  );

  const permissions = checkPermissions(user, "tags");

  const handlePageChange = (page: number, pageSize: number) => {
    const newFilters = {
      ...filters,
      meta: {
        ...filters.meta,
        page,
        limit: pageSize,
      },
    };

    setSearchParams(buildTagsParams(newFilters, searchParams), {
      replace: true,
    });
    debouncedSetSearchParams(newFilters);
  };

  const applyFilter = useCallback(
    (
      key: keyof GetTagsDto,
      value: GetTagsDto[keyof GetTagsDto],
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

      const nextParams = buildTagsParams(newFilters, searchParams);

      if (debounce) {
        debouncedSetSearchParams(nextParams);
      } else {
        setSearchParams(nextParams, { replace: true });
      }
    },
    [filters, searchParams, setSearchParams, debouncedSetSearchParams],
  );

  const activeFiltersCount = countTagsActiveFilters(filters);

  const onDelete = (tag: Tag) => {
    setCurrentTag(tag);
    setTagDeleteVisible(true);
  };

  const onEdit = (tag: Tag) => {
    setCurrentTag(tag);
    setTagEditVisible(true);
  };

  const onRead = (tag: Tag) => {
    setCurrentTag(tag);
    setTagReadVisible(true);
  };

  const deleteTag = async () => {
    if (!currentTag) {
      return;
    }

    try {
      setTagDeleteLoading(true);

      const meta = tagsMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - 1;

      await dispatch(
        tagActions.deleteTag({
          tagId: currentTag?._id,
          userId,
        }),
      ).unwrap();

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      setSearchParams(
        buildTagsParams(
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

      setTagDeleteVisible(false);
      setCurrentTag(null);

      Toast.success(t("tags.delete.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setTagDeleteLoading(false);
    }
  };

  const deleteBulkTags = async () => {
    if (!selectedRowIds.length) {
      return;
    }

    try {
      setTagsBulkDeleteLoading(true);

      const meta = tagsMeta;
      const currentPage = meta?.page || 1;
      const limit = meta?.limit || 10;
      const total = (meta?.total || 1) - selectedRowIds.length;

      await dispatch(
        tagActions.deleteBulkTags({
          tagIds: selectedRowIds.map((id) => id.toString()),
          userId,
        }),
      ).unwrap();

      const totalPages = Math.ceil(total / limit);

      const newPage = currentPage > totalPages ? totalPages : currentPage;

      setSearchParams(
        buildTagsParams(
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

      setTagsBulkDeleteVisible(false);
      setSelectedRowIds([]);

      Toast.success(t("tags.bulkDelete.success"));
    } catch (e) {
      console.log(e);
      Toast.apiError(e);
    } finally {
      setTagsBulkDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createTagsTableColumns({
        onDelete: permissions.DELETE ? onDelete : undefined,
        onEdit: permissions.UPDATE ? onEdit : undefined,
        onRead: permissions.READ ? onRead : undefined,
        t,
      }),
    [permissions, t],
  );

  useEffect(() => {
    dispatch(
      tagActions.getTags({
        ...filters,
        userId,
      } as GetTagsDto),
    );

    return () => debouncedSetSearchParams.cancel();
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <StyledContainer>
      <PageHeader
        icon={appRoutes.tags.icon}
        title={t(appRoutes.tags.titleKey)}
        {...(permissions.CREATE
          ? {
              action: {
                title: t("tags.subheader.action"),
                icon: faPlus,
                onClick: () => setTagCreateVisible(true),
              },
            }
          : {})}
        {...(permissions.READ
          ? {
              filters: {
                activeCount: activeFiltersCount,
                content: (
                  <TagsFilters
                    filters={filters}
                    activeFiltersCount={activeFiltersCount}
                    applyFilter={applyFilter}
                  />
                ),
              },
              search: {
                placeholder: t("tags.subheader.inputPlaceholder"),
                onChange: (searchKeyword) =>
                  applyFilter("keyword", searchKeyword, true),
              },
            }
          : {})}
        bulkActionsContent={
          selectedRowIds.length ? (
            <BulkActionsWrapper>
              {permissions.DELETE ? (
                <Button
                  onClick={() => setTagsBulkDeleteVisible(true)}
                  icon={faTrash}
                  variant="secondary"
                >
                  {t("common.delete")}
                </Button>
              ) : null}
            </BulkActionsWrapper>
          ) : null
        }
        selectedTableItemsCount={selectedRowIds.length}
      />

      {permissions.READ ? (
        <Table
          loading={tagsLoading}
          columns={tableColumns}
          dataSource={tags}
          pagination={{
            current: tagsMeta?.page || 1,
            pageSize: tagsMeta?.limit || 10,
            total: tagsMeta?.total || 0,
            onChange: handlePageChange,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50", "100"],
            position: ["bottomRight"],
          }}
          rowSelection={{
            selectedRowKeys: selectedRowIds,
            onChange(newSelectedRowKeys) {
              setSelectedRowIds(newSelectedRowKeys);
            },
          }}
        />
      ) : (
        <NoPermissions />
      )}

      {permissions.DELETE ? (
        <Fragment>
          <WarningModal
            title={t("tags.delete.title", { name: currentTag?.name })}
            description={t("tags.delete.description")}
            open={tagDeleteVisible}
            onClose={() => setTagDeleteVisible(false)}
            onConfirm={deleteTag}
            confirmText={t("common.delete")}
            confirmLoading={tagDeleteLoading}
          />

          <WarningModal
            title={t("tags.bulkDelete.title", { count: selectedRowIds.length })}
            description={t("tags.bulkDelete.description")}
            open={tagsBulkDeleteVisible}
            onClose={() => setTagsBulkDeleteVisible(false)}
            onConfirm={deleteBulkTags}
            confirmText={t("common.delete")}
            confirmLoading={tagsBulkDeleteLoading}
          />
        </Fragment>
      ) : null}

      {permissions.CREATE ? (
        <TagCreateDrawer
          open={tagCreateVisible}
          onClose={() => setTagCreateVisible(false)}
          filters={filters}
        />
      ) : null}

      {permissions.UPDATE ? (
        <TagUpdateDrawer
          open={tagEditVisible}
          onClose={() => setTagEditVisible(false)}
          tag={currentTag}
          filters={filters}
        />
      ) : null}

      {permissions.READ ? (
        <TagReadDrawer
          open={tagReadVisible}
          onClose={() => setTagReadVisible(false)}
          tag={currentTag}
        />
      ) : null}
    </StyledContainer>
  );
};
