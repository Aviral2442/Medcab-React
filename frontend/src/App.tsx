import { useRoutes } from "react-router";
import { routes } from "@/routes";
import { useZoom } from "@/components/zoom";

const App = () => {
  useZoom(90); // Call hook directly
  return useRoutes(routes);
};

export default App;