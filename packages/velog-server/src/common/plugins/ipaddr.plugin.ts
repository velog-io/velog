import type { FastifyPluginAsync } from "fastify";

export const ipaddr: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request) => {
    const fromCdnIp = request.headers["gcdn-client-ip"];
    const graphCdnAddress = Array.isArray(fromCdnIp) ? fromCdnIp[0] : fromCdnIp;
    request.ipaddr = graphCdnAddress || request.ips?.slice(-1)[0] || request.ip;
  });
};
