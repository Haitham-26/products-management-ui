import type { LoginResponseDto } from "../../model/shared/dto/LoginResponseDto";
import type { ForgotPasswordEmailDto } from "../../model/user/dto/ForgotPasswordEmailDto";
import type { ForgotPasswordNewDto } from "../../model/user/dto/ForgotPasswordNewDto";
import type { ForgotPasswordTokenDto } from "../../model/user/dto/ForgotPasswordTokenDto";
import type { GoogleLoginDto } from "../../model/user/dto/GoogleLoginDto";
import type { LoginDto } from "../../model/user/dto/LoginDto";
import type { ResetPasswordDto } from "../../model/user/dto/ResetPasswordDto";
import type { SignUpEmailDto } from "../../model/user/dto/SignUpEmailDto";
import type { SignUpResendTokenDto } from "../../model/user/dto/SignUpResendTokenDto";
import type { SignUpTokenDto } from "../../model/user/dto/SignUpTokenDto";
import type { UpdateUserDto } from "../../model/user/dto/UpdateUserDto";
import type { User } from "../../model/user/types/User";
import AppAxios from "../AppAxios";

export class UserAxios {
  static getUserById() {
    return AppAxios.get<User>("/user").then(({ data }) => data);
  }

  static updateUser(dto: UpdateUserDto) {
    const formData = new FormData();

    Object.entries(dto).forEach(([key, value]) => {
      if (key !== "avatar") {
        formData.append(key, String(value));
      } else {
        formData.append(key, value);
      }
    });

    return AppAxios.patch("/user/update", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }).then(({ data }) => data);
  }

  // For logged in user
  static resetPassword(dto: ResetPasswordDto) {
    return AppAxios.patch<Pick<LoginResponseDto, "accessToken">>(
      "/user/reset-password",
      dto,
    ).then(({ data }) => data);
  }

  static login(dto: LoginDto) {
    return AppAxios.post<LoginResponseDto>("/auth/login", dto, {
      withCredentials: true,
    }).then(({ data }) => data);
  }

  static googleLogin(dto: GoogleLoginDto) {
    return AppAxios.post<LoginResponseDto>("/auth/google-login", dto, {
      withCredentials: true,
    }).then(({ data }) => data);
  }

  static signUpEmail(dto: SignUpEmailDto) {
    return AppAxios.post("/auth/signup/email", dto).then(({ data }) => data);
  }

  static signUpToken(dto: SignUpTokenDto) {
    return AppAxios.post<LoginResponseDto>("/auth/signup/token", dto, {
      withCredentials: true,
    }).then(({ data }) => data);
  }
  static signUpResendToken(dto: SignUpResendTokenDto) {
    return AppAxios.post("/auth/signup/token-resend", dto).then(
      ({ data }) => data,
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

  static logout() {
    return AppAxios.post(
      "/auth/logout",
      {},
      {
        withCredentials: true,
      },
    ).then(({ data }) => {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("persist:root");
      return data;
    });
  }
}
