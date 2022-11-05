import { useSession } from "next-auth/react";
import { ReactNode } from "react";

function Layout({ children }: { children: ReactNode }) {
  const session = useSession();
  return (
    <>
      <nav>Bonjour {session.data?.user?.name}</nav>
      <main>{children}</main>
    </>
  );
}

export default Layout;
