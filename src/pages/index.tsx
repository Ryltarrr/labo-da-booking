import { Carousel } from "@mantine/carousel";
import {
  Button,
  Center,
  createStyles,
  Divider,
  Text,
  Title,
} from "@mantine/core";
import { IconCalendarPlus } from "@tabler/icons";
import { type NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { getImageUrl, getPageTitle } from "../utils/functions";
import { trpc } from "../utils/trpc";

const useStyles = createStyles((theme) => ({
  control: {
    "&[data-inactive]": {
      opacity: 0,
      cursor: "default",
    },
    border: "none",
    height: "36px",
    width: "36px",
    ":nth-child(2)": {
      backgroundColor: theme.colors.brand[4],
      color: "white",
    },
  },
}));

const Home: NextPage = () => {
  const { data: teachers } = trpc.teacher.getAll.useQuery();
  const { classes } = useStyles();

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
        <Carousel
          slideSize="20%"
          align="start"
          height={180}
          slideGap="md"
          classNames={classes}
        >
          {teachers?.map((t) => (
            <Carousel.Slide key={t.id}>
              <Image
                src={getImageUrl(t.email)}
                width={180}
                height={180}
                alt={`Photo de ${t.name}`}
              />
            </Carousel.Slide>
          ))}
        </Carousel>
      </main>
    </>
  );
};

export default Home;
