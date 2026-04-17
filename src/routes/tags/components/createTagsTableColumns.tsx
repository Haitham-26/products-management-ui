import type { ColumnsType } from "antd/es/table";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";

import { Icon } from "../../../components/Icon";
import { Dropdown } from "../../../components/Dropdown";
import { formatDate } from "../../../utils/Date";
import type { Tag } from "../../../model/tag/types/Tag";

type FNType = (tag: Tag) => void;

type CreateTagsTableColumnsArgs = {
  onEdit: FNType;
  onDelete: FNType;
  onRead: FNType;
};

export const createTagsTableColumns = ({
  onEdit,
  onDelete,
  onRead,
}: CreateTagsTableColumnsArgs): ColumnsType<Tag> => {
  return [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      width: 220,
      ellipsis: true,
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      width: 360,
      ellipsis: true,
    },
    {
      title: "Usage Count",
      dataIndex: "usageCount",
      key: "usageCount",
      width: 200,
      ellipsis: true,
      sorter: (a, b) => b.usageCount - a.usageCount,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      key: "createdAt",
      width: 180,
      render: (value: string) => formatDate(new Date(value), true),
      sorter: (a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 80,
      align: "center",
      fixed: "right",
      render: (_, record) => (
        <Dropdown
          trigger={["click"]}
          menu={{
            items: [
              {
                key: "view",
                icon: <Icon icon={faEye} />,
                label: "View",
                onClick: () => onRead(record),
              },
              {
                key: "edit",
                icon: <Icon icon={faPenToSquare} />,
                label: "Edit",
                onClick: () => onEdit(record),
              },
              {
                key: "delete",
                icon: <Icon icon={faTrash} />,
                label: "Delete",
                danger: true,
                onClick: () => onDelete(record),
              },
            ],
          }}
        >
          <span style={{ cursor: "pointer" }}>
            <Icon icon={faEllipsis} />
          </span>
        </Dropdown>
      ),
    },
  ];
};
