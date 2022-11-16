import { Container, Flex, Grid, Text, Title } from "@mantine/core";
import { Teacher } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { getImageUrl } from "../utils/functions";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: teachers } = trpc.teacher.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Labo-DA</title>
        <meta
          name="description"
          content="Logiciel de réservation pour le Labo-DA Ynov"
        />
      </Head>
      <Container size="sm">
        <main>
          <Title order={2} mb="xl">
            Bienvenue sur le site du Labo DA de Nantes Ynov Campus !
          </Title>
          <Text mb="sm">
            Notre objectif est de vous accompagner et de vous aider à utiliser
            les meilleurs outils et technologies, adaptés à votre projet Ydays.
          </Text>
          <Text mb="sm">
            Notre équipe multidisciplinaire nous permet de vous proposer des
            nombreuses formations en communication, marketing et design.
          </Text>
          <Text fs="italic" mb="sm">
            Nous vous donnons rendez-vous dans l’onglet “Réservation” pour
            effectuer une demande de formation.
          </Text>
          <Text mb="xl">
            Pour toute question, nous vous invitons à nous rendre visite en
            salle 203 ou bien à nous envoyer un message par mail ou sur Teams.
          </Text>
          <Grid gutter="xl" grow>
            {teachers?.map((t) => (
              <Grid.Col span={t.role.includes("DA") ? 6 : 4} key={t.id}>
                <TeacherBlock teacher={t} />
              </Grid.Col>
            ))}
          </Grid>
        </main>
      </Container>
    </>
  );
};

const TeacherBlock: React.FC<{ teacher: Teacher }> = ({ teacher }) => {
  return (
    <>
      <Flex direction="column" justify="center" align="center" h={200}>
        <Text ta="center" fz="md" c="brand">
          {teacher.role}
        </Text>
        <Image
          src={getImageUrl(teacher.email)}
          width={130}
          height={130}
          alt={`Photo de ${teacher.name}`}
        />
        <Text fz="lg" c="brandBlue">
          {teacher.name}
        </Text>
      </Flex>
    </>
  );
};

export default Home;
