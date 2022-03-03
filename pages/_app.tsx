import "../styles/globals.css";
import { ChakraProvider, Link, Container, Box, Button } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "@firebase/auth";
import type { AppProps } from "next/app";
import { doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore } from "firebase/firestore";
import NextLink from "next/link";
import firebase from "../firebase/clientApp";
import { UserType } from "../types/types";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { InviteChecker } from "../components/InviteChecker";

const auth = getAuth(firebase);

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);

  const db = getFirestore();

  const [redirect, setRedirect] = useState(false);

  const router = useRouter();

  useEffect(() => {
    if (redirect) {
      router.push("/auth");
    }
    setRedirect(false);
  }, [redirect, router]);

  function logout() {
    signOut(auth)
      .then(() => {
        // console.log("what now");
      })
      .catch((error) => {
        // An error happened.
      });
  }

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(db, `user/${user?.uid}`)
  );

  const authStateChanged = async (authState: any) => {
    if (authState === null) {
      setRedirect(true);
    }
  };

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(authStateChanged);
    return authListener;
  }, []);

  const usersnapRef = usersnapshot?.ref;
  const usersnapshotExists = usersnapshot?.exists();
  const userId = user?.uid ?? "";

  useEffect(() => {
    if (!usersnapshotExists && usersnapRef) {
      setDoc(usersnapRef, {
        children: [],
        id: userId,
      });
    }
  }, [usersnapRef, usersnapshotExists, userId]);

  if (userLoading) {
    return (
      <Container
        mt="10"
        border="1px solid"
        borderColor="blue.500"
        padding="5"
        borderRadius="10px"
      >
        Laster
      </Container>
    );
  }

  const userData = usersnapshot?.data() as UserType;

  return (
    <ChakraProvider>
      <InviteChecker user={userData} auth={auth} />
      <Container
        mt="10"
        border="1px solid"
        borderColor="blue.500"
        padding="5"
        borderRadius="10px"
      >
        <Button onClick={logout}>Logg ut</Button>
        <NextLink href="/">
          <Link>Tilbake til forsiden</Link>
        </NextLink>
        <Box mb="5" />
        <Component userData={userData} user={user} {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;
