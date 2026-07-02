import { Table as AntdTable } from "antd";
import type { TableProps as AntdTableProps } from "antd";

export type TableProps<T> = AntdTableProps<T>;

export const Table = <T extends object>(props: TableProps<T>) => {
  return (
    <AntdTable
      size="small"
      sticky
      scroll={{ y: "calc(100vh - 25rem)" }}
      bordered
      rowKey="_id"
      {...props}
    />
  );
};
