import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./styles.css";
import { MenuPage } from "./routes/index";
import { useKioskMode } from "@/lib/useKioskMode";
import { registerKioskSW } from "@/lib/pwa";
import { warmImageCache } from "@/lib/warmImageCache";

function App() {
  useKioskMode();
  useEffect(() => {
    registerKioskSW();
    // Met les 141 photos dans le cache pendant qu'on a du réseau, sans quoi un
    // kiosk hors ligne affiche le menu complet mais aucune photo.
    warmImageCache();
  }, []);
  return <MenuPage />;
}

const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  createRoot(rootElement).render(<App />);
}
