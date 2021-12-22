import React, { useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), {
        nweet,
        createAt: Date.now(),
      });
      console.log("document written with ID :", docRef.id);
    } catch (err) {
      console.log(err);
    }
    setNweet(""); //등록 시 입력폼에 값 초기화
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          value={nweet}
          type="text"
          placeholder="무엇을 할까요"
          maxLength={120}
          onChange={onChange}
        />
        <input type="submit" value="NWeet" />
      </form>
    </div>
  );
};
export default Home;
