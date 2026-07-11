import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import GlobalStyle from "./GlobalStyle.ts";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { initializeLanguage } from "./utils/i18nUtils.ts";

initializeLanguage().then(() =>
  createRoot(document.getElementById("root")!).render(
    <StrictMode>
      <GlobalStyle />
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <App />
      </GoogleOAuthProvider>
    </StrictMode>,
  ),
);
