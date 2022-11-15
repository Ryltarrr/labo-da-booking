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
  IconCalendarPlus,
  IconCertificate,
  IconCheck,
  IconHome,
  IconLogin,
  IconLogout,
  IconMail,
  IconSchool,
} from "@tabler/icons";
import { signOut, signIn, useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { type Dispatch, type SetStateAction, useEffect } from "react";

type AppNavbarProps = {
  opened: boolean;
  setOpened: Dispatch<SetStateAction<boolean>>;
};

type AppLink = {
  label: string;
  href: string;
  icon: JSX.Element;
  visibility: "STUDENT" | "TEACHER" | "ALL";
};

const links: AppLink[] = [
  {
    label: "Accueil",
    href: "/",
    icon: <IconHome size={22} stroke={1.5} />,
    visibility: "ALL",
  },
  {
    label: "Formateurs",
    href: "/teachers",
    icon: <IconSchool size={22} stroke={1.5} />,
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
    href: "/teachers/invite",
    icon: <IconMail size={22} stroke={1.5} />,
    visibility: "TEACHER",
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
              <Box>
                <Text fw={500}>{sessionData.user?.name}</Text>
                <Text c="dimmed">{sessionData.user?.email}</Text>
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
