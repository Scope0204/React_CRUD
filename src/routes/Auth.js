import React, { useState } from "react";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GithubAuthProvider,
  GoogleAuthProvider,
} from "firebase/auth";

const Auth = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");
  const auth = getAuth();

  const onChange = (event) => {
    console.log(event.target.name);
    const {
      target: { name, value },
    } = event;
    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    try {
      let data;
      if (newAccount) {
        data = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        data = await signInWithEmailAndPassword(auth, email, password);
      }
    } catch (error) {
      console.log(error.message);
      setError(error.message);
    }
  };

  const toggleAccount = () => setNewAccount((prev) => !prev);
  const onSocialClick = async (event) => {
    const {
      target: { name }, //es6
    } = event;

    let provider, result, credential, token; // credential :
    try {
      if (name === "google") {
        provider = new GoogleAuthProvider();
        result = await signInWithPopup(auth, provider);
        credential = GoogleAuthProvider.credentialFromResult(result);
        token = credential.accessToken;
      } else if (name === "github") {
        provider = new GithubAuthProvider();
        result = await signInWithPopup(auth, provider);
        credential = GithubAuthProvider.credentialFromResult(result);
        token = credential.accessToken;
      }
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <input
          name="email"
          type="text"
          placeholder="Email"
          required
          value={email}
          onChange={onChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          value={password}
          onChange={onChange}
        />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
        {error}
      </form>
      <span onClick={toggleAccount}>
        {newAccount ? "Sign in" : "Create Account"}
      </span>
      <div>
        <button onClick={onSocialClick} name="Google">
          Continue with Google{" "}
        </button>
        <button onClick={onSocialClick} name="github">
          Continue with Github{" "}
        </button>
      </div>
    </div>
  );
};
export default Auth;
