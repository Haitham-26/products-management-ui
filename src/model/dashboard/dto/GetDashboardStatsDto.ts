import type { DatePeriodFilters } from "../../shared/types/DatePeriodFilters.enum";

export interface GetDashboardStatsDto {
  datePeriod: DatePeriodFilters;
}
