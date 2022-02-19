import "../styles/globals.css";
import { ChakraProvider, Link, Container, Box } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import type { AppProps } from "next/app";
// index.tsx
import { doc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore } from "firebase/firestore";
import NextLink from "next/link";
import firebase from "../firebase/clientApp";
import { UserType } from "../types/types";

const auth = getAuth(firebase);

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);

  const db = getFirestore();

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(db, `user/${user?.uid}`)
  );

  if (!user || userLoading) {
    return "Loading";
  }

  const userData = usersnapshot?.data() as UserType;

  return (
    <ChakraProvider>
      <Container
        mt="10"
        border="1px solid"
        borderColor="blue.500"
        padding="5"
        borderRadius="10px"
      >
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
