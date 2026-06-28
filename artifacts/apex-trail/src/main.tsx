import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { setBaseUrl } from "@workspace/api-client-react";

// Configure API client to point to the backend server
setBaseUrl("http://localhost:3000");

createRoot(document.getElementById("root")!).render(<App />);
