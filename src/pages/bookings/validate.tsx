import {
  Avatar,
  Badge,
  Button,
  Card,
  Grid,
  Group,
  Text,
  Title,
} from "@mantine/core";
import { type NextPage } from "next";
import { trpc } from "../../utils/trpc";
import { IconCalendar, IconMail, IconUsers } from "@tabler/icons";

const Validate: NextPage = () => {
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
      <Title order={1} mb="xl">
        Demande de formation
      </Title>
      <Grid gutter="md">
        {bookings?.map((b) => (
          <Grid.Col key={b.id} span={6}>
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
                    onClick={() => refuse.mutate(b.id)}
                  >
                    Refuser
                  </Button>
                </Grid.Col>
              </Grid>
            </Card>
          </Grid.Col>
        ))}
      </Grid>
    </>
  );
};

export default Validate;
