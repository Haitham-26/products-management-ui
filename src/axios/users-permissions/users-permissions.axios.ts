import type { InviteMembersDto } from "../../model/user/users-permissions/dto/InviteMembersDto";
import AppAxios from "../AppAxios";

export class UsersPermissionsAxios {
  static inviteMembers(dto: InviteMembersDto) {
    return AppAxios.post("/users-permissions/invite-members", dto).then(
      ({ data }) => data,
    );
  }
}
