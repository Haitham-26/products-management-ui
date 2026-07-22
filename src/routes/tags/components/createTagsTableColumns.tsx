import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { Tag } from "../../../model/tag/types/Tag";
import type { TFunction } from "i18next";
import { TagActionsDropdown } from "./TagActionsDropdown";

type FNType = VoidCallback<Tag>;

type CreateTagsTableColumnsArgs = {
  onEdit?: FNType;
  onDelete?: FNType;
  onRead?: FNType;
  t: TFunction;
};

export const createTagsTableColumns = ({
  t,
  ...restActions
}: CreateTagsTableColumnsArgs): ColumnsType<Tag> => {
  return [
    {
      title: t("common.actions"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <TagActionsDropdown tag={record} actions={restActions} />
      ),
    },
    {
      title: t("common.name"),
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("common.description"),
      dataIndex: "description",
      key: "description",
      width: 360,
      ellipsis: true,
    },
    {
      title: t("tags.fields.usageCount"),
      dataIndex: "usageCount",
      key: "usageCount",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => b.usageCount - a.usageCount,
    },
    {
      title: t("common.filters.creationDate.title"),
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
  ];
};
