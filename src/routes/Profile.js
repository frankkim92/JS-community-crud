import React from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "./firebase";
const Profile = () => {
  const navigate = useNavigate();
  const onLogOutClick = () => {
    auth.signOut();
    navigate("/");
  };
  return (
    <div>
      <button onClick={onLogOutClick}>Log out</button>
    </div>
  );
};

export default Profile;
