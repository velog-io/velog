import app from "./app.js";
import { ENV } from "./env.js";

async function bootstrap() {
  app.listen({ port: ENV.port });
  console.log(`Server listening on port ${ENV.port}`);
}

bootstrap();
