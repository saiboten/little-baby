import { Link, UnorderedList, ListItem, Heading } from "@chakra-ui/react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import NextLink from "next/link";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { useCallback, useEffect, useState } from "react";
import {
  ChildUserSubCollectionType,
  PageProps,
  ChildType,
} from "../../types/types";
import { Name } from "../../components/Name";

interface NameType {
  name: string;
  isBoy: boolean;
  id: string;
}

async function getAllAcceptedNames(
  parentId: string,
  childId: string
): Promise<string[]> {
  const db = getFirestore();

  const raw = await getDoc(doc(db, `/child/${childId}/user/${parentId}`));
  const data = raw.data();

  const subcollection = data as ChildUserSubCollectionType;
  return subcollection?.accepted;
}

export default function ChosenNames({ userData }: PageProps) {
  const router = useRouter();
  const { id } = router.query;
  const [acceptedNames, setAcceptedNames] = useState<string[]>([]);

  const [childDataRaw, childLoading, childError] = useDocumentData(
    doc(getFirestore(firebase), `child/${id}`)
  );

  // childData
  const childData = childDataRaw as ChildType;

  const length = childData?.parents.length ?? 0;
  const childId = childData?.id ?? "";
  const parentsStringified = JSON.stringify(childData?.parents ?? []);

  const value = useCallback(async () => {
    const parents: string[] = JSON.parse(parentsStringified);
    if (!length || !childId) {
      return;
    }
    const allnames = parents.map(async (parent) => {
      return await getAllAcceptedNames(parent, childId);
    });

    const names = await Promise.all(allnames);
    const common = names.reduce((p, c) => p.filter((e) => c.includes(e)));

    setAcceptedNames(common);
  }, [length, childId, parentsStringified]);

  useEffect(() => {
    value();
  }, [value]);

  if (childLoading) {
    return "Laster";
  }

  if (childError) {
    return "Noe gikk galt";
  }

  return (
    <div>
      <NextLink href={`/child/${childData?.id}`}>
        <Link>Tilbake til {childData?.nickname}</Link>
      </NextLink>
      <Heading size="md">Felles navn</Heading>
      <UnorderedList>
        {acceptedNames.map((el) => (
          <ListItem key={el}>
            <Name id={el} />
          </ListItem>
        ))}
      </UnorderedList>
    </div>
  );
}
