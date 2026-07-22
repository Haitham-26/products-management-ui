import type { GetDashboardStatsDto } from "../../model/dashboard/dto/GetDashboardStatsDto";
import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import AppAxios from "../AppAxios";

export class DashboardAxios {
  static async getDashboardStats(dto: GetDashboardStatsDto) {
    return AppAxios.get<GetDashboardStatsResponseDto>("/dashboard", {
      params: dto,
    }).then(({ data }) => data);
  }
}
