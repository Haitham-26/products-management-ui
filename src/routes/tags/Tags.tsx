import React, { useEffect, useMemo, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { Container } from "../../components/Container";
import { Table } from "../../components/Table";
import { WarningModal } from "../../components/WarningModal";
import userSliceSelectors from "../../redux/user/user.selector";
import styled from "styled-components";
import { Button } from "../../components/Button";
import { faPlus } from "@fortawesome/free-solid-svg-icons/faPlus";
import { TagCreateDrawer } from "./components/TagCreateDrawer";
import { Text } from "../../components/Text";
import { TagUpdateDrawer } from "./components/TagUpdateDrawer";
import { createTagsTableColumns } from "./components/createTagsTableColumns";
import type { Tag } from "../../model/tag/types/Tag";
import { tagActions } from "../../redux/tag/tags.slice";
import { TagReadDrawer } from "./components/TagReadDrawer";
import tagSliceSelectors from "../../redux/tag/tags.selector";

const StyledContainer = styled(Container)`
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.lg};
  margin-bottom: ${({ theme }) => theme.spacing.lg};
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

      await dispatch(
        tagActions.deleteTag({
          tagId: currentTag?._id,
          userId,
        }),
      ).unwrap();
      await dispatch(tagActions.getTags({ userId })).unwrap();

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
    dispatch(tagActions.getTags({ userId }));
  }, [dispatch, userId]);

  return (
    <StyledContainer>
      <Header>
        <Text fontSize="title">Tags</Text>

        <Button icon={faPlus} onClick={() => setTagCreateVisible(true)}>
          Add tag
        </Button>
      </Header>

      <Table
        loading={tagsLoading}
        columns={tableColumns}
        dataSource={tags}
        pagination={false}
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
