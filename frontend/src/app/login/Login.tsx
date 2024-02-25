import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    console.log(`Email : ${email}, Password: ${password}`);
    const res = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(res);
    if (res.error) {
    } else {
      location.href = "/";
    }
  };

  const handleSignUp = async () => {
    console.log(`Email : ${email}, Password: ${password}`);
    const res = await supabase.auth.signUp({
      email: email,
      password: password,
    });
    console.log(res);
    if (!res.error) {
      handleSignIn();
    }
  };
  return (
    <div className="flex flex-col justify-center items-center">
      <input
        type="email"
        name="email"
        value={email}
        onChange={(e) => {
          console.log("typeing");
          setEmail(e.target.value);
        }}
        placeholder="Email"
        className="my-2 text-black"
      />
      <input
        type="password"
        name="password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
        }}
        placeholder="Password"
        className="my-2 text-black"
      />
      <button onClick={handleSignIn} className="">
        Login
      </button>
    </div>
  );
}

export default Login;
