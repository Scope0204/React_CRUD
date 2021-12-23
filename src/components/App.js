import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { authService } from "../fbase";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(authService.currentUser);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      // console.log(auth, authService);
      if (user) {
        setIsLoggedIn(true);
        setUserObj(user); // 현재 유저정보를 저장
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={isLoggedIn} userObj={userObj} />
      ) : (
        "Initializing.. "
      )}
      <footer>&copy; {new Date().getFullYear()} Hello</footer>
    </>
  );
}

export default App;
