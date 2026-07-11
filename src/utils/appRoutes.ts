import { faChartBar } from "@fortawesome/free-solid-svg-icons/faChartBar";
import { faBox } from "@fortawesome/free-solid-svg-icons/faBox";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons/faCartShopping";
import { faFolder } from "@fortawesome/free-solid-svg-icons/faFolder";
import { faUser } from "@fortawesome/free-solid-svg-icons/faUser";
import { faTags } from "@fortawesome/free-solid-svg-icons/faTags";
import { faUsersGear } from "@fortawesome/free-solid-svg-icons/faUsersGear";
import { faGear } from "@fortawesome/free-solid-svg-icons/faGear";

export const appRoutes = {
  dashboard: {
    path: "/",
    titleKey: "dashboard.title",
    icon: faChartBar,
  },
  products: {
    path: "/products",
    titleKey: "products.title",
    icon: faBox,
  },
  orders: {
    path: "/orders",
    titleKey: "orders.title",
    icon: faCartShopping,
  },
  categories: {
    path: "/categories",
    titleKey: "categories.title",
    icon: faFolder,
  },
  tags: {
    path: "/tags",
    titleKey: "tags.title",
    icon: faTags,
  },
  profile: {
    path: "/profile",
    titleKey: "profile.title",
    icon: faUser,
  },
  usersPermissions: {
    path: "/users-permissions",
    titleKey: "usersPermissions.title",
    icon: faUsersGear,
  },
  settings: {
    path: "/settings",
    titleKey: "settings.title",
    icon: faGear,
  },
};
