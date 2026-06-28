import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { User } from "../types/User";

export interface UpdateUserDto extends GenericWithUserId {
  name?: User["name"];
  company?: User["company"];
  avatar?: User["avatar"];
}
