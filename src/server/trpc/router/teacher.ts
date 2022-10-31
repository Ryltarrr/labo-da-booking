import { z } from "zod";

import { router, publicProcedure } from "../trpc";

export const teacherRouter = router({
  hello: publicProcedure
    .input(z.object({ text: z.string().nullish() }).nullish())
    .query(({ input }) => {
      return {
        greeting: `Hello ${input?.text ?? "world"}`,
      };
    }),
  getAll: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.teacher.findMany();
  }),
  create: publicProcedure
    .input(z.object({ name: z.string() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const teacher = await ctx.prisma.teacher.create({ data: input });
        console.log("teacher", teacher);
        return true;
      } catch (err) {
        console.error("error while creating teacher", err);
        return false;
      }
    }),
});
