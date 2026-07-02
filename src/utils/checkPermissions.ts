import { CRUDPermissions } from "../model/user/types/CRUDPermissions.enum";
import type { PermissionEntities } from "../model/user/types/PermissionEntities";
import type { User } from "../model/user/types/User";
import { UserRoles } from "../model/user/types/UserRoles.enum";

export const checkPermissions = (user: User, entity: PermissionEntities) => {
  if (!user.roles.includes(UserRoles.MEMBER)) {
    return {
      [CRUDPermissions.CREATE]: true,
      [CRUDPermissions.READ]: true,
      [CRUDPermissions.UPDATE]: true,
      [CRUDPermissions.DELETE]: true,
    };
  }

  const entityPermissions = user?.permissions?.[entity];

  if (!entityPermissions) {
    return {
      [CRUDPermissions.CREATE]: false,
      [CRUDPermissions.READ]: false,
      [CRUDPermissions.UPDATE]: false,
      [CRUDPermissions.DELETE]: false,
    };
  }

  return {
    [CRUDPermissions.CREATE]: entityPermissions[CRUDPermissions.CREATE],
    [CRUDPermissions.READ]: entityPermissions[CRUDPermissions.READ],
    [CRUDPermissions.UPDATE]: entityPermissions[CRUDPermissions.UPDATE],
    [CRUDPermissions.DELETE]: entityPermissions[CRUDPermissions.DELETE],
  };
};
