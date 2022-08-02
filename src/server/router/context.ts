// src/server/router/context.ts
import * as trpc from "@trpc/server";
import * as trpcNext from "@trpc/server/adapters/next";


export const createContext = async (
  opts?: trpcNext.CreateNextContextOptions,
) => {
  const req = opts?.req;

  return {
    token: opts?.req.cookies["poll-token"],
    req
  };
};

type Context = trpc.inferAsyncReturnType<typeof createContext>;

export const createRouter = () => trpc.router<Context>();
