import { z } from "zod";
import { Location } from "@prisma/client";
import { router, publicProcedure, protectedProcedure } from "../trpc";
import { mailjet } from "../../../utils/mailjet";
import { env } from "../../../env/server.mjs";

export const bookingRouter = router({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.booking.findMany();
  }),
  getAllPlanned: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.booking.findMany({
      include: { course: true, teacher: true },
      where: { teacher: { isNot: null } },
    });
  }),
  getAllToValidate: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.booking.findMany({
      where: { status: "WAITING" },
      include: { course: true },
    });
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
      const course = await ctx.prisma.course.findUnique({
        where: { id: input.courseId },
      });
      if (!course) {
        throw new Error("course does not exists, id: " + input.courseId);
      }
      await ctx.prisma.booking.create({
        data: { ...input },
      });
      await mailjet.post("send", { version: "v3.1" }).request({
        Messages: [
          {
            From: {
              Email: env.MAILJET_SENDER,
              Name: "Labo DA Ynov",
            },
            To: [
              {
                Email: input.email,
                Name: `${input.firstName} ${input.lastName}`,
              },
            ],
            TemplateID: Number(env.MAILJET_TEMPLATE_BOOKING),
            TemplateLanguage: true,
            Variables: {
              firstName: input.firstName,
              courseName: course.name,
            },
          },
        ],
      });

      return true;
    }),
  refuse: protectedProcedure
    .input(
      z.object({
        bookingId: z.string(),
        reason: z.string().min(1, "La raison ne doit pas être vide"),
      })
    )
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.email) {
        const booking = await ctx.prisma.booking.update({
          include: { course: true },
          where: { id: input.bookingId },
          data: { status: "REFUSED" },
        });

        await mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: env.MAILJET_SENDER,
                Name: "Labo DA Ynov",
              },
              To: [
                {
                  Email: booking.email,
                  Name: `${booking.firstName} ${booking.lastName}`,
                },
              ],
              TemplateID: Number(env.MAILJET_TEMPLATE_REFUSAL),
              TemplateLanguage: true,
              Variables: {
                firstName: booking.firstName,
                courseName: booking.course.name,
                reason: input.reason,
              },
            },
          ],
        });
      }
    }),
  validate: protectedProcedure
    .input(z.string())
    .mutation(async ({ input, ctx }) => {
      if (ctx.session.user.email) {
        const booking = await ctx.prisma.booking.update({
          include: { course: true },
          where: { id: input },
          data: {
            status: "VALIDATED",
            teacher: { connect: { email: ctx.session.user.email } },
          },
        });
        const location =
          booking.location === "SCHOOL"
            ? "présentiel (salle 203)"
            : "distanciel (Teams)";

        await mailjet.post("send", { version: "v3.1" }).request({
          Messages: [
            {
              From: {
                Email: env.MAILJET_SENDER,
                Name: "Labo DA Ynov",
              },
              To: [
                {
                  Email: booking.email,
                  Name: `${booking.firstName} ${booking.lastName}`,
                },
              ],
              TemplateID: Number(env.MAILJET_TEMPLATE_VALIDATE),
              TemplateLanguage: true,
              Variables: {
                firstName: booking.firstName,
                courseName: booking.course.name,
                location,
                date: booking.date.toLocaleString("fr-FR", {
                  weekday: "long",
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }),
              },
            },
          ],
        });
      }
    }),
});
