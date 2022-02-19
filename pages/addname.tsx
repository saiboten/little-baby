import { useState } from "react";

export default function AddName() {
  const [name, setName] = useState("");
  const [isBoy, setIsBoy] = useState(false);

  function storeName() {
    // Add name get id
    // store id on name
    // reset name
    setName("");
  }

  return <div>Hei</div>;
}
