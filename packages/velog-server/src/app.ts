import Fastify from "fastify";
import formbody from "@fastify/formbody";
import cookie from "@fastify/cookie";
import { ENV } from "src/env.js";
import { ipaddr } from "@common/plugins/hooks/ipaddr.plugin.js";
import { cors } from "@common/plugins/global/cors.plugin.js";
import { keepAlive } from "@common/plugins/hooks/keepAlive.plugin.js";

const app = Fastify({
  logger: true,
});

app.register(cookie, { secret: ENV.cookieSecretKey });
app.register(formbody);
app.register(ipaddr);
app.register(cors);
app.register(keepAlive);

export default app;
