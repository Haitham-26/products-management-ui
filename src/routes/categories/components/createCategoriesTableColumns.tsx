import type { ColumnsType } from "antd/es/table";

import { formatDate } from "../../../utils/Date";
import type { Category } from "../../../model/category/types/Category";
import type { TFunction } from "i18next";
import { CategoryActionsDropdown } from "./CategoryActionsDropdown";

type FNType = VoidCallback<Category>;

type CreateCategoriesTableColumnsArgs = {
  onEdit?: FNType;
  onDelete?: FNType;
  onRead?: FNType;
  t: TFunction;
};

export const createCategoriesTableColumns = ({
  t,
  ...restActions
}: CreateCategoriesTableColumnsArgs): ColumnsType<Category> => {
  return [
    {
      title: t("common.actions"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <CategoryActionsDropdown category={record} actions={restActions} />
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
      title: t("categories.fields.usageCount"),
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
