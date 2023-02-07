import React, { useState } from "react";
import AppRouter from "./Router";
import { auth } from "routes/firebase";
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(auth.currentUser);

  return (
    <>
      <AppRouter isLoggedIn={isLoggedIn} />

      <footer>&copy; Twitter {new Date().getFullYear()}</footer>
    </>
  );
};

export default App;
