import { Text, Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import { trpc } from "../../utils/trpc";

const Planning: NextPage = () => {
  const { data: availabilities } = trpc.availability.getAllFuture.useQuery();

  return (
    <>
      <Head>
        <title>Labo-DA - Planning</title>
        <meta
          name="description"
          content="Logiciel de réservation pour le Labo-DA Ynov"
        />
      </Head>
      <main>
        <Title order={2} mb="xl">
          Planning
        </Title>
        {availabilities?.map((a) => (
          <Text key={a.id}>
            le {a.startAt.toLocaleDateString("fr-FR", { dateStyle: "long" })} de{" "}
            {a.startAt.getHours()}h à {a.endAt.getHours()}h
          </Text>
        ))}
      </main>
    </>
  );
};

export default Planning;
