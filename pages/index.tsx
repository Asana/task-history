import type { NextPage } from "next";
import { useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useSession } from "next-auth/client";
import { Router, useRouter } from "next/router";
import TaskForm from "../src/components/TaskForm";
import { Header } from "../src/components/Header";
import styled from "styled-components";
import logo from "./../public/logo512.png";
import Image from "next/image";

const HomeContainer = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  flex-direction: column;
`;

const SplashContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  border: 1px solid blue;
  width: 100%;
  flex: 1;
`;

const SplashImage = styled.div`
  grid-column: 1 / 8;
  grid-row: 1/ 13;
  border: 1px solid black;
`;

const SplashText = styled.div`
  grid-column: 8/ 13;
  grid-row: 1/ 13;
  border: 1px solid black;
  padding: 1rem;
`;

const LandingPage: NextPage = () => {
  const [session, sessionLoading] = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.replace("/home");
    }
  }, [session]);

  return (
    <HomeContainer>
      <Header />
      <SplashContainer>
        <SplashImage>
          <div> task history images</div>
          <Image src={logo} />
        </SplashImage>
        <SplashText>
          <div>
            <h2>Task History</h2>
            <p>
              the task history tool allows you to roll back edits to view a task
              as it existed during diffent periods of time
            </p>
            <p>sign in with asana to get started viewing your tasks:</p>
            <button
              onClick={() => {
                router.push("/signin");
              }}
            >
              Sign in with Asana
            </button>
          </div>
        </SplashText>

        <div></div>
      </SplashContainer>
    </HomeContainer>
  );
};

export default LandingPage;
