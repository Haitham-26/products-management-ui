import React from "react";
import { Spin } from "antd";
import styled from "styled-components";
import { Text } from "./Text";
import { Select, type SelectProps } from "./Select";
import { useTranslation } from "react-i18next";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

type SearchSelectProps = SelectProps & {
  onSearch: VoidCallback<string>;
  notFoundText?: React.ReactNode;
};

export const SearchSelect: React.FC<SearchSelectProps> = ({
  title,
  loading,
  options,
  onSearch,
  notFoundText,
  ...props
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "common" });

  return (
    <Container>
      {title ? (
        <Text color="textSecondary" fontSize="small">
          {title}
        </Text>
      ) : null}

      <Select
        showSearch={{
          filterOption: false,
          onSearch,
        }}
        notFoundContent={
          loading ? (
            <Spin size="small" />
          ) : (
            <span>{notFoundText || t("noResultsFound")}</span>
          )
        }
        options={options}
        placeholder={t("search")}
        {...props}
      />
    </Container>
  );
};
