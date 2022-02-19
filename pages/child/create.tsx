import {
  Heading,
  Input,
  FormControl,
  FormLabel,
  Stack,
  Radio,
  RadioGroup,
  Button,
  Box,
} from "@chakra-ui/react";
import React, { useState } from "react";
import {
  addDoc,
  updateDoc,
  doc,
  getFirestore,
  collection,
} from "@firebase/firestore";
import { useRouter } from "next/router";
import { useAuthState } from "react-firebase-hooks/auth";
import { useDocument } from "react-firebase-hooks/firestore";
import firebase from "../../firebase/clientApp";
import { getAuth } from "@firebase/auth";
import { UserType } from "../../types/types";

const auth = getAuth(firebase);

export default function Child() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | "other">("boy");

  const router = useRouter();

  const [user, loading, error] = useAuthState(auth);

  const [usersnapshot, userLoading, userError] = useDocument(
    doc(getFirestore(firebase), `user/${user?.uid}`)
  );

  const userData = usersnapshot?.data() as UserType;

  async function submitForm(e: React.SyntheticEvent) {
    e.preventDefault();

    const docRef = await addDoc(collection(getFirestore(firebase), "child"), {
      isBoy: gender === "boy" ? true : false,
      nickname: name,
      owner: user?.uid,
      parents: [user?.uid],
    });

    // 2: add child on user
    const existingChildren = userData.children ?? [];

    const newChildrenList = [docRef.id, ...existingChildren];

    if (usersnapshot?.ref !== undefined) {
      updateDoc(usersnapshot.ref, {
        children: newChildrenList,
      });
    }

    // 3: redirect
    router.push(`/child/${docRef.id}`);
  }

  if (loading || userLoading) {
    return "Laster";
  }

  if (userError || error) {
    return "Noe gikk galt";
  }

  return (
    <form onSubmit={submitForm}>
      <Box mb="10">
        <FormControl>
          <FormLabel htmlFor="name">Hva skal barnet hete?</FormLabel>
          <Input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
        </FormControl>
      </Box>

      <Box mb="5">
        <FormControl>
          <FormLabel htmlFor="email">Gutt eller jente?</FormLabel>
          <RadioGroup
            onChange={(e) => {
              if (e === "boy" || e === "girl" || e === "other") {
                setGender(e);
              }
            }}
            value={gender}
          >
            <Stack direction="row">
              <Radio value="boy">Gutt</Radio>
              <Radio value="girl">Jente</Radio>
              <Radio value="other">Annet</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
      </Box>

      <Button type="submit">Lagre</Button>
    </form>
  );
}
