import React from "react";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default () => {
  const auth = getAuth();
  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(auth);
    navigate("/");
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
