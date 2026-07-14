import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { AntdConfigProvider } from "./AntdConfigProvider";
import { PersistGate } from "redux-persist/integration/react";
import "react-phone-number-input/style.css";
import { ToastProvider } from "./components/toast/ToastProvider";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <AntdConfigProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </AntdConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
