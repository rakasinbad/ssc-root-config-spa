import { registerApplication } from "single-spa";
import {
  constructApplications,
  constructRoutes,
  constructLayoutEngine,
} from "single-spa-layout";
import microfrontendLayout from "../microfrontend-layout.html";
import sscOnly from "../ssc-only.html";

import { ResolvedRoutesConfig } from "single-spa-layout/dist/types/isomorphic/constructRoutes";

export const constructEngine = async () => {
  const data = {
    loaders: {
      ssc: "<h1>Loading Seller Center</h1>",
      sidebar: "<h1>Loading Sidebar</h1>",
      sbp: "<h1>Loading Sales Force</h1></h1>",
      header: "<h1>Loading Header</h1>"
    },
    errors: {
      ssc: "<h1>Failed to load Seller Center</h1>",
      sidebar: "<h1>Failed to load Sidebar</h1>",
      header: "<h1>Failed to load Header</h1>",
      sbp: "<h1>Failed to load Sales Force</h1>"
    },
    props: {},
  };

  const pathname = window.location.pathname //returns the current url minus the domain name

  let routes: ResolvedRoutesConfig;

  // if (pathname === '/' || pathname === '/auth/login') {
  //   routes = constructRoutes(sscOnly, data);
  // } else {
  //   routes = constructRoutes(microfrontendLayout, data);
  // }
  routes = constructRoutes(microfrontendLayout, data);
    

  const applications = constructApplications({
    routes,
    loadApp({ name }) {
      // @ts-ignore
      return System.import(name);
    },
  });
  applications.forEach(registerApplication);

  return constructLayoutEngine({ routes, applications });
};

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
};
