import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { dbService } from "./firebase";

const Nweett = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); //true, false를 위한 것임
  const [newNweet, setNewNweet] = useState(nweetObj.text); // input에 입력된 text를 업데이트해줌
  console.log("newNweet", newNweet);
  const nweetTextRef = doc(dbService, "nweets", `${nweetObj.id}`);
  // collection : Nweets,  id : nweetObj.id

  const onDeleteClick = async () => {
    //삭제의경우 먼저 user를 확인하고 nweet를 지우길 원한다.
    const ok = window.confirm("are you sure 삭제?");
    console.log("newNweet", newNweet);
    if (ok) {
      //ok값이 true이면 deleteDoc을 실행한다.
      await deleteDoc(nweetTextRef);
    }
  };

  const toggleEditting = () => {
    setEditing((prev) => !prev);
  };
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log(nweetObj, newNweet);
    await updateDoc(nweetTextRef, {
      text: newNweet,
    });
    setEditing(false);
  };
  const onChange = (e) => {
    setNewNweet(e.target.value);
  };
  return (
    <div>
      {editing ? ( // 만약 수정을 한다면 아래의 input 수정서식이 보일거야
        <>
          {isOwner && ( // 주인인 사람들만 form을 볼 수 있게함
            <>
              <form onSubmit={onSubmit}>
                <input
                  type="text"
                  placeholder="Edit Your tweet  "
                  value={newNweet}
                  required
                  onChange={onChange}
                />
                <input type="submit" value="Update tweet" />
              </form>
              <button onClick={toggleEditting}>Cancel</button>
            </>
          )}
        </>
      ) : (
        // 주인이 아니라면 위의 수정서식이 안보임
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && (
            <img src={nweetObj.attachmentUrl} width="50px" height="50px" />
          )}
          {isOwner && ( // 주인이여서 아래의 수정과 삭제 버튼이 보임
            <>
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditting}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweett;
