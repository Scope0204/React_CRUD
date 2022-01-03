import React, { useEffect, useState } from "react";
import { getAuth, signOut, updateProfile } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where } from "firebase/firestore";
import { dbService } from "../fbase";

export default ({ userObj }) => {
  const auth = getAuth();
  const navigate = useNavigate();
  const onLogOutClick = () => {
    signOut(auth);
    navigate("/");
  };
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);

  const getMyNweets = async () => {
    const q = query(
      collection(dbService, "nweets"),
      where("creatorId", "==", userObj.uid)
    );
    const querySnapshot = await getDocs(q);
    // console.log(querySnapshot.docs.map((doc) => doc.data()));
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());
    });
  };

  useEffect(() => {
    getMyNweets();
  }, []);

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();
    if (userObj.displayName !== newDisplayName) {
      // profile을 수정하여 닉네임이 바뀌었을 때, 변경 사항을 저장한다.
      await updateProfile(userObj, {
        displayName: newDisplayName,
      });
    }
  };
  return (
    <>
      <form onSubmit={onSubmit}>
        <input
          onChange={onChange}
          type="text"
          placeholder="Display name"
          value={newDisplayName}
        />
        <input type="submit" value="Update Profile" />
      </form>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};
