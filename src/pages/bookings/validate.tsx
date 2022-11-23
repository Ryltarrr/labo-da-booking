import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Modal,
  Text,
  TextInput,
  Title,
} from "@mantine/core";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { IconCalendar, IconMail, IconUsers } from "@tabler/icons";
import Head from "next/head";
import { getPageTitle } from "../../utils/functions";
import { useState } from "react";
import { useForm } from "@mantine/form";

const Validate: NextPage = () => {
  const [bookingId, setBookingId] = useState<string | false>(false);
  const form = useForm({ initialValues: { reason: "" } });
  const { data: bookings, refetch } = trpc.booking.getAllToValidate.useQuery();
  const validate = trpc.booking.validate.useMutation({
    onSuccess() {
      refetch();
    },
  });
  const refuse = trpc.booking.refuse.useMutation({
    onSuccess() {
      refetch();
    },
  });

  return (
    <>
      <Head>
        <title>{getPageTitle("Demande de formation")}</title>
      </Head>
      <Title order={1} mb="xl">
        Demande de formation
      </Title>
      <Grid gutter="md">
        {bookings?.length ? (
          bookings?.map((b) => (
            <Grid.Col sm={12} key={b.id} md={6}>
              <Card shadow="sm" p="lg" radius="md" withBorder>
                <Title order={3}>{b.course.name}</Title>
                <Group position="apart" mt="md" mb="xs">
                  <Group>
                    <Avatar radius="lg">
                      {b.firstName[0]}
                      {b.lastName[0]}
                    </Avatar>
                    <Text weight={500}>
                      {b.firstName} {b.lastName}
                    </Text>
                  </Group>
                  <Badge color="brand" variant="light">
                    {b.location === "SCHOOL" ? "Présentiel" : "Distanciel"}
                  </Badge>
                </Group>
                <Group>
                  <IconCalendar />{" "}
                  {b.date.toLocaleString("fr-FR", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </Group>
                <Group>
                  <IconMail /> {b.email}
                </Group>
                <Group>
                  <IconUsers /> {b.group} ({b.attendees} personne
                  {b.attendees > 1 && "s"})
                </Group>
                <Text mt="sm" size="sm" color="dimmed">
                  {b.reason}
                </Text>

                <Grid>
                  <Grid.Col span={6}>
                    <Button
                      variant="light"
                      color="green"
                      fullWidth
                      disabled={refuse.isLoading}
                      loading={validate.isLoading}
                      mt="md"
                      radius="md"
                      onClick={() => validate.mutate(b.id)}
                    >
                      Valider
                    </Button>
                  </Grid.Col>
                  <Grid.Col span={6}>
                    <Button
                      variant="light"
                      color="red"
                      fullWidth
                      disabled={validate.isLoading}
                      loading={refuse.isLoading}
                      mt="md"
                      radius="md"
                      onClick={() => setBookingId(b.id)}
                    >
                      Refuser
                    </Button>
                  </Grid.Col>
                </Grid>
              </Card>
            </Grid.Col>
          ))
        ) : (
          <Text>
            Aucune demande de formation à valider, revenez plus tard 🙂.
          </Text>
        )}
      </Grid>
      <Modal
        title="Raison du refus"
        opened={!!bookingId}
        onClose={() => setBookingId(false)}
      >
        <form
          onSubmit={form.onSubmit(() => {
            refuse.mutate({
              reason: form.values.reason,
              bookingId: bookingId as string,
            });
            setBookingId(false);
          })}
        >
          <TextInput data-autofocus mb="md" {...form.getInputProps("reason")} />
          <Button type="submit" fullWidth>Valider le refus</Button>
        </form>
      </Modal>
    </>
  );
};

export default Validate;
