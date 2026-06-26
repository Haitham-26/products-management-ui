import type { GenericWithUserId } from "../../model/shared/dto/GenericWithUserId";
import type { GenericWithMemberId } from "../../model/user/dto/GenericWithMemberId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import type { User } from "../../model/user/types/User";
import type { GenericWithInvitationId } from "../../model/user/users-permissions/dto/GenericWithInvitationId";
import type { GetJoinOrgInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetJoinOrgInvitationsResponseDto";
import type { GetOwnerInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetOwnerInvitationsResponseDto";
import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import AppAxios from "../AppAxios";

export class UsersPermissionsAxios {
  static inviteMembers(dto: InviteMembersDto) {
    return AppAxios.post("/users-permissions/invite-members", dto).then(
      ({ data }) => data,
    );
  }

  static getOwnerInvitations(dto: GenericWithUserId) {
    return AppAxios.post<GetOwnerInvitationsResponseDto>(
      "/users-permissions/owner-invitations",
      dto,
    ).then(({ data }) => data);
  }

  static getJoinOrgInvitatios(dto: GenericWithUserId) {
    return AppAxios.post<GetJoinOrgInvitationsResponseDto>(
      "/users-permissions/join-org-invitations",
      dto,
    ).then(({ data }) => data);
  }

  static cancelInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/users-permissions/cancel-invitation", dto).then(
      ({ data }) => data,
    );
  }

  static declineInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/users-permissions/decline-invitation", dto).then(
      ({ data }) => data,
    );
  }

  static acceptInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/users-permissions/accept-invitation", dto).then(
      ({ data }) => data,
    );
  }

  static getOrganizationMembers(dto: GenericWithUserId) {
    return AppAxios.post<Partial<User>[]>(
      "/users-permissions/members",
      dto,
    ).then(({ data }) => data);
  }

  static updateMembersPermissions(dto: UpdateMembersPermissionsDto) {
    return AppAxios.patch<void>("/users-permissions/update", dto).then(
      ({ data }) => data,
    );
  }

  static removeMember(dto: GenericWithMemberId) {
    return AppAxios.post<void>("/users-permissions/members/remove", dto).then(
      ({ data }) => data,
    );
  }
}
