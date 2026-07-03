import type { GenericWithUserId } from "../../shared/dto/GenericWithUserId";
import type { OrderVisibility } from "../types/OrderVisibility.enum";

export interface BulkManageOrderVisibilityDto extends GenericWithUserId {
  orderIds: string[];
  visibility: OrderVisibility;
}
