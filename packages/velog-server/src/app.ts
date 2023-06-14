import Fastify from "fastify";
import { ipaddr } from "@common/plugins/ipaddr.plugin.js";

const app = Fastify({
  logger: true,
});

app.register(ipaddr);

export default app;
