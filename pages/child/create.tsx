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
import { useRouter } from "next/router";

export default function Child() {
  const [name, setName] = useState("");
  const [gender, setGender] = useState<"boy" | "girl" | "other">("boy");

  const router = useRouter();

  function submitForm(e: React.SyntheticEvent) {
    e.preventDefault();

    // TODO: 1: Add child
    // 2: add child on user
    // 3: redirect
    // router.push(`/child/${newChildId}`);
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
