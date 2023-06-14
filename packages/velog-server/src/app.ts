import Fastify from "fastify";
import { ipaddr } from "@common/plugins/ipaddr.plugin";

const app = Fastify({
  logger: true,
});

app.register(ipaddr);

export default app;
