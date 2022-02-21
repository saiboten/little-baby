// auth.tsx
import React from "react";
import firebase from "../firebase/clientApp";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  updateDoc,
} from "firebase/firestore";

const feedList = [
  "Emma",
  "Nora/Norah",
  "Sofie/Sophie",
  "Ella",
  "Olivia",
  "Ada",
  "Sofia/Sophia",
  "Sara/Sarah/Zara",
  "Maja/Maia/Maya",
  "Ingrid",
  "Leah/Lea",
  "Emilie",
  "Amalie",
  "Frida",
  "Vilde",
  "Alma",
  "Hanna/Hannah",
  "Tiril/Tirill",
  "Mia",
  "Anna",
  "Selma",
  "Hedda",
  "Astrid/Astri",
  "Eva",
  "Lilly/Lily",
  "Jenny",
  "Mathilde/Matilde",
  "Aurora",
  "Thea/Tea",
  "Linnea/Linea",
  "Ida",
  "Amanda",
  "Live",
  "Julie",
  "Tuva",
  "Iben",
  "Ellinor",
  "Amelia",
  "Saga",
  "Oda",
  "Marie",
  "Victoria/Viktoria",
  "Eline",
  "Sigrid",
  "Julia",
  "Josefine/Josephine",
  "Maria",
  "Oline",
  "Agnes",
  "Kaja/Kaia",
  "Ellie",
  "Andrea",
  "Mari",
  "Klara/Clara",
  "Mille",
  "Johanne",
  "Emily",
  "Cornelia/Kornelia",
  "Solveig",
  "Ylva",
  "Signe",
  "Luna",
  "Ronja",
  "Sonja",
  "Erle",
  "Vilma/Wilma",
  "Liv",
  "Pernille",
  "Martine",
  "Hedvig",
  "Mathea",
  "Lovise/Louise",
  "Hennie",
  "Emilia",
  "Eira",
  "Elise",
  "Vilja",
  "Mie",
  "Thale/Tale",
  "Karoline/Caroline",
  "Mina",
  "Alva",
  "Sanna",
  "Tomine",
  "Isabella",
  "Ingeborg",
  "Ebba",
  "Sunniva",
  "Lotte",
  "Aria",
  "Johanna",
  "Helene",
  "Celine/Seline",
  "Frøya",
  "Mila",
  "Iris",
  "Madelen/Madeleine",
  "Lykke",
  "Elvira",
];

function Feeder() {
  const db = getFirestore();

  async function feed() {
    feedList.forEach(async (name) => {
      const res = await addDoc(collection(db, "names"), {
        name: name,
        isBoy: false,
      });

      await updateDoc(doc(db, "names", res.id), {
        id: res.id,
      });
    });
  }

  return (
    <div>
      <h1>Pineapple Login</h1>
      <button onClick={feed}>Legg til navn</button>
    </div>
  );
}

export default Feeder;
