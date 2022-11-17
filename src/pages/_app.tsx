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
      <MantineProvider
        theme={{
          primaryShade: { light: 4 },
          colors: {
            brand: [
              "#E4DFF0",
              "#C9BEE7",
              "#AF9BE4",
              "#9474E8",
              "#7847F5",
              "#6B3DDF",
              "#6037C9",
              "#5C3EA8",
              "#57428E",
              "#514279",
            ],
            brandBlue: [
              "#757B86",
              "#69707C",
              "#5D6573",
              "#525B6B",
              "#485264",
              "#3E4A5E",
              "#354259",
              "#333C4D",
              "#303743",
              "#2D323A",
            ],
          },
          primaryColor: "brand",
        }}
        withGlobalStyles
        withNormalizeCSS
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </MantineProvider>
      <ReactQueryDevtools />
    </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
