import autoload from "@fastify/autoload";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import cookie from "@fastify/cookie";
import { ENV } from "src/env.js";
import { resolveDir } from "@common/utils/resolveDir.js";

const app = Fastify({
  logger: true,
});

app.register(cookie, { secret: ENV.cookieSecretKey });
app.register(formbody);
app.register(autoload, {
  dir: resolveDir("src/common/plugins/global/"),
  encapsulate: false,
  forceESM: true,
});

export default app;
