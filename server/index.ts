import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }
      // в prod логер придёт из static.ts, в dev — из vite.ts
      (globalThis as any).__logger?.(logLine) ?? console.log(logLine);
    }
  });

  next();
});
(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    res.status(status).json({ message });
    throw err;
  });

  const isDev = process.env.NODE_ENV === "development";

  if (isDev) {
    // dev: динамически подключаем vite-сервер
    const { setupVite, log } = await import("./vite.js");
    (globalThis as any).__logger = (msg: string) => log(msg);
    await setupVite(app, server);
  } else {
    // prod: статическая раздача из dist/public, без какого-либо упоминания vite
    const { serveStatic, log } = await import("./static.js");
    (globalThis as any).__logger = (msg: string) => log(msg);
    serveStatic(app);
  }

  const port = parseInt(process.env.PORT || "5000", 10);
  server.listen(
    {
      port,
      host: "0.0.0.0",
      reusePort: true,
    },
    () => {
      ((globalThis as any).__logger ?? console.log)(`serving on port ${port}`);
    },
  );
})();
