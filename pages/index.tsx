// index.tsx
import { Container, Button, Box, Heading, Link } from "@chakra-ui/react";
import { getFirestore, collection, doc, setDoc } from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/clientApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(firebase);

interface ChildrenType {
  nickname: string;
}

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(getFirestore(firebase), `user/${user?.uid}`)
  );

  if (!usersnapshot?.exists && usersnapshot !== undefined) {
    setDoc(usersnapshot.ref, { children: [] });
  }

  const [childsnapshot, childLoading, childError] = useCollection(
    collection(getFirestore(firebase), "child")
  );

  // console.log the current user and loading status
  if (loading) {
    return "Laster";
  }

  console.log(user?.uid);

  return (
    <>
      <Box mb="5">Hello {user?.displayName}!</Box>
      <NextLink href="/child/create">
        <Button colorScheme="blue" mb="5">
          Opprett barn
        </Button>
      </NextLink>

      <Heading size="md">Dine barn</Heading>

      {childsnapshot?.docs.map((doc) => {
        return (
          <NextLink key={doc.id} href={`child/${doc.id}`}>
            <Link>{doc.data().nickname}</Link>
          </NextLink>
        );
      })}
    </>
  );
}
