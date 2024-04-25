"use client";
import React from "react";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/ui/navbar";
import Form from "react-bootstrap/Form";
import Head from "next/head";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Page() {
  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const [id, setId] = useState("");
  const [username, setUsername] = useState("");

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
  };

  const joinRoom = () => {
    if (!id || !username) {
      toast.error("Room ID and Username are required.");
    } else {
      localStorage.setItem("username", username);
      router.push(`/editor/${id}/`);
    }
  };

  useEffect(() => {
    localStorage.removeItem("code");
    const checkLogin = async () => {
      const res = await supabase.auth.getSession();
      if (res.data.session?.user != undefined) {
        setIsLoggedIn(true);
        setUser(res.data.session.user);
      } else {
        setIsLoggedIn(false);
        location.href = "/login";
      }
      setIsLoading(false);
    };
    checkLogin();
  });
  return (
    <>
      <Head>
        <title>CodeWith | Join a Room</title>
      </Head>
      <Nav logoutFn={logout} />
      <ToastContainer className={"text-black"} />
      <div className="w-full h-full flex justify-center items-center">
        <div className="bg-transparent w-[96%] sm:w-[100%] mt-32">
          <div className="flex flex-col justify-center items-center my-16">
            <div className="w-full flex justify-center items-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/CodeWith.png" alt="" className="w-[300px]" />
            </div>
            <h2 className="text-3xl font-extrabold text-black dark:text-white my-6">
              Join a Room
            </h2>
            <Form className="columns-md flex-col space-y-3 ">
              <div className="relative">
                <input
                  onChange={(e) => {
                    setId(e.target.value);
                  }}
                  type="text"
                  id="txnId"
                  className="block px-2.5 pb-2.5 pt-2.5 w-full text-md text-black dark:text-white bg-transparent rounded-lg border-2 border-slate-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
                  placeholder=" "
                  value={id}
                />

                <label
                  htmlFor="txnId"
                  className="absolute rounded-full text-gray-800 dark:text-slate-300 dark:bg-[rgb(19,22,26)] bg-white text-md duration-300 transhtmlForm -translate-y-5 scale-75 top-2 z-10 origin-[0]  px-3 peer-focus:px-3 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Room ID
                </label>
              </div>

              <div className="relative">
                <input
                  onChange={(e) => {
                    setUsername(e.target.value);
                  }}
                  type="text"
                  id="userName"
                  className="block px-2.5 pb-2.5 pt-2.5 w-full text-md text-black dark:text-white bg-transparent rounded-lg border-2 border-slate-400 appearance-none focus:outline-none focus:ring-0 focus:border-blue-400 peer"
                  placeholder=" "
                  value={username}
                />

                <label
                  htmlFor="userName"
                  className="absolute rounded-full text-gray-800 dark:text-slate-300 dark:bg-[rgb(19,22,26)] bg-white text-md duration-300 transhtmlForm -translate-y-5 scale-75 top-2 z-10 origin-[0]  px-3 peer-focus:px-3 peer-focus:text-blue-400 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-5 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1"
                >
                  Username
                </label>
              </div>

              <button
                type="button"
                onClick={joinRoom}
                className="text-white w-full bg-gradient-to-r mt-12 from-blue-500 via-blue-600 to-blue-700 hover:from-blue-800 hover:via-blue-700 hover:to-blue-600 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 shadow-lg shadow-blue-500/50 dark:shadow-lg dark:shadow-blue-800/80 font-medium rounded-lg text-md px-5 py-2.5 text-center me-2 mb-2 transition-all duration-300 ease-in-out"
              >
                Join
              </button>
              <div className="relative flex justify-center items-center">
                <div>
                  If you don{"'"} have a invitation ID,{" "}
                  <a href="/create" className="text-blue-600">
                    Create a Room
                  </a>
                </div>
              </div>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
}

export default Page;
