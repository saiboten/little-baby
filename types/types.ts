import { User } from "@firebase/auth"

export type UserType = {
    children: string[]
    id: string;
}

interface ResponseType {
    [id: string]: string[];
}

export type ChildType = {
    isBoy: boolean;
    nickname: string;
    owner: string;
    parents: string[];
    id: string;
}

export type NameType = {
    id: string;
    isBoy: boolean;
    name: string;
}

export type InviteType = {
    emails: string[];
}

export interface PageProps {
    userData: UserType;
    user: User
  }

  export type ChildUserSubCollectionType = {
      accepted: string[];
      rejected: string[];
  }