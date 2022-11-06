import { router } from "../trpc";
import { authRouter } from "./auth";
import { teacherRouter } from "./teacher";
import { courseRouter } from "./course";
import { availabilityRouter } from "./availability";
import { bookingRouter } from "./booking";

export const appRouter = router({
  teacher: teacherRouter,
  course: courseRouter,
  auth: authRouter,
  availability: availabilityRouter,
  booking: bookingRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
