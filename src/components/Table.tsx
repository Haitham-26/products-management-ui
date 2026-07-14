import { Table as AntdTable } from "antd";
import type { TableProps as AntdTableProps } from "antd";
import { useTranslation } from "react-i18next";

export type TableProps<T> = AntdTableProps<T>;

export const Table = <T extends object>(props: TableProps<T>) => {
  const { t } = useTranslation(undefined, { keyPrefix: "table" });

  return (
    <AntdTable
      size="small"
      sticky
      scroll={{ y: "calc(100vh - 25rem)" }}
      bordered
      rowKey="_id"
      locale={{
        triggerAsc: t("triggerAsc"),
        triggerDesc: t("triggerDesc"),
        cancelSort: t("cancelSort"),
        emptyText: t("emptyText"),
      }}
      {...props}
      pagination={{
        ...props.pagination,
        locale: {
          items_per_page: t("itemsPerPage"),
        },
        showTotal: (total) => t("total", { total }),
      }}
    />
  );
};
