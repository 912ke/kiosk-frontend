import express, { type Express } from "express";
import fs from "fs";
import path from "path";
import { type Server } from "http";
import { nanoid } from "nanoid";

/**
 * Простой логгер (без зависимости от vite)
 */
export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
/**
 * Настройка Vite ТОЛЬКО в development.
 * И vite, и vite.config подтягиваем динамически,
 * чтобы в production не тянуть dev-зависимости.
 */
export async function setupVite(app: Express, server: Server) {
  // 1) Динамически импортируем сам Vite
  const { createServer: createViteServer, createLogger } = await import("vite");
  const viteLogger = createLogger();

  // 2) Динамически импортируем конфиг Vite
  //    (в нём есть импорт из "vite", поэтому тоже только в dev)
  const viteConfigModule = await import("../vite.config");
  const viteConfig = (viteConfigModule as any).default ?? viteConfigModule;

  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      },
    },
    server: serverOptions,
    appType: "custom",
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html",
      );

      // всегда перезагружаем index.html с диска (hot-reload в dev)
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`,
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      (vite as any).ssrFixStacktrace?.(e as Error);
      next(e);
    }
  });
}
/**
 * Прод-режим: статическая раздача уже собранного фронта из dist/public
 */
export function serveStatic(app: Express) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  app.use(express.static(distPath));

  // SPA-fallback на index.html
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}
