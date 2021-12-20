import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      console.log(auth, authService);
      if (user) {
        setIsLoggedIn(true);
        const uid = user.uid;
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : "Initializing.. "}
      <footer>&copy; {new Date().getFullYear()} Hello</footer>
    </>
  );
}

export default App;
