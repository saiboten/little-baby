import { getFirestore, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";
import { NameType } from "../types/types";

interface NameProps {
  id: string;
}

export function Name({ id }: NameProps) {
  const [data, loading, error] = useDocumentData(
    doc(getFirestore(), `names/${id}`)
  );
  if (loading) {
    return <span>Laster</span>;
  }

  if (error) {
    return <span>Noe gikk galt</span>;
  }

  const name = data as NameType;

  return <span>{name?.name ?? "-"}</span>;
}
