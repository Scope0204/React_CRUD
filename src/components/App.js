import React, { useEffect, useState } from "react";
import AppRouter from "./Router";
import { getAuth, onAuthStateChanged } from "firebase/auth";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, (user) => {
      if (user) {
        if (user.displayName == null) {
          const name = user.email.split("@")[0];
          user.displayName = name; // 깃 로그인 시 displayName이 null로 되어있음
        }
        setUserObj(user); // 현재 유저정보를 저장
      }
      setInit(true);
    });
  }, []);

  return (
    <>
      {init ? (
        <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} />
      ) : (
        "Initializing.. "
      )}
      <footer>&copy; {new Date().getFullYear()} Hello</footer>
    </>
  );
}

export default App;
