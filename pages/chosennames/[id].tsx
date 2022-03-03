// index.tsx
import { Heading, Link, UnorderedList, ListItem } from "@chakra-ui/react";
import {
  getFirestore,
  doc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { useDocumentData, useCollection } from "react-firebase-hooks/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";

// Import the useAuthStateHook
import { ChildUserSubCollectionType, PageProps } from "../../types/types";
import { Name } from "../../components/Name";

export default function ChosenNames({ user }: PageProps) {
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
    doc(getFirestore(firebase), `child/${id}/user/${user.uid}`)
  );

  if (
    childLoading ||
    childUserSubcollectionLoading ||
    childUserSubcollectionError
  ) {
    return "Laster";
  }

  if (childError) {
    return "Feil!";
  }

  const childNameLists =
    childUserSubcollectionData as ChildUserSubCollectionType;

  return (
    <div>
      <NextLink href={`/child/${childData?.id}`}>
        <Link>Tilbake til {childData?.nickname}</Link>
      </NextLink>
      <Heading>Flotte navn</Heading>
      <UnorderedList>
        {childNameLists.accepted?.map((el) => (
          <ListItem key={el}>
            <Name id={el} />
          </ListItem>
        ))}
      </UnorderedList>
      <Heading>Fæle navn</Heading>
      <UnorderedList>
        Kommer snart
        {/* {childNameLists.rejected?.map((el) => (
          <ListItem key={el}>
            <Name id={el} />
          </ListItem>
        ))} */}
      </UnorderedList>
    </div>
  );
}
