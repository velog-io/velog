import app from "./app.js";

async function bootstrap() {
  const PORT = process.env.PORT || "5000";
  app.listen({ port: parseInt(PORT) });

  console.log(`Server listening on port ${PORT}`);
}

bootstrap();
