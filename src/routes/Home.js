import {
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { dbService } from "./firebase";
import Nweett from "./Nweett";
import { storageService } from "./firebase";
import { v4 as uuidv4 } from "uuid";
import { getDownloadURL, ref, uploadString } from "firebase/storage";
const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState("");
  const [nweets, setNweets] = useState([]); // nweets를 가져와보도록하자
  const [attachment, setAttachment] = useState("");
  useEffect(() => {
    const q = query(
      collection(dbService, "nweets"),
      orderBy("createdAt", "desc")
    );
    onSnapshot(q, (snapshot) => {
      // 새로운 스냅샷을 받을 때, 배열을 만든다.
      const nweetArray = snapshot.docs.map((doc) => ({
        // 모든 배열에 있는 아이템들은 이렇게 생김
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray); // 그런다음 state에 배열을 집어넣는다.
    });
  }, []);

  const onSubmit = async (event) => {
    event.preventDefault();
    let attachmentUrl = "";
    if (attachment !== "") {
      const fileRef = ref(storageService, `${userObj.uid}/${uuidv4()}`);
      const response = await uploadString(fileRef, attachment, "data_url");
      console.log("res", response);
      attachmentUrl = await getDownloadURL(response.ref);
    }
    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      createdId: userObj.uid,
      attachmentUrl,
    };
    await addDoc(collection(dbService, "nweets"), nweetObj);
    setNweet("");
    setAttachment("");
  };

  const onChange = (e) => {
    setNweet(e.target.value);
  };

  const onFileChange = (event) => {
    const theFile = event.target.files[0];
    const reader = new FileReader();
    reader.onloadend = (finishedEvent) => {
      const {
        currentTarget: { result },
      } = finishedEvent;
      setAttachment(result);
    };
    reader.readAsDataURL(theFile);
  };

  const fileInput = useRef();
  const onClearAttachment = () => {
    setAttachment(null);
    fileInput.current.value = null;
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="What's on your mind?"
          maxLength={120}
          value={nweet}
          onChange={onChange}
        />
        <input
          type="file"
          accept="image/*"
          onChange={onFileChange}
          ref={fileInput}
        />
        <input type="submit" value="트윗" />
        <div>
          {attachment && (
            <div>
              <img src={attachment} width="50px" height="50px" />
              <button onClick={onClearAttachment}>Clear</button>
            </div>
          )}
        </div>
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweett
            nweetObj={nweet} // nweetObj는 nweet의 모든 데이터를 가지고 있음, author, text, createdAt
            key={nweet.id}
            isOwner={(nweet.createdId = userObj.uid)} // dynamic한 prop임
            // nweet를 만든 사람과 (nweet.createdId) userObj.uid가 같으면 true를 반환함
            // 참고로 userObj는 Home에서 props로 넘어옴, 그건 바로 App.js에서 넘어오는데
            // 로그인 시 나오는 값이라고 보면 됨
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
