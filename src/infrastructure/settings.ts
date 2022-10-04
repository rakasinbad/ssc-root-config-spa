
import { navigateToUrl, registerApplication } from "single-spa";
import {
  constructApplications,
  constructRoutes as spaRouteConstruct,
  constructLayoutEngine,
} from "single-spa-layout";
import { ResolvedRoutesConfig } from "single-spa-layout/dist/types/isomorphic/constructRoutes";
import microfrontendLayout from "../../src/routes/microfrontend-layout.html";
import loginLayout from "../../src/routes/login-layout.html";
import Cookies from 'universal-cookie'

const data = {
  loaders: {
    ssc: "<h1>Loading Seller Center</h1>",
    sidebar: "<h1>Loading Sidebar",
    sbp: "<h1>Loading Sales Force</h1></h1>",
    header: "<h1>Loading Header</h1>",
    login: "<h1>Loading Login</h1>",
  },
  errors: {
    ssc: "<h1>Failed to load Seller Center</h1>",
    sidebar: "<h1>Failed to load Sidebar</h1>",
    header: "<h1>Failed to load Header</h1>",
    sbp: "<h1>Failed to load Sales Force</h1>",
    login: "<h1>Failed to load Sales Login</h1>"
  },
  props: {}
}

const constructRoutes = async () => {
  let routes: ResolvedRoutesConfig;

  const cookies = new Cookies();
  const token = cookies.get('ssc-token');

  if (!token) {
    navigateToUrl("/login");
    routes = spaRouteConstruct(loginLayout, data)
  } else {
    routes = spaRouteConstruct(microfrontendLayout, data)
  }
  return routes;
}


export const constructEngine = async () => {
  const routes = await constructRoutes();
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
}

export const initVariable = async () => {
  globalThis.NODE_ENV = process.env["NODE_ENV"];
}
