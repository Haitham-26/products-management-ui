import React, { useCallback, useEffect, useMemo, useState } from "react";
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
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { TagsFilters } from "./components/TagsFilters";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

export const Tags: React.FC = () => {
  const [currentTag, setCurrentTag] = useState<Tag | null>(null);

  const [tagEditVisible, setTagEditVisible] = useState(false);
  const [tagDeleteVisible, setTagDeleteVisible] = useState(false);
  const [tagReadVisible, setTagReadVisible] = useState(false);
  const [tagCreateVisible, setTagCreateVisible] = useState(false);

  const [tagDeleteLoading, setTagDeleteLoading] = useState(false);

  const dispatch = useAppDispatch();

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

      if (key === "keyword" || debounce) {
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
    } catch (e) {
      console.log(e);
    } finally {
      setTagDeleteLoading(false);
    }
  };

  const tableColumns = useMemo(
    () =>
      createTagsTableColumns({
        onDelete,
        onEdit,
        onRead,
      }),
    [],
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
        icon={faTags}
        title="Tags"
        action={{
          title: "New Tag",
          icon: faPlus,
          onClick: () => setTagCreateVisible(true),
        }}
        filters={{
          activeCount: activeFiltersCount,
          content: (
            <TagsFilters
              filters={filters}
              activeFiltersCount={activeFiltersCount}
              applyFilter={applyFilter}
            />
          ),
        }}
        search={{
          placeholder: "Search by name or description...",
          onChange: (searchKeyword) => applyFilter("keyword", searchKeyword),
        }}
      />

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
          pageSizeOptions: ["2", "10", "20", "50", "100"],
          position: ["bottomRight"],
          showTotal: (total) => `Total ${total} tags`,
        }}
      />

      <WarningModal
        title={`Delete "${currentTag?.name}" tag?`}
        description={`Are you sure you want to delete "${currentTag?.name}" tag? Once you confirm, you cannot undo it later.`}
        open={tagDeleteVisible}
        onClose={() => setTagDeleteVisible(false)}
        onConfirm={deleteTag}
        confirmText="Delete"
        cancelText="Cancel"
        confirmLoading={tagDeleteLoading}
      />

      <TagCreateDrawer
        open={tagCreateVisible}
        onClose={() => setTagCreateVisible(false)}
      />

      <TagUpdateDrawer
        open={tagEditVisible}
        onClose={() => setTagEditVisible(false)}
        tag={currentTag}
      />

      <TagReadDrawer
        open={tagReadVisible}
        onClose={() => setTagReadVisible(false)}
        tag={currentTag}
      />
    </StyledContainer>
  );
};
