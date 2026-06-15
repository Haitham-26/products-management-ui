import React from "react";
import { Spin } from "antd";
import styled from "styled-components";
import { Text } from "./Text";
import { Select, type SelectProps } from "./Select";

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
            <span>{notFoundText || "No results found"}</span>
          )
        }
        options={options}
        placeholder="Search..."
        {...props}
      />
    </Container>
  );
};
