import Loading from "@/components/loading/loading";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import React, { useState } from "react";
import Spinner from "react-bootstrap/Spinner";
function Login() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showError, setShowError] = useState(false);

  const supabase = createClientComponentClient();

  const handleSignIn = async () => {
    setIsLoading(true);
    console.log(`Email : ${email}, Password: ${password}`);
    const res = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    });
    console.log(res);
    if (res.error) {
      setShowError(true);
    } else {
      setShowError(false);
      location.href = "/";
    }
    setIsLoading(false);
  };

  return (
    <>
      <>
        <div className="circle-1"></div>
        <div className="circle-2"></div>
        <div className="circle-3"></div>

        <div className="flex flex-col justify-center items-center">
          <div className="w-80 rounded-2xl bg-transparent card">
            <div className="flex flex-col gap-2 p-8">
              <p className="text-center text-2xl text-gray-300 mb-4">
                Login to <br /> CodeWith.io
              </p>
              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
                placeholder="Email"
                className="bg-slate-900 w-full text-sm rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-gray-800"
              />
              <input
                type="password"
                name="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
                className="bg-slate-900 w-full text-sm rounded-lg border border-gray-300 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-0 focus:ring-offset-gray-800"
                placeholder="Password"
              />
              {isLoading ? (
                <>
                  <Spinner animation="border" role="status">
                    <span className="visually-hidden w-full flex justify-center items-center text-sm">
                      Loading...
                    </span>
                  </Spinner>
                </>
              ) : (
                <>
                  <button
                    onClick={handleSignIn}
                    className="inline-block cursor-pointer mt-3 rounded-md bg-blue-500 px-4 py-3.5 text-center text-sm font-semibold uppercase text-white transition duration-200 ease-in-out hover:bg-blue-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-700 focus-visible:ring-offset-2 active:scale-95"
                  >
                    Login
                  </button>
                </>
              )}

              {showError && (
                <div
                  className="text-red-400 font-light text-sm mt-2"
                  style={{ textAlign: "center" }}
                >
                  Invalid Login Credentials
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    </>
  );
}

export default Login;
