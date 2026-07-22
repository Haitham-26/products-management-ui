import type React from "react";
import { useTranslation } from "react-i18next";
import { Dropdown } from "../../../components/Dropdown";
import { Icon } from "../../../components/Icon";
import isFunction from "lodash/isFunction";
import type { Tag } from "../../../model/tag/types/Tag";
import { faEye } from "@fortawesome/free-solid-svg-icons/faEye";
import { faTrash } from "@fortawesome/free-solid-svg-icons/faTrash";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons/faPenToSquare";
import styled from "styled-components";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons/faEllipsis";

const ActionsIcon = styled(Icon)`
  margin-inline: auto;
`;

type FNType = VoidCallback<Tag>;

type TagActionsDropdownProps = {
  tag: Tag;
  actions: {
    onEdit?: FNType;
    onRead?: FNType;
    onDelete?: FNType;
  };
};

export const TagActionsDropdown: React.FC<TagActionsDropdownProps> = ({
  tag,
  actions: { onEdit, onRead, onDelete },
}) => {
  const { t } = useTranslation();

  return (
    <Dropdown
      trigger={["click"]}
      menu={{
        items: [
          {
            key: "view",
            icon: <Icon icon={faEye} />,
            label: t("common.view"),
            onClick: () => onRead?.(tag),
            disabled: !isFunction(onRead),
          },
          {
            key: "edit",
            icon: <Icon icon={faPenToSquare} />,
            label: t("common.edit"),
            onClick: () => onEdit?.(tag),
            disabled: !isFunction(onEdit),
          },
          {
            key: "delete",
            icon: <Icon icon={faTrash} />,
            label: t("common.delete"),
            danger: true,
            onClick: () => onDelete?.(tag),
            disabled: !isFunction(onDelete),
          },
        ].filter((item) => item.disabled !== true),
      }}
    >
      <ActionsIcon icon={faEllipsis} />
    </Dropdown>
  );
};
