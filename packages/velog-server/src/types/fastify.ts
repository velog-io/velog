import "fastify";

declare module "fastify" {
  interface FastifyRequest {
    user: null;
    ipaddr: string | null;
  }
}
