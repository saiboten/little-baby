// auth.tsx
import React, { useState } from "react";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useDocument, useDocumentData } from "react-firebase-hooks/firestore";
import { InviteType } from "../../types/types";
import { Input, Button } from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";

function InvitePartner() {
  const db = getFirestore();
  const router = useRouter();
  const { id } = router.query;

  const [email, setEmail] = useState("");

  const [inviteRef, inviteLoading, inviteError] = useDocument(
    doc(db, `/invites/${id}`)
  );

  const invites = inviteRef?.data() as InviteType;

  function addInvite(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (inviteRef?.ref !== undefined) {
      updateDoc(inviteRef.ref, {
        emails: [email, ...invites.emails],
      });
      setEmail("");
    }
  }

  function deleteInvite(email: string) {
    if (inviteRef?.ref !== undefined) {
      updateDoc(inviteRef.ref, {
        emails: invites.emails.filter((el) => el !== email),
      });
    }
  }

  if (inviteLoading) {
    return "Loading";
  }

  if (inviteError) {
    return "Error";
  }

  return (
    <div>
      <h1>Inviter partner</h1>

      <form onSubmit={addInvite}>
        <Input
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button type="submit">Lagre</Button>
      </form>

      {invites?.emails.map((email) => (
        <div>
          {email}
          <Button
            onClick={() => deleteInvite(email)}
            leftIcon={<DeleteIcon />}
            colorScheme="teal"
            variant="solid"
          >
            Slett invitasjon
          </Button>
        </div>
      ))}
    </div>
  );
}

export default InvitePartner;
