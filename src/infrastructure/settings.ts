
import { registerApplication } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "../microfrontend-layout.html";

export const constructEngine = async () => {
  const routes = constructRoutes(microfrontendLayout, {
    loaders: {
      ssc: "<h1>Loading Seller Center</h1>",
      sidebar: "<h1>Loading Sidebar"
    },
    errors: {
      ssc: "<h1>Failed to load Seller Center</h1>",
      sidebar: "<h1>Failed to load Sidebar</h1>"
    },
    props: {}
  });
  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      // @ts-ignore
      return System.import(name);
    },
  });
  applications.forEach(registerApplication);

  return constructLayoutEngine({ routes, applications });
}

export const initEvent = () => {
  window.addEventListener("single-spa:before-routing-event", () => {
      document.getElementById("loading-ring").classList.remove("invisible");
  });

  window.addEventListener("single-spa:routing-event", () => {
      document.getElementById("loading-ring").classList.add("invisible");
  });

  document.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
          const element = e.target as HTMLElement;
          element.click();
      }
  });
}