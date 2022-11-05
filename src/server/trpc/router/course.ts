import { z } from "zod";

import { router, publicProcedure, protectedProcedure } from "../trpc";

export const courseRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.course.findMany({ include: { teachers: true } });
  }),
  getMine: protectedProcedure.query(async ({ ctx }) => {
    if (ctx.session.user.email) {
      return ctx.prisma.course.findMany({
        where: { teachers: { every: { email: ctx.session.user.email } } },
      });
    } else {
      return [];
    }
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        duration: z.number(),
        addTeacher: z.boolean(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        if (ctx.session?.user?.email !== null) {
          const { duration, name, addTeacher } = input;
          if (addTeacher) {
            await ctx.prisma.course.create({
              data: {
                duration,
                name,
                teachers: { connect: { email: ctx.session.user.email } },
              },
            });
          } else {
            await ctx.prisma.course.create({
              data: { duration, name },
            });
          }
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
          return ctx.prisma.course.deleteMany({
            where: { id: input },
          });
        }
      } catch (err) {
        console.error("error while deleting teacher", err);
      }
    }),
  toggleParticipation: protectedProcedure
    .input(z.object({ id: z.string(), add: z.boolean() }))
    .mutation(async ({ input, ctx }) => {
      try {
        const { add, id } = input;
        if (ctx.session.user.email) {
          if (add) {
            await ctx.prisma.course.update({
              where: { id },
              data: {
                teachers: { connect: { email: ctx.session.user.email } },
              },
            });
          } else {
            await ctx.prisma.course.update({
              where: { id: input.id },
              data: {
                teachers: { disconnect: { email: ctx.session.user.email } },
              },
            });
          }
        }
      } catch (err) {
        console.error("error while toggling participation");
      }
    }),
});
