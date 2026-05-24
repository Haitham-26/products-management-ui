import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import AppAxios from "../AppAxios";

export class DashboardAxios {
  static async getDashboardStats(dto: GenericWithUserId) {
    return AppAxios.post<GetDashboardStatsResponseDto>("/dashboard", dto).then(
      ({ data }) => data,
    );
  }
}
