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
import { ChildType, UserType } from "../types/types";
import { Auth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";
import { Button } from "@chakra-ui/react";

function Invite({
  inviteData,
  user,
  userEmail,
}: {
  inviteData: DocumentData;
  user: UserType;
  userEmail: string;
}) {
  const db = getFirestore();
  const [childsnapshot] = useDocument(doc(db, `/child/${inviteData.id}`));
  const [usersnapshot] = useDocument(doc(db, `/user/${user.id}`));
  const [invitesnap] = useDocument(doc(db, `/invites/${inviteData.id}`));

  const [userSubcollectionSnapshot] = useDocument(
    doc(db, `child/${inviteData.id}/user/${user.id}`)
  );

  function acceptInvite() {
    // Add child to user list
    if (usersnapshot?.ref) {
      updateDoc(usersnapshot.ref, {
        children: [inviteData.id, ...user.children],
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
        parents: [inviteData.id, ...childsnapshot?.data()?.parents],
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
      {invites?.docs.map((invite) => (
        <Invite
          key={invite.id}
          inviteData={invite.data()}
          user={user}
          userEmail={data?.email ?? ""}
        />
      ))}
    </div>
  );
}
