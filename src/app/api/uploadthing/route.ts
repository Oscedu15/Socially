import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
});

//? UploadThing es una herramienta que permite agregar archivos a aplicaciones TypeScript full stack. 