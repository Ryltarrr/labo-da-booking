import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const bookingRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany();
  }),
  getMine: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.email) {
      return ctx.prisma.course.findMany({
        where: { teacher: { email: ctx.session.user.email } },
      });
    } else {
      return [];
    }
  }),
  create: protectedProcedure
    .input(z.object({ name: z.string(), duration: z.number() }))
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.session?.user?.email !== null) {
          const { duration, name } = input;
          const teacher = await ctx.prisma.teacher.findUnique({
            where: { email: ctx.session.user.email },
          });
          if (!teacher) {
            return false;
          }
          await ctx.prisma.course.create({
            data: { duration, name, teacherId: teacher.id },
          });
        }
        return true;
      } catch (err) {
        console.error("error while creating teacher", err);
        return false;
      }
    }),
  delete: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.session.user.email) {
          return ctx.prisma.booking.delete({
            where: { id: input },
          });
        }
      } catch (err) {
        console.error("error while deleting teacher", err);
      }
    }),
});
