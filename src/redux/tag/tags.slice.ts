import { createSlice } from "@reduxjs/toolkit";
import { AppThunk } from "../AppThunk";
import { userActions } from "../user/user.slice";
import type { CreateTagDto } from "../../model/tag/dto/CreateTagDto";
import type { Tag } from "../../model/tag/types/Tag";
import type { DeleteTagDto } from "../../model/tag/dto/DeleteTagDto";
import type { UpdateTagDto } from "../../model/tag/dto/UpdateTagDto";
import { TagAxios } from "../../axios/tag/tag.axios";
import type { PaginationMeta } from "../../model/shared/meta/PaginationMeta";
import type { PaginatedResponse } from "../../model/shared/meta/PaginatedResponse";
import type { GetTagsDto } from "../../model/tag/dto/GetTagsDto";

interface TagState {
  tags?: Tag[];
  tagsLoading?: boolean;
  meta?: PaginationMeta;
}

const initialState: TagState = {
  tags: [],
  tagsLoading: false,
  meta: {
    total: 0,
    page: 1,
    limit: 10,
  },
};

const createTag = AppThunk<void, CreateTagDto>(
  "/tags/create",
  TagAxios.createTag,
);

const getTags = AppThunk<PaginatedResponse<Tag>, GetTagsDto>(
  "/tags",
  TagAxios.getTags,
);

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
      state.tags = action.payload.data;
      state.meta = action.payload.meta;
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
