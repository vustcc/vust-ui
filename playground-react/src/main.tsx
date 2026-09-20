import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "@vustcc/tokens/index.css";
import "@vustcc/react/style.css";
import "./index.css";
import App from "./App";
import GlassLab from "./GlassLab";
import { VustGlassProvider } from "@vustcc/react";

const Content = new URLSearchParams(location.search).has("glass")
  ? GlassLab
  : App;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <VustGlassProvider>
      <Content />
    </VustGlassProvider>
  </StrictMode>,
);
