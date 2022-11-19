import "dayjs/locale/fr";
import { DatePicker, TimeInput } from "@mantine/dates";
import type { NextPage } from "next";
import { trpc } from "../../utils/trpc";
import {
  Button,
  Grid,
  NumberInput,
  Radio,
  Select,
  Textarea,
  TextInput,
  Title,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { z } from "zod";
import type { Location } from "@prisma/client";
import { useRouter } from "next/router";
import { showNotification } from "@mantine/notifications";
import { getPageTitle } from "../../utils/functions";
import Head from "next/head";

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
  const { data: availabilities } = trpc.availability.getAllFuture.useQuery();
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

  const router = useRouter();
  const bookCourse = trpc.booking.create.useMutation({
    onSuccess() {
      router.replace("/success");
    },
    onError() {
      showNotification({
        title: "Erreur",
        message: "La demande n'a pas pu aboutir, veuillez réessayer.",
        color: "red",
      });
    },
  });

  const handleCreate = (values: typeof form.values) => {
    const { date, time } = values;
    if (!date || !time) {
      throw new Error("no selected date");
    }
    const formattedDate = new Date(date);
    formattedDate.setHours(time.getHours());
    formattedDate.setMinutes(time.getMinutes());
    bookCourse.mutate({
      ...form.values,
      lastName: form.values.lastName.toUpperCase(),
      date: formattedDate,
    });
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
      <Head>
        <title>{getPageTitle("Demande de formation")}</title>
      </Head>
      <Title mb="xl">Demande de formation</Title>
      <form onSubmit={form.onSubmit(handleCreate)}>
        <Select
          mb="xs"
          label="Sélectionner la formation"
          data={courses?.map((c) => ({ value: c.id, label: c.name })) ?? []}
          {...form.getInputProps("courseId")}
        />
        <Grid mb="xs">
          <Grid.Col span={8}>
            <DatePicker
              label="Date"
              locale="fr"
              excludeDate={isExcluded}
              {...form.getInputProps("date")}
            />
          </Grid.Col>
          <Grid.Col span={4}>
            <TimeInput label="Heure" {...form.getInputProps("time")} />
          </Grid.Col>
        </Grid>
        <Grid mb="xs">
          <Grid.Col sm={12} md={6}>
            <TextInput label="Nom" {...form.getInputProps("lastName")} />
          </Grid.Col>
          <Grid.Col span="auto">
            <TextInput label="Prénom" {...form.getInputProps("firstName")} />
          </Grid.Col>
        </Grid>

        <TextInput
          mb="xs"
          label="Adresse mail Ynov"
          type="email"
          {...form.getInputProps("email")}
        />
        <TextInput
          mb="xs"
          label="Nom de votre groupe Ydays"
          {...form.getInputProps("group")}
        />
        <NumberInput
          mb="xs"
          label="Nombre de personnes qui assisteront à la formation"
          {...form.getInputProps("attendees")}
        />
        <Radio.Group
          mb="xs"
          label="Où souhaitez-vous réaliser la formation"
          {...form.getInputProps("location")}
        >
          <Radio label="En présentiel (salle 203)" value="SCHOOL"></Radio>
          <Radio label="En distanciel (teams)" value="REMOTE" />
        </Radio.Group>
        <Textarea
          mb="md"
          label="Pourquoi souhaitez-vous réaliser cette formation ?"
          {...form.getInputProps("reason")}
        />
        <Button type="submit" fullWidth>
          Envoyer la demande
        </Button>
      </form>
    </>
  );
};

export default BookingRequest;
