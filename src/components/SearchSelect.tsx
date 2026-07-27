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

const Label = styled(Text)`
  font-size: ${({ theme }) => theme.typography.small};
  color: ${({ theme }) => theme.colors.textSecondary};

  span {
    color: ${({ theme }) => theme.colors.error};
  }
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
  required,
  ...props
}) => {
  const { t } = useTranslation(undefined, { keyPrefix: "common" });

  return (
    <Container>
      {title ? (
        <Label>
          {title} {required ? <span>*</span> : null}
        </Label>
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
