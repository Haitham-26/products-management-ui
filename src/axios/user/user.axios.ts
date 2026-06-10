import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import type { LoginResponseDto } from "../../model/shared/dto/LoginResponseDto";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import type { User } from "../../model/user/types/User";
import AppAxios from "../AppAxios";

export class UserAxios {
  static login(dto: LoginDto) {
    return AppAxios.post<LoginResponseDto>("/auth/login", dto).then(
      ({ data }) => {
        localStorage.setItem("token", data.token);
        return data;
      },
    );
  }

  static signUpEmail(dto: SignUpEmailDto) {
    return AppAxios.post("/auth/signup/email", dto).then(({ data }) => data);
  }

  static signUpToken(dto: SignUpTokenDto) {
    return AppAxios.post<LoginResponseDto>("/auth/signup/token", dto).then(
      ({ data }) => {
        localStorage.setItem("token", data.token);
        return data;
      },
    );
  }

  static forgotPasswordEmail(dto: ForgotPasswordEmailDto) {
    return AppAxios.post("/auth/forgot-password/email", dto).then(
      ({ data }) => data,
    );
  }
  static forgotPasswordToken(dto: ForgotPasswordTokenDto) {
    return AppAxios.post("/auth/forgot-password/token", dto).then(
      ({ data }) => data,
    );
  }
  static forgotPasswordNew(dto: ForgotPasswordNewDto) {
    return AppAxios.post("/auth/forgot-password/new", dto).then(
      ({ data }) => data,
    );
  }

  static getOrganizationMembers(dto: GenericWithUserId) {
    return AppAxios.post<Partial<User>[]>("/organization/members", dto).then(
      ({ data }) => data,
    );
  }

  static updateMembersPermissions(dto: UpdateMembersPermissionsDto) {
    return AppAxios.patch<void>("/organization/members/update", dto).then(
      ({ data }) => data,
    );
  }
}
