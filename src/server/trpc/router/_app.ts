import { router } from "../trpc";
import { authRouter } from "./auth";
import { teacherRouter } from "./teacher";

export const appRouter = router({
  teacher: teacherRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
