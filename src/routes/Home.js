import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import Nweet from "../components/Nweet";

const Home = ({ userObj }) => {
  //   console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  useEffect(() => {
    const q = query(collection(dbService, "nweets"));
    onSnapshot(q, (snapshot) => {
      const nweetArr = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArr);
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      const docRef = await addDoc(collection(dbService, "nweets"), {
        text: nweet,
        createdAt: Date.now(),
        createorId: userObj.uid,
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
      <div>
        {nweets.map((nweet) => (
          <Nweet
            key={nweet.id}
            nweetObj={nweet}
            isOwner={nweet.createorId === userObj.uid}
          />
        ))}
      </div>
    </div>
  );
};
export default Home;
