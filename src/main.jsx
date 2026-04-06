import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "./context/AppContext.jsx";
import { MotionConfig } from "motion/react";
import * as Sentry from "@sentry/react";

//Initialize Sentry (modern setup)
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  integrations: [
    Sentry.browserTracingIntegration(),
  ],
  tracesSampleRate: 1.0,
});

//Render App
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AppProvider>
        <MotionConfig viewport={{ once: true }}>
          <Sentry.ErrorBoundary fallback={<p>Something went wrong</p>}>
            <App />
          </Sentry.ErrorBoundary>
        </MotionConfig>
      </AppProvider>
    </BrowserRouter>
  </StrictMode>
);