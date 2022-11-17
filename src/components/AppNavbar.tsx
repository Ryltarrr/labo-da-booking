import {
  ActionIcon,
  Box,
  Divider,
  Flex,
  Navbar,
  NavLink,
  Text,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconCalendarPlus,
  IconCertificate,
  IconCheck,
  IconHome,
  IconLogin,
  IconLogout,
  IconMail,
} from "@tabler/icons";
import { signOut, signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect } from "react";
import { ADMIN_EMAIL } from "../utils/constants";
import { getImageUrl } from "../utils/functions";

type AppNavbarProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

type AppLink = {
  label: string;
  href: string;
  icon: JSX.Element;
  visibility: "STUDENT" | "TEACHER" | "ALL" | "ADMIN";
};

const links: AppLink[] = [
  {
    label: "Accueil",
    href: "/",
    icon: <IconHome size={22} stroke={1.5} />,
    visibility: "ALL",
  },
  {
    label: "Planning",
    href: "/planning",
    icon: <IconCalendarEvent size={22} stroke={1.5} />,
    visibility: "TEACHER",
  },
  {
    label: "Réservation",
    href: "/bookings",
    icon: <IconCalendarPlus size={22} stroke={1.5} />,
    visibility: "STUDENT",
  },
  {
    label: "Validation",
    href: "/bookings/validate",
    icon: <IconCheck size={22} stroke={1.5} />,
    visibility: "TEACHER",
  },
  {
    label: "Invitation",
    href: "/teachers",
    icon: <IconMail size={22} stroke={1.5} />,
    visibility: "ADMIN",
  },
  {
    label: "Formations",
    href: "/teachers/courses",
    icon: <IconCertificate size={22} stroke={1.5} />,
    visibility: "TEACHER",
  },
];

const AppNavbar: React.FC<AppNavbarProps> = ({ opened, setOpened }) => {
  const { data: sessionData } = useSession();
  const router = useRouter();

  useEffect(() => {
    return () => {
      if (setOpened) {
        setOpened(false);
      }
    };
  }, [setOpened, router.asPath]);

  const filteredLinks = links.filter((link) => {
    if (link.visibility === "TEACHER" && !sessionData) {
      return false;
    } else if (
      link.visibility === "ADMIN" &&
      (!sessionData || sessionData?.user?.email !== ADMIN_EMAIL)
    ) {
      return false;
    } else if (link.visibility === "STUDENT" && sessionData) {
      return false;
    }
    return true;
  });

  return (
    <Navbar
      p="md"
      hiddenBreakpoint="sm"
      hidden={!opened}
      width={{ sm: 250, lg: 300 }}
    >
      <Navbar.Section grow mt="md">
        {filteredLinks.map((link) => (
          <Link key={link.href} href={link.href} passHref legacyBehavior>
            <NavLink
              active={router.route === link.href}
              label={link.label}
              component="a"
              icon={link.icon}
            />
          </Link>
        ))}
      </Navbar.Section>
      <Divider my="sm" />
      <Navbar.Section>
        <Flex justify="space-around" align="center">
          {sessionData ? (
            <>
              <div>
                <Image
                  src={getImageUrl(sessionData.user?.email)}
                  width={50}
                  height={50}
                  style={{ borderRadius: "50%" }}
                  alt={""}
                />
              </div>
              <Box>
                <Text fw={500} fz="sm">
                  {sessionData.user?.name}
                </Text>
                <Text c="dimmed" fz="xs">
                  {sessionData.user?.email}
                </Text>
              </Box>
              <ActionIcon
                onClick={() => {
                  signOut();
                  router.replace("/");
                }}
              >
                <IconLogout />
              </ActionIcon>
            </>
          ) : (
            <>
              <Text>Connexion formateur</Text>

              <ActionIcon onClick={() => signIn()}>
                <IconLogin />
              </ActionIcon>
            </>
          )}
        </Flex>
      </Navbar.Section>
    </Navbar>
  );
};

export default AppNavbar;
