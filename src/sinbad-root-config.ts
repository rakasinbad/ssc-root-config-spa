import { start } from "single-spa";
import { initEvent, constructEngine } from './infrastructure/settings';

async function bootstrap() {
  initEvent();
  const layoutEngine = await constructEngine();
  
  layoutEngine.activate();
  
  start({
    urlRerouteOnly: true,
  });
}

bootstrap();
