import {
  useCollection,
  useDocument,
  useDocumentData,
} from "react-firebase-hooks/firestore";
import {
  collection,
  doc,
  DocumentData,
  getFirestore,
  query,
  updateDoc,
  where,
  setDoc,
} from "firebase/firestore";
import { ChildType, InviteType, UserType } from "../types/types";
import { Auth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@chakra-ui/react";

function Invite({
  inviteId,
  userUid,
  userEmail,
}: {
  inviteId: string;
  userUid?: string;
  userEmail: string;
}) {
  const db = getFirestore();

  const [childsnapshot] = useDocument(doc(db, `/child/${inviteId}`));
  const [usersnapshot] = useDocument(doc(db, `/user/${userUid}`));
  const [invitesnap] = useDocument(doc(db, `/invites/${inviteId}`));

  const [userSubcollectionSnapshot] = useDocument(
    doc(db, `child/${inviteId}/user/${userUid}`)
  );

  const userData = usersnapshot?.data() as UserType;

  function acceptInvite() {
    // Add child to user list

    if (usersnapshot?.ref) {
      updateDoc(usersnapshot.ref, {
        children: [inviteId, ...(userData.children ?? [])],
      });
    }
    if (invitesnap?.ref) {
      updateDoc(invitesnap?.ref, {
        emails: invitesnap
          ?.data()
          ?.emails.filter((el: string) => el !== userEmail),
      });
    }

    if (childsnapshot?.ref) {
      updateDoc(childsnapshot.ref, {
        parents: [userUid, ...(childsnapshot?.data()?.parents ?? [])],
      });
    }

    if (userSubcollectionSnapshot?.ref) {
      // setDoc(userSubcollectionSnapshot?.ref, { accepted: [], rejected: [] });
    }
  }

  const childData = childsnapshot?.data() as ChildType;

  if (!userUid) {
    return null;
  }

  return (
    <div>
      Invite til {childData?.nickname}
      <Button onClick={acceptInvite}>Godta</Button>
    </div>
  );
}

export function InviteChecker({ user, auth }: { user: UserType; auth: Auth }) {
  const invitesRef = collection(getFirestore(), "invites");
  const [data] = useAuthState(auth);
  const [invites] = useCollection(
    query(invitesRef, where("emails", "array-contains", data?.email ?? ""))
  );

  return (
    <div>
      {invites?.docs.map((invite) => {
        const inviteData = invite.data() as InviteType;

        return (
          <Invite
            key={invite.id}
            inviteId={invite.id}
            userUid={data?.uid}
            userEmail={data?.email ?? ""}
          />
        );
      })}
    </div>
  );
}
