import React, { useEffect, useState } from "react";
import { dbService, storageService } from "../fbase";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import Nweet from "../components/Nweet";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
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
    let attachmentUrl = "";
    if (attachment !== "") {
      //파일 경로 참조 만들기
      const attachmentRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      //storage 참조 경로로 파일 만들기
      const response = await uploadString(
        attachmentRef,
        attachment,
        "data_url"
      );
      console.log(response.ref);
      //storage에 있는 파일 URL로 다운받기
      attachmentUrl = await getDownloadURL(response.ref);
      console.log(attachmentUrl);
    }
    const docRef = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), docRef);

    setNweet(""); //등록 시 입력폼에 값 초기화
    setAttachment(""); // 사진을 만들고 업로드 할 땐 아무것도 안함
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
            <img src={attachment} width="50px" height="50px" alt="첨부사진" />
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
