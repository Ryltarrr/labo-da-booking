import { z } from "zod";
import { Location } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const bookingRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.booking.findMany();
  }),
  create: publicProcedure
    .input(
      z.object({
        courseId: z.string(),
        date: z.date(),
        firstName: z.string(),
        lastName: z.string(),
        email: z.string().email().endsWith("@ynov.com"),
        attendees: z.number().positive(),
        group: z.string(),
        location: z.nativeEnum(Location),
        reason: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        await ctx.prisma.booking.create({
          data: { ...input },
        });
        return true;
      } catch (err) {
        console.error("error while creating teacher", err);
        return false;
      }
    }),
  validate: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.email) {
        await ctx.prisma.booking.update({
          where: { id: input },
          data: { teacher: { connect: { email: ctx.session.user.email } } },
        });
      }
    }),
});
