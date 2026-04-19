import type React from "react";
import styled from "styled-components";
import { useAppSelector } from "../../../redux/store";
import { useCallback, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { Input } from "../../../components/Input";
import { Button } from "../../../components/Button";
import { faRotateLeft } from "@fortawesome/free-solid-svg-icons/faRotateLeft";
import {
  buildOrdersParams,
  countOrdersActiveFilters,
  parseOrdersFiltersFromParams,
} from "../utils/orderUtils";
import type { GetOrdersDto } from "../../../model/order/dto/GetOrdersDto";
import orderSliceSelectors from "../../../redux/order/orders.selector";
import { Select } from "../../../components/Select";
import { OrderStatus } from "../../../model/order/types/OrderStatus.enum";
import capitalize from "lodash/capitalize";

const statusOptions = [
  { label: "All", value: null },
  ...Object.values(OrderStatus).map((s) => ({
    label: capitalize(s),
    value: s,
  })),
];

const PopoverBody = styled.div`
  padding: ${({ theme }) => theme.spacing.sm};
`;

const PopoverContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.md};
  width: 16rem;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xs};
`;

const Label = styled.label`
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.textSecondary};
`;

// const Row = styled.div`
//   display: flex;
//   gap: ${({ theme }) => theme.spacing.xs};
// `;

const RangeRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xs};

  input {
    flex: 1;
    min-width: 0;
  }
`;

const RangeDash = styled.span`
  font-size: 0.75rem;
  color: ${({ theme }) => theme.colors.textSecondary};
  flex-shrink: 0;
`;

const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: ${({ theme }) => theme.spacing.md};
`;

export const OrdersFilter: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const ordersMeta = useAppSelector(orderSliceSelectors.selectOrdersMeta);

  const filters = useMemo(
    () => parseOrdersFiltersFromParams(searchParams, ordersMeta),
    [searchParams, ordersMeta],
  );

  const activeCount = countOrdersActiveFilters(filters);

  const applyFilter = useCallback(
    (key: keyof GetOrdersDto, value: unknown) => {
      setSearchParams(
        buildOrdersParams(
          {
            ...filters,
            meta: { ...(filters.meta || {}), page: 0 },
            [key]: value,
          },
          searchParams,
        ),
        { replace: true },
      );
    },
    [filters, searchParams, setSearchParams],
  );

  const resetFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  return (
    <PopoverBody>
      <PopoverContent>
        <Section>
          <Select
            title="Status"
            options={statusOptions}
            value={filters.status}
            onChange={(value) => applyFilter("status", value)}
          />
        </Section>

        <Section>
          <Label>Total price</Label>
          <RangeRow>
            <Input
              type="number"
              placeholder="Min"
              value={filters.minTotalPrice || ""}
              onChange={(e) =>
                applyFilter(
                  "minTotalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
            <RangeDash>–</RangeDash>
            <Input
              type="number"
              placeholder="Max"
              value={filters.maxTotalPrice || ""}
              onChange={(e) =>
                applyFilter(
                  "maxTotalPrice",
                  e.target.value ? Number(e.target.value) : undefined,
                )
              }
              min={0}
            />
          </RangeRow>
        </Section>
      </PopoverContent>

      {activeCount ? (
        <Footer>
          <Button icon={faRotateLeft} onClick={resetFilters}>
            Clear all
          </Button>
        </Footer>
      ) : null}
    </PopoverBody>
  );
};
