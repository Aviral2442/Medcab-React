import { useRoutes } from "react-router";
import { routes } from "@/routes";
import { useEffect } from "react";
import { setupTokenExpiryCheck } from "@/utils/auth";

const App = () => {
  useEffect(() => {
    const intervalId = setupTokenExpiryCheck(60000*5); // Check every 5 minutes
    return () => clearInterval(intervalId);
  }, []);

  return useRoutes(routes);
};

export default App;