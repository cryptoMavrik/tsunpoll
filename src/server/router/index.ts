// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";
import { questionRouter } from "./questions";

export const appRouter = createRouter()
  .merge("questions.", questionRouter)
  .transformer(superjson)
// export type definition of API
export type AppRouter = typeof appRouter;
