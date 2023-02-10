import React, { useState } from "react";
import { auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  GithubAuthProvider,
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { async } from "@firebase/util";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  //   const onChangeEmail = (e) => {
  //     setEmail(e.target.value);
  //   };
  //   const onChangePassword = (e) => {
  //     setPassword(e.target.value);
  //   };

  const onChange = (event) => {
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);

        setEmail("");
        setPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/Home");
      }
      //   console.log(auth.currentUser);
    } catch (error) {
      setError(error.message);
    }
  };

  const toggleAccount = () => {
    setNewAccount((prev) => !prev);
  };

  const onSocialClick = async (event) => {
    const {
      target: { name },
    } = event;
    let provider;
    if (name === "google") {
      provider = new GoogleAuthProvider();
    } else if (name === "github") {
      provider = new GithubAuthProvider();
    }
    await signInWithPopup(auth, provider);
  };

  return (
    <div>
      {newAccount ? "회원가입 화면입니다." : "로그인 화면입니다."}
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? (
          <button>로그인 하러가기</button>
        ) : (
          <button>회원가입 하러가기</button>
        )}
      </span>
      <button onClick={onSocialClick} name="google">
        Continue with Google
      </button>
      <button onClick={onSocialClick} name="github">
        Continue with GitHub
      </button>
    </div>
  );
};

export default Auth;
