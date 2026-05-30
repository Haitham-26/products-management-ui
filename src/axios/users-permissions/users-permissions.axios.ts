import type { GenericWithUserId } from "../../model/shared/GenericWithUserId";
import type { CancelInvitationDto } from "../../model/user/users-permissions/dto/CancelInvitationDto";
import type { GetPendingInvitationsResponseDto } from "../../model/user/users-permissions/dto/GetPendingInvitationsResponseDto";
import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import AppAxios from "../AppAxios";

export class UsersPermissionsAxios {
  static inviteMembers(dto: InviteMembersDto) {
    return AppAxios.post("/users-permissions/invite-members", dto).then(
      ({ data }) => data,
    );
  }

  static getPendingInvitations(dto: GenericWithUserId) {
    return AppAxios.post<GetPendingInvitationsResponseDto>(
      "/users-permissions/pending-invitations",
      dto,
    ).then(({ data }) => data);
  }

  static cancelInvitation(dto: CancelInvitationDto) {
    return AppAxios.post("/users-permissions/cancel-invitation", dto).then(
      ({ data }) => data,
    );
  }
}
