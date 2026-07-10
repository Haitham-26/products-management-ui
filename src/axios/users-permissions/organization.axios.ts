import type { GenericWithMemberId } from "../../model/user/dto/GenericWithMemberId";
import type { UpdateMembersPermissionsDto } from "../../model/user/dto/UpdateMembersPermissionsDto";
import type { User } from "../../model/user/types/User";
import type { GenericWithInvitationId } from "../../model/user/organization/dto/GenericWithInvitationId";
import type { GetJoinOrgInvitationsResponseDto } from "../../model/user/organization/dto/GetJoinOrgInvitationsResponseDto";
import type { GetOwnerInvitationsResponseDto } from "../../model/user/organization/dto/GetOwnerInvitationsResponseDto";
import type { InviteMembersDto } from "../../model/user/organization/dto/InviteMembersDto";
import AppAxios from "../AppAxios";

export class OrganizationAxios {
  static inviteMembers(dto: InviteMembersDto) {
    return AppAxios.post("/organization/owner/invite-members", dto).then(
      ({ data }) => data,
    );
  }

  static getOwnerInvitations() {
    return AppAxios.get<GetOwnerInvitationsResponseDto>(
      "/organization/owner/invitations",
    ).then(({ data }) => data);
  }

  static manageMembersPermissions(dto: UpdateMembersPermissionsDto) {
    return AppAxios.patch<void>("/organization/owner/members/manage", dto).then(
      ({ data }) => data,
    );
  }

  static removeMember(dto: GenericWithMemberId) {
    return AppAxios.post<void>("/organization/owner/members/remove", dto).then(
      ({ data }) => data,
    );
  }

  static getJoinOrgInvitations() {
    return AppAxios.get<GetJoinOrgInvitationsResponseDto>(
      "/organization/member/invitations",
    ).then(({ data }) => data);
  }

  static cancelInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/organization/owner/invitation/cancel", dto).then(
      ({ data }) => data,
    );
  }

  static declineInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/organization/member/invitation/decline", dto).then(
      ({ data }) => data,
    );
  }

  static acceptInvitation(dto: GenericWithInvitationId) {
    return AppAxios.post("/organization/member/invitation/accept", dto).then(
      ({ data }) => data,
    );
  }

  static getOrganizationMembers() {
    return AppAxios.get<Partial<User>[]>("/organization/owner/members").then(
      ({ data }) => data,
    );
  }

  static leaveOrg() {
    return AppAxios.post("/organization/member/leave").then(({ data }) => data);
  }
}
