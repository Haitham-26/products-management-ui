import type { ColumnsType } from "antd/es/table";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import { Icon } from "../../../components/Icon";
import { Dropdown } from "../../../components/Dropdown";
import { formatDate } from "../../../utils/Date";
import type { Tag } from "../../../model/tag/types/Tag";
import isFunction from "lodash/isFunction";
import styled from "styled-components";
import type { TFunction } from "i18next";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

type FNType = VoidCallback<Tag>;

type CreateTagsTableColumnsArgs = {
  onEdit?: FNType;
  onDelete?: FNType;
  onRead?: FNType;
  t: TFunction;
};

export const createTagsTableColumns = ({
  onEdit,
  onDelete,
  onRead,
  t,
}: CreateTagsTableColumnsArgs): ColumnsType<Tag> => {
  return [
    {
      title: t("common.actions"),
      key: "actions",
      width: 80,
      align: "center",
      fixed: "left",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <Icon icon={faEye} />,
                label: t("common.view"),
                onClick: () => onRead?.(record),
                disabled: !isFunction(onRead),
              },
              {
                key: "edit",
                icon: <Icon icon={faPenToSquare} />,
                label: t("common.edit"),
                onClick: () => onEdit?.(record),
                disabled: !isFunction(onEdit),
              },
              {
                key: "delete",
                icon: <Icon icon={faTrash} />,
                label: t("common.delete"),
                danger: true,
                onClick: () => onDelete?.(record),
                disabled: !isFunction(onDelete),
              },
            ].filter((item) => item.disabled !== true),
          }}
        >
          <ActionsIcon icon={faEllipsis} />
        </Dropdown>
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
