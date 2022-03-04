import "../styles/globals.css";
import {
  ChakraProvider,
  Link,
  Container,
  Box,
  Button,
  Divider,
} from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth, signOut } from "@firebase/auth";
import type { AppProps } from "next/app";
import { addDoc, getDoc, doc, setDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import { getFirestore } from "firebase/firestore";
import NextLink from "next/link";
import firebase from "../firebase/clientApp";
import { UserType } from "../types/types";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";
import { InviteChecker } from "../components/InviteChecker";
import { ProvidedLoader } from "../components/ProvidedLoader";

const auth = getAuth(firebase);

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);

  const [redirect, setRedirect] = useState(false);
  // const [authState, setAuthState] = useState("");

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
    doc(getFirestore(), `user/${user?.uid}`)
  );

  const authStateChanged = useCallback(
    () => async (authState: any) => {
      async function createUser(userId: string) {
        await setDoc(doc(getFirestore(), `user/${userId}`), {
          children: [],
          id: userId,
        });
      }

      // setAuthState(JSON.stringify(authState));
      if (authState === null) {
        setRedirect(true);
      } else {
        const userDoc = await getDoc(doc(getFirestore(), `/user/${user?.uid}`));
        if (!userDoc.exists()) {
          if (user?.uid) {
            createUser(user?.uid);
          }
        }
      }
    },
    [user?.uid]
  );

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(authStateChanged());
    return authListener;
  }, [authStateChanged]);

  if (userLoading) {
    return (
      <>
        <ProvidedLoader />
      </>
    );
  }

  const userData = usersnapshot?.data() as UserType;

  if (!userData && window.location.href.indexOf("auth") === 0) {
    return (
      <>
        <ProvidedLoader />
      </>
    );
  }
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
        <Box>Logged inn som {user?.email ?? "Ukjent"}</Box>
        <Button onClick={logout} mr="2">
          Logg ut
        </Button>
        <NextLink href="/">
          <Link>Tilbake til forsiden</Link>
        </NextLink>
        <Box mb="5" />
        <Divider />
        <Box mb="5" />
        <Component userData={userData} user={user} {...pageProps} />
      </Container>
    </ChakraProvider>
  );
}

export default MyApp;
