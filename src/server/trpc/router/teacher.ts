import { z } from "zod";
import argon2 from "argon2";

import { router, publicProcedure, protectedProcedure } from "../trpc";

// Exclude keys from user
function exclude<Teacher, Key extends keyof Teacher>(
  teacher: Teacher,
  ...keys: Key[]
): Omit<Teacher, Key> {
  for (const key of keys) {
    delete teacher[key];
  }
  return teacher;
}

function excludeAll<Teacher, Key extends keyof Teacher>(
  teachers: Teacher[],
  ...keys: Key[]
): Omit<Teacher[], Key> {
  teachers.forEach((t) => {
    exclude(t, ...keys);
  });
  return teachers;
}

export const teacherRouter = router({
  getAll: publicProcedure.query(async ({ ctx }) => {
    const teachers = await ctx.prisma.teacher.findMany({
      orderBy: { createdAt: "asc" },
    });
    return excludeAll(teachers, "password");
  }),
  create: protectedProcedure
    .input(
      z.object({
        name: z.string(),
        email: z.string(),
        password: z.string(),
        role: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      try {
        const hashedPassword = await argon2.hash(input.password);
        await ctx.prisma.teacher.create({
          data: { ...input, password: hashedPassword },
        });
        return true;
      } catch (err) {
        console.error("error while creating teacher", err);
        return false;
      }
    }),
});
