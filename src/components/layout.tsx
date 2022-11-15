import {
  AppShell,
  Burger,
  Center,
  Footer,
  Header,
  MediaQuery,
  useMantineTheme,
} from "@mantine/core";
import Image from "next/image";
import { type ReactNode, useState } from "react";
import logo from "../../public/logo.png";
import AppNavbar from "./AppNavbar";

function Layout({ children }: { children: ReactNode }) {
  const theme = useMantineTheme();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background: theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      navbar={<AppNavbar opened={opened} setOpened={setOpened} />}
      footer={
        <Footer height={60} p="md">
          <Center>&copy; Labo-DA 2022</Center>
        </Footer>
      }
      header={
        <Header height={{ base: 50, md: 70 }} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>

            <Image src={logo} width={100} alt="Logo Labo-DA"></Image>
          </div>
        </Header>
      }
    >
      <main>{children}</main>
    </AppShell>
  );
}

export default Layout;
