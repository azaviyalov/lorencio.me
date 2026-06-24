import express from "express";
import livereload from "livereload";

import { log } from "./log.js";
import { compileStyles, projectRoot, renderSite } from "./site.js";

const PORT = process.env.PORT || 3000;
const LIVERELOAD_PORT = process.env.LIVERELOAD_PORT || 35729;

const injectLiveReload = (html, host = "localhost") =>
  html.replace(
    "</body>",
    `<script src="http://${host}:${LIVERELOAD_PORT}/livereload.js?snipver=1"></script></body>`
  );

const app = express();

app.use(express.static(`${projectRoot}/src`));
app.use(express.static(`${projectRoot}/assets`));

app.get("/", async (req, res, next) => {
  try {
    await compileStyles();
    const html = await renderSite();
    const host = req.hostname || "localhost";

    res.send(injectLiveReload(html, host));
  } catch (error) {
    next(error);
  }
});

app.use(express.static(`${projectRoot}/build`));

app.use((err, req, res, _next) => {
  log.error(`Request failed while rendering ${req.originalUrl}:`, err.message);
  res.status(500).send("Internal server error: " + err.message);
});

const lrServer = livereload.createServer({
  port: LIVERELOAD_PORT,
  exts: ["js", "yaml", "hbs", "scss"],
});

lrServer.watch([
  `${projectRoot}/data`,
  `${projectRoot}/templates`,
  `${projectRoot}/src`,
  `${projectRoot}/assets`,
  `${projectRoot}/scripts`,
]);

app.listen(PORT, () => {
  log.success("Development server started");
  log.info(`Preview URL: http://localhost:${PORT}`);
  log.muted(`LiveReload websocket: port ${LIVERELOAD_PORT}`);
});
