import type React from "react";
import { Empty } from "./Empty";

export const NoPermissions: React.FC = () => {
  return <Empty description="You don't have permission to access this page" />;
};
