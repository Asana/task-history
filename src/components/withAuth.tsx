import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useSession } from "next-auth/client";
import type { NextPage } from "next";
import { Login } from "./Login";

const withAuth =
  <P extends object>(WrappedComponent: NextPage<P>): React.FC<P> =>
  (props) => {
    const [session, sessionLoading] = useSession();
    const Router = useRouter();

    useEffect(() => {
      if (typeof session?.accessToken !== "string") {
        Router.replace("/signin");
        return;
      }
    }, [session]);

    return (
      <div>
        <Login />
        <WrappedComponent {...(props as P)} />
      </div>
    );
  };

export default withAuth;
