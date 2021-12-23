import React from "react";
import { doc, deleteDoc, updateDoc } from "firebase/firestore";
import { useState } from "react/cjs/react.development";
import { dbService } from "../fbase";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // edit모드인지 아닌지
  const [newNweet, setNewNweet] = useState(nweetObj.text); // input에 입력된 text를 업데이트

  const NweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);

  const onDeleteClick = async () => {
    const ok = window.confirm("정말로 삭제하시겠습니까?");
    console.log(ok); // 확인 시 ture 반환
    if (ok) {
      //delete
      await deleteDoc(NweetTextRef);
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    console.log(nweetObj, newNweet);
    //update
    await updateDoc(NweetTextRef, {
      text: newNweet,
    });

    setEditing(false); // update 후 편집창을 닫음
  };
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNewNweet(value);
  };
  return (
    <div>
      {editing ? (
        <>
          <form onSubmit={onSubmit}>
            <input
              type="text"
              placeholder="Edit your Nweet"
              value={newNweet}
              required
              onChange={onChange}
            />
            <input type="submit" value="Update" />
          </form>
          <button onClick={toggleEditing}>Cancel</button>
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <>
              <button onClick={onDeleteClick}>Delete Nweet</button>
              <button onClick={toggleEditing}>Edit Nweet</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;
