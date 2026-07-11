import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import AppAxios from "../AppAxios";

export class DashboardAxios {
  static async getDashboardStats() {
    return AppAxios.get<GetDashboardStatsResponseDto>("/dashboard").then(
      ({ data }) => data,
    );
  }
}
