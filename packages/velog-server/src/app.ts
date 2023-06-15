import Fastify from "fastify";
import formbody from "@fastify/formbody";
import cookie from "@fastify/cookie";
import { ipaddr } from "@common/plugins/ipaddr.plugin.js";
import { cors } from "@common/plugins/cors.plugin.js";
import { ENV } from "src/env.js";

const app = Fastify({
  logger: true,
});

app.register(ipaddr);
app.register(cors);
app.register(cookie, { secret: ENV.cookieSecretKey });
app.register(formbody);

export default app;
