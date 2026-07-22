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
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  ArcElement,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
);

ChartJS.defaults.font.family = '"Inter", "IBM Plex Sans Arabic", sans-serif';

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
