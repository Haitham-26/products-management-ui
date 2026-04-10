import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { ThemeProvider } from "styled-components";
import { theme } from "./theme/theme";
import { AntdConfigProvider } from "./AntdConfigProvider";
import { Toaster } from "sonner";
import { PersistGate } from "redux-persist/integration/react";

export default function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <AntdConfigProvider>
            <Toaster />

            <RouterProvider router={router} />
          </AntdConfigProvider>
        </ThemeProvider>
      </PersistGate>
    </Provider>
  );
}
