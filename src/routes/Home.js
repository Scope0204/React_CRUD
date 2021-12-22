import React, { useEffect, useState } from "react";
import { dbService } from "../fbase";
import { addDoc, collection, getDocs, query } from "firebase/firestore";

const Home = () => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);

  const getNweets = async () => {
    const q = query(collection(dbService, "nweets")); // collection "nweets"
    const querySnapShot = await getDocs(q); // "nweets"의 컬렉션의 Document를 가져옴
    querySnapShot.forEach((doc) => {
      const nweetObj = {
        ...doc.data(),
        id: doc.id,
      };
      setNweets((prev) => [nweetObj, ...prev]); // 새 Nweet + 기존 Nweet
    });
  };

  useEffect(() => {
    getNweets();
  }, []);

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
      <div>
        {nweets.map((nweet) => (
          <div key={nweet.id}>
            <h4>{nweet.nweet}</h4>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Home;
