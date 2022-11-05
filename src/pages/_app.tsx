import { type AppType } from "next/app";
import { type Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import { MantineProvider } from "@mantine/core";
import { trpc } from "../utils/trpc";

import "../styles/globals.css";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Layout from "../components/layout";

const MyApp: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
