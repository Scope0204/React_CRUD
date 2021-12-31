import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import Nweet from "../components/Nweet";
import { ref, uploadString } from "firebase/storage";
import { v4 as uuidv4 } from "uuid";

const Home = ({ userObj }) => {
  //   console.log(userObj);
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]);
  const [attachment, setAttachment] = useState("");

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

    const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
    const response = await uploadString(fileRef, attachment, "data_url");
    console.log(response);

    /*
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
    */
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    console.log(event.target.files);
    const {
      target: { files },
    } = event;
    const theFiles = files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      // console.log(finishedEvent);
      const {
        currentTarget: { result }, // URL
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFiles);
  };

  const onClearAttachment = () => {
    setAttachment("");
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
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="NWeet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px" height="50px" />
            <button onClick={onClearAttachment}>Clear</button>
          </div>
        )}
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
