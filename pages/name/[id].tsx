// index.tsx
import { Container, Heading, Link } from "@chakra-ui/react";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import {
  useDocumentData,
  useCollectionData,
} from "react-firebase-hooks/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useToast, Button, Box, ButtonGroup } from "@chakra-ui/react";

interface NameType {
  name: string;
  isBoy: boolean;
  nameId: string;
}

export default function Name() {
  const router = useRouter();
  const { id } = router.query;

  const toast = useToast();

  const [childData, childLoading, childError] = useDocumentData(
    doc(getFirestore(firebase), `child/${id}`)
  );

  const [names, namesLoading, namesError] = useCollectionData(
    query(
      collection(getFirestore(firebase), "names"),
      where("isBoy", "==", childData?.isBoy ?? false)
    )
  );

  const [currentName, setCurrentName] = useState<NameType | undefined>();

  function rejectCurrentName() {
    toast({
      title: "Niks",
      status: "error",
      duration: 3000,
    });
  }

  function acceptCurrentName() {
    toast({
      title: "Jepp.",
      status: "success",
      duration: 3000,
    });
  }

  useEffect(() => {
    if (names && names.length > 0) {
      setCurrentName({ nameId: "", isBoy: true, name: "", ...names[0] });
    }
  }, [names]);

  if (childLoading) {
    return "Laster";
  }

  if (childError) {
    return "Fant ikke barn";
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
