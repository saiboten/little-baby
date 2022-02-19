// index.tsx
import { Container, Heading, Link } from "@chakra-ui/react";
import {
  getFirestore,
  doc,
  updateDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
  useDocument,
} from "react-firebase-hooks/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast, Button, Box, ButtonGroup } from "@chakra-ui/react";

// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { UserType } from "../../types/types";

const auth = getAuth(firebase);

interface NameType {
  name: string;
  isBoy: boolean;
  id: string;
}

export default function ChosenNames() {
  const router = useRouter();
  const { id } = router.query;

  const [user] = useAuthState(auth);

  const toast = useToast();

  const [userdata, userLoading, userError] = useDocumentData(
    doc(getFirestore(firebase), `user/${user?.uid}`)
  );

  const [childData, childLoading, childError] = useDocumentData(
    doc(getFirestore(firebase), `child/${id}`)
  );

  return <div>Hei</div>;
}
