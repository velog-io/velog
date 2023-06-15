import autoload from "@fastify/autoload";
import Fastify from "fastify";
import formbody from "@fastify/formbody";
import cookie from "@fastify/cookie";
import { ENV } from "src/env.js";
import { Utils } from "@lib/utils/utils.js";
import { container } from "tsyringe";

const a = "helo";

const app = Fastify({
  logger: true,
});

app.register(cookie, { secret: ENV.cookieSecretKey });
app.register(formbody);

const utils = container.resolve(Utils);
app.register(autoload, {
  dir: utils.resolveDir("src/common/plugins/global/"),
  encapsulate: false,
  forceESM: true,
});

export default app;
