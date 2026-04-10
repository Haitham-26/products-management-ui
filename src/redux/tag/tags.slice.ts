import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import { userActions } from "../user/user.slice";
import type { CreateTagDto } from "../../model/tag/dto/CreateTagDto";
import type { Tag } from "../../model/tag/types/Tag";
import type { DeleteTagDto } from "../../model/tag/dto/DeleteTagDto";
import type { UpdateTagDto } from "../../model/tag/dto/UpdateTagDto";
import { TagAxios } from "../../axios/tag/tag.axios";

interface TagState {
  tags?: Tag[];
  tagsLoading?: boolean;
}

const initialState: TagState = {
  tags: [],
  tagsLoading: false,
};

const createTag = AppThunk<void, CreateTagDto>(
  "/tags/create",
  TagAxios.createTag,
);

const getTags = AppThunk<Tag[], GenericWithUserId>("/tags", TagAxios.getTags);

const deleteTag = AppThunk<void, DeleteTagDto>(
  "/tags/:id/delete",
  TagAxios.deleteTag,
);

const updateTag = AppThunk<void, UpdateTagDto>(
  "/tags/:id/update",
  TagAxios.updateTag,
);

export const tagSlice = createSlice({
  name: "tags",
  initialState,
  reducers: {},
  extraReducers: ({ addCase }) => {
    addCase(getTags.pending, (state) => {
      state.tagsLoading = true;
    });
    addCase(getTags.fulfilled, (state, action) => {
      state.tags = action.payload;
      state.tagsLoading = false;
    });
    addCase(getTags.rejected, (state) => {
      state.tagsLoading = false;
    });

    addCase(userActions.logout.fulfilled, () => initialState);
  },
});

const tagActions = {
  createTag,
  getTags,
  deleteTag,
  updateTag,
};

export { tagActions };

export default tagSlice.reducer;
