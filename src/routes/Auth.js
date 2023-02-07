import React, { useState } from "react";
import { auth } from "./firebase";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Auth = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);

  const onChangeEmail = (e) => {
    setEmail(e.target.value);
  };
  const onChangePassword = (e) => {
    setPassword(e.target.value);
  };
  const onSubmit = async (e) => {
    e.preventDefault();

    try {
      if (newAccount) {
        await createUserWithEmailAndPassword(auth, email, password);
        setNewAccount(!newAccount);
        setEmail("");
        setPassword("");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        navigate("/Home");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          type="email"
          placeholder="Email"
          required
          value={email}
          onChange={onChangeEmail}
        />
        <input
          type="password"
          placeholder="password"
          required
          value={password}
          onChange={onChangePassword}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
      </form>
      <button>Continue with Google</button>
      <button>Continue with GitHub</button>
    </div>
  );
};

export default Auth;
