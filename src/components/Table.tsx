import { Table as AntdTable } from "antd";
import type { TableProps as AntdTableProps } from "antd";

export const Table = <T extends object>(props: AntdTableProps<T>) => {
  return (
    <AntdTable
      size="small"
      sticky
      scroll={{ y: "calc(100vh - 25rem)" }}
      bordered
      {...props}
    />
  );
};
