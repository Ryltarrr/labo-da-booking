import { router } from "../trpc";
import { authRouter } from "./auth";
import { teacherRouter } from "./teacher";
import { courseRouter } from "./course";

export const appRouter = router({
  teacher: teacherRouter,
  course: courseRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
