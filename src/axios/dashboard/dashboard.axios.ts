import type { GetDashboardStatsResponseDto } from "../../model/dashboard/dto/GetDashboardStatsResponseDto";
import AppAxios from "../AppAxios";

export class DashboardAxios {
  static async getDashboardStats() {
    return AppAxios.post<GetDashboardStatsResponseDto>("/dashboard").then(
      ({ data }) => data,
    );
  }
}
