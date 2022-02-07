// auth.tsx
import React from "react";
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth";
import firebase from "../firebase/clientApp";
import { getAuth, GoogleAuthProvider } from "@firebase/auth";

// Configure FirebaseUI.
const uiConfig = {
  // Redirect to / after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  signInSuccessUrl: "/",
  // GitHub as the only included Auth Provider.
  // You could add and configure more here!
  signInOptions: [GoogleAuthProvider.PROVIDER_ID],
};

function SignInScreen() {
  return (
    <div>
      <h1>Pineapple Login</h1>
      <p>Please sign-in:</p>
      <StyledFirebaseAuth
        uiConfig={uiConfig}
        firebaseAuth={getAuth(firebase)}
      />
    </div>
  );
}

export default SignInScreen;
