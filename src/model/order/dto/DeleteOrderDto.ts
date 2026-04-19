import type { GenericWithUserId } from "../../shared/GenericWithUserId";

export interface DeleteOrderDto extends GenericWithUserId {
  orderId: string;
}
