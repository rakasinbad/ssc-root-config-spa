import { start } from "single-spa";
import { initEvent, constructEngine } from './infrastructure/settings';

async function bootstrap() {
  initEvent();
  const layoutEngine = await constructEngine();
  
  layoutEngine.activate();
  
  await System.import("@sinbad/mf-react-component");
  await System.import("@sinbad/mf-style");
  
  start({
    urlRerouteOnly: true,
  });
}

bootstrap();
