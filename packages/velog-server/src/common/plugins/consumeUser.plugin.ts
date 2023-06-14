import { FastifyPluginAsync } from "fastify";

export const consumeUser: FastifyPluginAsync = async (fastify) => {
  fastify.decorateRequest("user", null);
  fastify.addHook("preHandler", (request, reply, done) => {
    if (request.url.includes("/auth/logout")) return;

    let accessToken: string | undefined = request.cookies["access_token"];
    const refreshToken: string | undefined = request.cookies["refresh_token"];

    const { authorization } = request.headers;

    if (!accessToken && authorization) {
      accessToken = authorization.split(" ")[1];
    }

    // TODO: 아래 로직 구현하기
    // try {
    //   if (!accessToken) {
    //     throw new Error("NoAccessToken");
    //   }
    //   const accessTokenData = await decodeToken<AccessTokenData>(accessToken);

    //   request["user_id"] = accessTokenData.user_id;
    //   // refresh token when life < 30mins
    //   const diff = accessTokenData.exp * 1000 - new Date().getTime();
    //   if (diff < 1000 * 60 * 30 && refreshToken) {
    //     await refresh(request, refreshToken);
    //   }
    // } catch (e) {
    //   // invalid token! try token refresh...
    //   if (!refreshToken) return;
    //   try {
    //     const userId = await refresh(request, refreshToken);
    //     // set user_id if succeeds
    //     request["user_id"] = userId;
    //   } catch (e) {}
    // }
  });
};
