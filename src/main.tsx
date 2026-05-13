import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { MenuPage } from "./routes/index";
import { useKioskMode } from "@/lib/useKioskMode";
import { registerKioskSW } from "@/lib/pwa";

function App() {
  useKioskMode();
  useEffect(() => {
    registerKioskSW();
  }, []);
  return <MenuPage />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  createRoot(rootElement).render(<App />);
}
