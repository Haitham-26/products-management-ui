import React, { Fragment } from "react";
import {
  Pagination as AntdPagination,
  type PaginationProps as AntdPaginationProps,
} from "antd";
import { useTranslation } from "react-i18next";
import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  .ant-pagination {
    flex-wrap: wrap;
    
    row-gap: ${({ theme }) => theme.spacing.sm};
  }

  .ant-pagination .ant-pagination-options {
    display: block;
  }

  .ant-pagination-total-text {
    white-space: nowrap;
  }
`;

export type PaginationProps = AntdPaginationProps;

export const Pagination: React.FC<PaginationProps> = (props) => {
  const { t } = useTranslation(undefined, { keyPrefix: "table" });

  return (
    <Fragment>
      <AntdPagination
        locale={{ items_per_page: t("itemsPerPage") }}
        {...props}
      />

      <GlobalStyle />
    </Fragment>
  );
};
