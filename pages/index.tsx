// index.tsx
import {
  Container,
  Button,
  Box,
  Heading,
  Link,
  List,
  ListItem,
  ListIcon,
  OrderedList,
  UnorderedList,
} from "@chakra-ui/react";
import {
  where,
  getFirestore,
  collection,
  doc,
  setDoc,
  query,
} from "firebase/firestore";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";
import Head from "next/head";
import Image from "next/image";
import NextLink from "next/link";
import styles from "../styles/Home.module.css";
import firebase from "../firebase/clientApp";
import { getAuth, onAuthStateChanged } from "firebase/auth";

// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { useEffect } from "react";
import { UserType } from "../types/types";
import { DefaultLoader } from "../components/DefaultLoader";

const auth = getAuth(firebase);

interface ChildrenType {
  nickname: string;
}

export default function Home() {
  const [user, loading, error] = useAuthState(auth);

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(getFirestore(firebase), `user/${user?.uid}`)
  );

  const usersnapshotExists = usersnapshot?.exists();
  const usersnapshotRef = usersnapshot?.ref;

  useEffect(() => {
    if (!usersnapshotExists && usersnapshotRef) {
      setDoc(usersnapshotRef, { children: [] });
    }
  }, [usersnapshotExists, usersnapshotRef]);

  const childRef = collection(getFirestore(), "child");

  const userData = usersnapshot?.data() as UserType;

  const [childsnapshot, childLoading, childError] = useCollection(
    query(childRef, where("parents", "array-contains", user?.uid))
  );

  if (loading || childLoading) {
    return <DefaultLoader />;
  }

  return (
    <>
      <Box mb="5">Hello {user?.displayName}!</Box>
      <NextLink href="/child/create">
        <Button colorScheme="blue" mb="5">
          Opprett barn
        </Button>
      </NextLink>

      {childsnapshot?.docs?.length ?? 0 > 0 ? (
        <>
          <Heading size="md">Dine barn</Heading>

          <UnorderedList>
            {childsnapshot?.docs.map((doc) => {
              return (
                <ListItem key={doc.id}>
                  <NextLink key={doc.id} href={`child/${doc.id}`}>
                    <Link>{doc.data().nickname}</Link>
                  </NextLink>
                </ListItem>
              );
            })}
          </UnorderedList>
        </>
      ) : null}
    </>
  );
}
