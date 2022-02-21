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
  useCollection,
} from "react-firebase-hooks/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast, Button, Box, ButtonGroup } from "@chakra-ui/react";

// Import the useAuthStateHook
import { useAuthState } from "react-firebase-hooks/auth";
import { getAuth } from "@firebase/auth";
import { PageProps, UserType } from "../../types/types";

const auth = getAuth(firebase);

interface NameType {
  name: string;
  isBoy: boolean;
  id: string;
}

export default function ChosenNames({ userData }: PageProps) {
  const router = useRouter();
  const { id } = router.query;

  const db = getFirestore();

  const [childData, childLoading, childError] = useDocumentData(
    doc(getFirestore(firebase), `child/${id}`)
  );

  const [
    childUserSubcollectionData,
    childUserSubcollectionLoading,
    childUserSubcollectionError,
  ] = useDocumentData(
    doc(getFirestore(firebase), `child/${id}/user/${userData.id}`)
  );

  const namesRef = collection(db, "names");

  const [acceptedNames, namesLoading, namesError] = useCollection(
    query(
      namesRef,
      where(
        "id",
        "in",
        childUserSubcollectionData?.accepted &&
          childUserSubcollectionData?.accepted.length > 0
          ? childUserSubcollectionData?.accepted
          : ["nope"]
      )
    )
  );

  const [rejectedNames, rejectedNamesLoading, rejectedNamesError] =
    useCollection(
      query(
        namesRef,
        where(
          "id",
          "in",
          childUserSubcollectionData?.rejected &&
            childUserSubcollectionData?.rejected.length > 0
            ? childUserSubcollectionData?.rejected
            : ["nope"]
        )
      )
    );

  if (namesLoading || rejectedNamesLoading || childLoading) {
    return "Laster";
  }

  if (namesError || rejectedNamesError || childError) {
    return "Feil!";
  }

  return (
    <div>
      <NextLink href={`/child/${childData?.id}`}>
        <Link>Tilbake til {childData?.nickname}</Link>
      </NextLink>
      <h1>Flotte navn</h1>
      {acceptedNames?.docs.map((el) => (
        <div>{el.data().name}</div>
      ))}
      <h1>Fæle navn</h1>
      {rejectedNames?.docs.map((el) => (
        <div>{el.data().name}</div>
      ))}
    </div>
  );
}
