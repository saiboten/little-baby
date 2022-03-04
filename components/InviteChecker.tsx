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
  inviteData,
  inviteId,
  user,
  userEmail,
}: {
  inviteId: string;
  inviteData: InviteType;
  user: UserType;
  userEmail: string;
}) {
  const db = getFirestore();

  const [childsnapshot] = useDocument(doc(db, `/child/${inviteId}`));
  const [usersnapshot] = useDocument(doc(db, `/user/${user.id}`));
  const [invitesnap] = useDocument(doc(db, `/invites/${inviteId}`));

  const [userSubcollectionSnapshot] = useDocument(
    doc(db, `child/${inviteId}/user/${user.id}`)
  );

  function acceptInvite() {
    // Add child to user list
    if (usersnapshot?.ref) {
      updateDoc(usersnapshot.ref, {
        children: [inviteId, ...(user.children ?? [])],
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
        parents: [inviteId, ...(childsnapshot?.data()?.parents ?? [])],
      });
    }

    if (userSubcollectionSnapshot?.ref) {
      setDoc(userSubcollectionSnapshot?.ref, { accepted: [], rejected: [] });
    }
  }

  const childData = childsnapshot?.data() as ChildType;
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
            inviteData={inviteData}
            inviteId={invite.id}
            user={user}
            userEmail={data?.email ?? ""}
          />
        );
      })}
    </div>
  );
}
