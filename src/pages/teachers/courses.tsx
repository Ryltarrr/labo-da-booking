import {
  Box,
  Button,
  Checkbox,
  Group,
  NumberInput,
  TextInput,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { z } from "zod";
import { getPageTitle } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

const Courses: NextPage = () => {
  const { data, refetch } = trpc.course.getAll.useQuery();
  const session = useSession();
  console.log(session);
  const createCourse = trpc.course.create.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const deleteCourse = trpc.course.delete.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const toggleParticipation = trpc.course.toggleParticipation.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const form = useForm({
    initialValues: {
      name: "",
      duration: 15,
      addTeacher: true,
    },

    validate: {
      name: (value) => {
        const val = z.string().min(1).safeParse(value);
        if (!val.success) {
          return "Le nom est obligatoire";
        }
        return null;
      },
      duration: (value) => {
        const val = z.number().min(15).safeParse(value);
        if (!val.success) {
          return "La durée est obligatoire";
        }
        return null;
      },
    },
  });

  const handleCreate = async () => {
    createCourse.mutate(form.values);
    form.reset();
  };

  return (
    <>
      <Head>
        <title>{getPageTitle("Cours")}</title>
        <meta name="description" content="Gestion des cours" />
      </Head>

      <Box sx={{ maxWidth: 300 }} mx="auto">
        Mes formations
        {data?.map((f) => {
          const teacherParticipates = f.teachers.some(
            (t) => t.email === session.data?.user?.email
          );
          return (
            <div key={f.id}>
              {f.name} ({f.duration} minutes) (
              {teacherParticipates ? "participe" : "participe pas"})
              <button
                onClick={() =>
                  toggleParticipation.mutate({
                    id: f.id,
                    add: !teacherParticipates,
                  })
                }
              >
                {teacherParticipates ? "Retirer" : "Ajouter"}
              </button>
              <button onClick={() => deleteCourse.mutate(f.id)}>
                Supprimer
              </button>
            </div>
          );
        })}
        <form onSubmit={form.onSubmit(handleCreate)}>
          <TextInput withAsterisk label="Nom" {...form.getInputProps("name")} />
          <NumberInput
            withAsterisk
            type="number"
            label="Durée du cours en minute"
            {...form.getInputProps("duration")}
          />
          <Checkbox
            label="M'ajouter à ce cours"
            {...form.getInputProps("addTeacher", { type: "checkbox" })}
          />
          <Group position="right" mt="md">
            <Button type="submit">Créer la formation</Button>
          </Group>
        </form>
      </Box>
    </>
  );
};

export default Courses;
