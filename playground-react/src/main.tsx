import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@vustcc/tokens/index.css";
import "@vustcc/react/style.css";
import "./index.css";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
