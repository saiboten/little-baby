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
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { InviteChecker } from "../components/InviteChecker";
import { ProvidedLoader } from "../components/ProvidedLoader";

const auth = getAuth(firebase);

function MyApp({ Component, pageProps }: AppProps) {
  const [user] = useAuthState(auth);

  const db = getFirestore();

  const [redirect, setRedirect] = useState(false);
  const [authState, setAuthState] = useState("");

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

  async function createUser(userId: string) {
    await setDoc(doc(db, `user/${userId}`), {
      children: [],
      id: userId,
    });
  }

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(db, `user/${user?.uid}`)
  );

  const authStateChanged = async (authState: any) => {
    setAuthState(JSON.stringify(authState));
    if (authState === null) {
      setRedirect(true);
    } else {
      const userDoc = await getDoc(doc(db, `/user/${user?.uid}`));
      if (!userDoc.exists()) {
        if (user?.uid) {
          createUser(user?.uid);
        }
      }
    }
  };

  useEffect(() => {
    const authListener = auth.onAuthStateChanged(authStateChanged);
    return authListener;
  }, []);

  if (userLoading) {
    return <ProvidedLoader />;
  }

  const userData = usersnapshot?.data() as UserType;

  if (!userData && window.location.href.indexOf("auth") === 0) {
    return (
      <>
        {userError}
        {authState}
        <ProvidedLoader />
      </>
    );
  }
  return (
    <ChakraProvider>
      {userError}
      {authState}
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
