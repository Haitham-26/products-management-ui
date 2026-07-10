import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import productsSlice from "./product/products.slice";
import categoriesSlice from "./category/categories.slice";
import tagsSlice from "./tag/tags.slice";
import userSlice from "./user/user.slice";
import ordersSlice from "./order/orders.slice";
import settingsSlice from "./settings/settings.slice";
import dashboardSlice from "./dashboard/dashboard.slice";
import organizationSlice from "./organization/organization.slice";
import appSlice from "./app/app.slice";
import storage from "redux-persist/lib/storage";

const rootReducer = combineReducers({
  products: productsSlice,
  categories: categoriesSlice,
  tags: tagsSlice,
  orders: ordersSlice,
  user: userSlice,
  settings: settingsSlice,
  dashboard: dashboardSlice,
  organization: organizationSlice,
  app: appSlice,
});

const persistedReducer = persistReducer(
  {
    key: "root",
    storage,
  },
  rootReducer,
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
