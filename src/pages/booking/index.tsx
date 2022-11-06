import "dayjs/locale/fr";
import { DatePicker, TimeInput } from "@mantine/dates";
import { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import {
  Box,
  Button,
  NumberInput,
  Radio,
  Select,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import { Location } from "@prisma/client";

type InitialValues = {
  courseId: string;
  lastName: string;
  firstName: string;
  date: null | Date;
  time: null | Date;
  email: string;
  group: string;
  attendees: number;
  location: Location;
  reason: string;
};

const BookingRequest: NextPage = () => {
  const { data: availabilities } = trpc.availability.getAll.useQuery();
  const { data: courses } = trpc.course.getAll.useQuery();
  const form = useForm<InitialValues>({
    initialValues: {
      courseId: "",
      lastName: "",
      firstName: "",
      date: null,
      time: null,
      email: "",
      group: "",
      attendees: 1,
      location: "SCHOOL",
      reason: "",
    },

    validate: {
      lastName: (value) => {
        const val = z.string().min(1).safeParse(value);
        if (!val.success) {
          return "Le nom est obligatoire";
        }
        return null;
      },
      firstName: (value) => {
        const val = z.string().min(1).safeParse(value);
        if (!val.success) {
          return "Le prénom est obligatoire";
        }
        return null;
      },
      email: (value) => {
        const val = z.string().email().endsWith("@ynov.com").safeParse(value);

        if (!val.success) {
          return "Email invalide (est-ce bien une adresse ynov ?)";
        }
        return null;
      },
      group: (value) => {
        const val = z.string().min(1).safeParse(value);
        if (!val.success) {
          return "Le nom du groupe est obligatoire";
        }
        return null;
      },
      reason: (value) => {
        const val = z.string().min(1).safeParse(value);
        if (!val.success) {
          return "La raison de votre demande est obligatoire";
        }
        return null;
      },
    },
  });

  const bookCourse = trpc.booking.create.useMutation();

  const handleCreate = (values: typeof form.values) => {
    const { date, time } = values;
    if (!date || !time) {
      throw new Error("no selected date");
    }
    let formattedDate = new Date(date);
    formattedDate.setHours(time.getHours());
    formattedDate.setMinutes(time.getMinutes());
    bookCourse.mutate({ ...form.values, date: formattedDate });
  };

  const isExcluded = (date: Date) => {
    if (!availabilities) {
      return true;
    }
    return !availabilities?.some(
      (avail) => avail.startAt.toDateString() === date.toDateString()
    );
  };

  return (
    <>
      <Box sx={{ maxWidth: 500 }} mx="auto">
        <h1>Requests</h1>
        <form onSubmit={form.onSubmit(handleCreate)}>
          <Select
            label="Sélectionner la formation"
            data={courses?.map((c) => ({ value: c.id, label: c.name })) ?? []}
            {...form.getInputProps("courseId")}
          />
          Heure choisie :{" "}
          {form.values.date?.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
          {" à "}
          {form.values.time?.toLocaleTimeString("fr-FR", {
            hour: "2-digit",
            minute: "2-digit",
          })}
          <DatePicker
            label="Date"
            locale="fr"
            excludeDate={isExcluded}
            {...form.getInputProps("date")}
          />
          <TimeInput label="Heure" {...form.getInputProps("time")} />
          <TextInput
            label="Indiquez votre nom"
            {...form.getInputProps("lastName")}
          />
          <TextInput
            label="Indiquez votre prénom"
            {...form.getInputProps("firstName")}
          />
          <TextInput
            label="Indiquez votre adresse mail Ynov"
            type="email"
            {...form.getInputProps("email")}
          />
          <TextInput
            label="Indiquez le nom de votre groupe Ydays"
            {...form.getInputProps("group")}
          />
          <NumberInput
            label="Indiquez le nombre de personnes qui assisteront à la formation"
            {...form.getInputProps("attendees")}
          />
          <Radio.Group
            label="Souhaitez-vous réaliser la formation"
            {...form.getInputProps("location")}
          >
            <Radio label="En présentiel (salle 203)" value="SCHOOL"></Radio>
            <Radio label="En distanciel (teams)" value="REMOTE" />
          </Radio.Group>
          <Textarea
            label="Pourquoi souhaitez-vous réaliser cette formation ?"
            {...form.getInputProps("reason")}
          />
          <Button type="submit">submit</Button>
        </form>
      </Box>
    </>
  );
};

export default BookingRequest;
