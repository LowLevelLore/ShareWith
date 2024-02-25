"use client";
import {
  SupabaseClient,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import Image from "next/image";
import Login from "./Login";
import SignUp from "./SignUp";
import { Typewriter } from "nextjs-simple-typewriter";

import React from "react";

function LoginPage() {
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkLogin = async () => {
      const res = await supabase.auth.getSession();
      if (res.data.session?.user == undefined) {
      } else {
        location.href = "/";
      }
    };
    checkLogin();
  });

  const tabs = [
    {
      title: "Login",
      value: "Login",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black border border-white border-3 ">
          <Login />
        </div>
      ),
    },
    {
      title: "Sign Up",
      value: "Sign Up",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-white bg-black border border-white border-3 ">
          <SignUp />
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] px-4 sm:py-6 md:py-6 relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start my-10 md:px-3 sm:px-3">
      <div className="flex flex-col justify-center items-center font-bold text-3xl self-center mb-10 w-[350px]">
        <Image
          src={"/CodeWith.png"}
          alt="LOGO"
          width={450}
          height={200}
          priority={true}
        />
        <p className="">
          Welcome to{" "}
          <span className=" text-blue-300">
            {" "}
            <Typewriter
              words={[" CodeWith!"]}
              typeSpeed={60}
              deleteSpeed={40}
              loop={0}
            />
          </span>
        </p>
      </div>
      <Tabs tabs={tabs} />
    </div>
  );
}

export default LoginPage;
