import type { NextPage } from "next";
import { useSession } from "next-auth/client";
import { useRouter } from "next/router";
import TaskForm from "../src/components/TaskForm";
import withAuth from "../src/components/withAuth";
import { Header } from "../src/components/Header";
import styled from "styled-components";

const HomeContainer = styled.div`
  display: flex;
  min-height: 100vh;
  min-width: 100vw;
  flex-direction: column;
`;

const Home: NextPage = () => {
  const [session, sessionLoading] = useSession();
  const router = useRouter();

  const handleTaskIdChange = async (id: string) => {
    if (id === "") {
    } else {
      router.push(`/task/${id}`);
    }
  };

  return (
    <HomeContainer>
      <Header />

      <main>
        <TaskForm setTaskId={handleTaskIdChange} />
      </main>
    </HomeContainer>
  );
};

export default withAuth(Home);
