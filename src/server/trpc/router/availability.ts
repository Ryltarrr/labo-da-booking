import { router, publicProcedure } from "../trpc";

export const availabilityRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.availability.findMany();
  }),
});
