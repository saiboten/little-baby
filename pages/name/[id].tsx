// index.tsx
import { Container, Heading, Link } from "@chakra-ui/react";
import {
  doc,
  setDoc,
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
import { getFirestore } from "firebase/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast, Button, Box, ButtonGroup } from "@chakra-ui/react";
import {
  ChildType,
  ChildUserSubCollectionType,
  PageProps,
  UserType,
} from "../../types/types";
import { User } from "@firebase/auth";

export default function Name({ userData }: PageProps) {
  const router = useRouter();
  const { id } = router.query;

  const toast = useToast();

  const db = getFirestore();

  const [childsnapshot, childLoading, childError] = useDocument(
    doc(db, `child/${id}`)
  );

  const [
    userSubcollectionSnapshot,
    userSubcollectionLoading,
    userSubcolletionError,
  ] = useDocument(doc(db, `child/${id}/user/${userData.id}`));

  const ref = userSubcollectionSnapshot?.ref;

  useEffect(() => {
    if (ref === undefined) {
      return;
    }

    if (!userSubcollectionSnapshot?.exists()) {
      setDoc(ref, { accepted: [], rejected: [] });
    }
  }, [ref]);

  const childData = childsnapshot?.data() as ChildType;
  const childUserData =
    userSubcollectionSnapshot?.data() as ChildUserSubCollectionType;

  const [names, namesLoading, namesError] = useCollectionData(
    query(
      collection(getFirestore(firebase), "names"),
      where("isBoy", "==", childData?.isBoy ?? false)
    )
  );

  if (childLoading || namesLoading) {
    return "Laster";
  }

  if (childError || namesError) {
    return "Fant ikke barn";
  }

  const eligableNames =
    names?.filter(
      (el) =>
        !(
          childUserData.accepted?.includes(el.id) ||
          childUserData.rejected?.includes(el.id)
        )
    ) ?? [];

  const currentName = eligableNames[0];

  function rejectCurrentName() {
    if (userSubcollectionSnapshot !== undefined) {
      updateDoc(userSubcollectionSnapshot?.ref, {
        rejected: [currentName.id, ...childUserData.rejected],
      });
      toast({
        title: "Niks",
        status: "error",
        duration: 3000,
      });
    }
  }

  function acceptCurrentName() {
    if (userSubcollectionSnapshot !== undefined) {
      updateDoc(userSubcollectionSnapshot?.ref, {
        accepted: [currentName.id, ...childUserData.accepted],
      });
      toast({
        title: "Jepp.",
        status: "success",
        duration: 3000,
      });
    }
  }

  return (
    <>
      <Heading size="sm">Finn et navn til {childData?.nickname} i dag!</Heading>
      {currentName === undefined ? (
        <Box>Fant ingen navn</Box>
      ) : (
        <>
          <Box>Hva med {currentName.name}?</Box>

          <ButtonGroup>
            <Button onClick={acceptCurrentName}>Ja!</Button>
            <Button onClick={rejectCurrentName}>Nei.</Button>
          </ButtonGroup>
        </>
      )}
    </>
  );
}
