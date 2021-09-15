import { signIn, signOut, useSession } from "next-auth/client";
import styled from "styled-components";
import Image from "next/image";
import { profile } from "console";

const SignInButton = styled.button`
  height: 2rem;
`;

const ProfileName = styled.p`
  text-wrap: none;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  margin: 0.5rem;
`;

const ProfileImage = styled.img`
  max-height: 2rem;
  max-width: 2rem;
  border-radius: 50%;
`;

const HeadSignedIn = styled.div`
  display: flex;
  font-size: 10pt;
  align-items: center;
`;

const HeadWrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  background-color: rgba(37, 38, 40, 255);
  color: rgba(245, 244, 244, 255);
`;

const HeadTitle = styled.div`
  text-align: left;
  grid-column: 2 / 4;
`;

const HeadAccountInfo = styled.div`
  text-align: left;
  grid-column: 9 / 12;
  margin: auto;
`;

export function Header() {
  const [session, loading] = useSession();
  console.log(session);

  return (
    <HeadWrapper>
      <HeadTitle>
        <h2>🕰 Task History</h2>
      </HeadTitle>
      <HeadAccountInfo>
        {!session && (
          <div>
            <SignInButton onClick={() => signIn()}>Sign In</SignInButton>
          </div>
        )}
        {session && (
          <HeadSignedIn>
            <ProfileImage
              src={
                session?.user?.image ||
                "https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/200px-Question_mark_%28black%29.svg.png"
              }
            ></ProfileImage>
            <ProfileName>{session.user?.name}</ProfileName>
            <SignInButton onClick={() => signOut()}>Sign out</SignInButton>
          </HeadSignedIn>
        )}
      </HeadAccountInfo>
    </HeadWrapper>
  );
}
