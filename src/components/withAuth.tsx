import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import type { NextPage } from "next";
import { Header } from "./Header";

const withAuth =
  <P extends object>(WrappedComponent: NextPage<P>): React.FC<P> =>
  (props) => {
    const [session, sessionLoading] = useSession();
    const Router = useRouter();

    useEffect(() => {
      if (typeof session?.accessToken !== "string") {
        Router.replace("/");
        return;
      }
    }, []);

    return <WrappedComponent {...(props as P)} />;
  };

export default withAuth;
