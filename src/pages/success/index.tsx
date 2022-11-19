import { Button, Grid, Text, Title } from "@mantine/core";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { getPageTitle } from "../../utils/functions";

const Success: NextPage = () => {
  return (
    <>
      <Head>
        <title>{getPageTitle("Demande envoyée")}</title>
      </Head>

      <Title>Demande envoyée</Title>
      <Text>Ta demande de formation a bien été prise en compte.</Text>
      <Text mb="sm">Tu recevras un mail lorsqu&apos;elle sera validée !</Text>
      <Text mb="sm" fs="italic">
        Si tu ne trouves pas le mail, pense à vérifier tes spams.
      </Text>
      <Text mb="lg">A très vite !</Text>
      <Text mb="xl" fw="bold">
        Le Labo DA
      </Text>

      <Grid>
        <Grid.Col xs={12} md={6}>
          <Link href="/" legacyBehavior>
            <Button fullWidth variant="outline">
              Retour à l&apos;accueil
            </Button>
          </Link>
        </Grid.Col>
        <Grid.Col span="auto">
          <Link href="/bookings" legacyBehavior>
            <Button fullWidth>Faire une nouvelle demande</Button>
          </Link>
        </Grid.Col>
      </Grid>
    </>
  );
};

export default Success;
