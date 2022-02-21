import {
  Button,
  Heading,
  Link,
  ButtonGroup,
  useBoolean,
  Checkbox,
} from "@chakra-ui/react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "../../firebase/clientApp";
import { useRouter } from "next/router";
import { ChildType } from "../../types/types";

interface ChildrenType {
  nickname: string;
}

export default function Home() {
  const router = useRouter();
  const { id } = router.query;

  const [childRef, childLoading, childError] = useDocument(
    doc(getFirestore(firebase), `child/${id}`)
  );

  const childData = childRef?.data() as ChildType;

  function checkGender(value: boolean) {
    if (childRef !== undefined) {
      updateDoc(childRef.ref, { isBoy: value });
    }
  }

  if (childError) {
    return "Noe gikk galt";
  }

  if (childLoading) {
    return "Laster";
  }

  return (
    <>
      <Heading size="sm" mb="5">
        {childData?.nickname}
      </Heading>
      <ButtonGroup>
        <Checkbox
          onChange={(e) => checkGender(e.target.checked)}
          name="gender"
          defaultIsChecked={childData?.isBoy}
        >
          Gutt?
        </Checkbox>

        <Link href={`/invitepartner/${id}`}>
          <Button>Inviter partner</Button>
        </Link>
        <Link href={`/chosennames/${id}`}>
          <Button>Se dine navnevalg</Button>
        </Link>

        <Link href={`/chosennamescommon/${id}`}>
          <Button>Se felles navn</Button>
        </Link>

        <Link href={`/name/${id}`}>
          <Button>Finn navn</Button>
        </Link>
      </ButtonGroup>
    </>
  );
}
