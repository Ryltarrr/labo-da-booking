import {
  Button,
  Center,
  Divider,
  Flex,
  Grid,
  Text,
  Title,
} from "@mantine/core";
import type { Teacher } from "@prisma/client";
import { IconCalendarPlus } from "@tabler/icons";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getPageTitle } from "../utils/functions";
import { trpc } from "../utils/trpc";

const Home: NextPage = () => {
  const { data: teachers } = trpc.teacher.getAll.useQuery();

  return (
    <>
      <Head>
        <title>{getPageTitle("Accueil")}</title>
        <meta
          name="description"
          content="Logiciel de réservation pour le Labo-DA Ynov"
        />
      </Head>
      <main>
        <Title order={2} mb="xl">
          Bienvenue sur le site du Labo DA de Nantes Ynov Campus !
        </Title>
        <Text mb="sm">
          Notre objectif est de vous accompagner et de vous aider à utiliser les
          meilleurs outils et technologies, adaptés à votre projet Ydays.
        </Text>
        <Text mb="sm">
          Notre équipe multidisciplinaire nous permet de vous proposer de
          nombreuses formations en communication, marketing et design.
        </Text>
        <Center mb="sm">
          <Link href="/bookings">
            <Button leftIcon={<IconCalendarPlus size={22} stroke={1.5} />}>
              Faire une demande de formation
            </Button>
          </Link>
        </Center>
        <Text mb="xl">
          Pour toute question, nous vous invitons à nous rendre visite en salle
          203 ou bien à nous envoyer un message par mail ou sur Teams.
        </Text>
        <Text mb="xl" fw="bold">
          📚 Téléchargez notre catalogue de formations en{" "}
          <Text
            component="a"
            target="_blank"
            rel="noopener noreferrer"
            href="Catalogue-Formations_LaboDA.pdf"
            c="brand"
          >
            cliquant ici
          </Text>
          .
        </Text>
        <Divider mb="xl" />
        <Title order={2} mb="xl">
          Découvrez la team !
        </Title>
        <Grid gutter="xl" grow>
          {teachers?.map((t) => (
            <Grid.Col span={t.role.includes("DA") ? 6 : 4} key={t.id}>
              <TeacherBlock teacher={t} />
            </Grid.Col>
          ))}
        </Grid>
      </main>
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
