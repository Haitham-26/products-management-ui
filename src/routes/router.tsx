import { createBrowserRouter } from "react-router-dom";
import { PrivateRoutes } from "./Private-routes";
import { PublicRoutes } from "./Public-routes";

export const router = createBrowserRouter([PrivateRoutes, PublicRoutes]);
