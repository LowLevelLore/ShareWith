"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();

  const logout = async () => {
    await supabase.auth.signOut();
    router.refresh();
  };

  useEffect(() => {
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
      {isLoading ? (
        <Loading />
      ) : (
        <>
          {isLoggedIn ? <h3>Welcome Back, {user?.email}</h3> : <></>}
          <button onClick={logout}>Logout</button>
        </>
      )}
    </>
  );
}
