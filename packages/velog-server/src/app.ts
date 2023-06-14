import Fastify from "fastify";
import { ipaddr } from "@common/plugins/ipaddr.plugin.js";
import { cors } from "@common/plugins/cors.plugin";

const app = Fastify({
  logger: true,
});

app.register(ipaddr);
app.register(cors);

export default app;
