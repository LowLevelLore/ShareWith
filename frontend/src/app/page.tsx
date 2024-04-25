"use client";

import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Loading from "@/components/loading/loading";
import Nav from "@/components/ui/navbar";
import { MacbookScroll } from "@/components/ui/macbook-scroll";
import Head from "next/head";

export default function Home() {
  const router = useRouter();
  const supabase = createClientComponentClient({
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();

  const logout = async () => {
    setIsLoading(true);
    await supabase.auth.signOut();
    router.refresh();
    setIsLoading(false);
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
        <title>CodeWith</title>
      </Head>
      <Nav logoutFn={logout} />
      <div className="w-full h-full">
        <div className="h-[auto] w-full dark:bg-black bg-white  dark:bg-grid-white/[0.2] bg-grid-black/[0.2] relative flex flex-col items-center justify-center">
          {/* Radial gradient for the container to give a faded look */}
          <div className="absolute pointer-events-none inset-0 flex items-center justify-center dark:bg-black bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]"></div>
          {isLoading ? (
            <Loading />
          ) : (
            <>
              <div className="overflow-hidden dark:bg-transparent bg-white w-full sm:block hidden">
                <MacbookScroll
                  title={
                    <span>
                      {"What's"} common between this website and a macbook ?{" "}
                      <br /> You can code on both.
                    </span>
                  }
                  src={`/mcb.jpg`}
                  showGradient={false}
                />
              </div>
              <div className="w-full dark:bg-transparent bg-white font-extrabold flex justify-center items-center py-32">
                <div className="sm:w-[50%] w-[90%]">
                  Welcome to CodeWith, your premier online platform for
                  collaborative coding and sharing! We{"'"}re dedicated to
                  fostering a dynamic community where developers of all levels
                  can come together to exchange ideas, collaborate on projects,
                  and fuel their passion for coding.
                  <br />
                  <br />
                  At CodeWith, we believe in the transformative power of shared
                  knowledge. Our platform provides an intuitive and feature-rich
                  environment for developers to create, explore, and share code
                  in various programming languages and frameworks. Whether you
                  {";"}re a beginner looking to learn, a seasoned coder seeking
                  inspiration, or a team collaborating on a project, CodeWith
                  offers the tools and support you need to succeed.
                  <br />
                  <br />
                  Our mission is to empower developers to unlock their full
                  potential by providing a space where they can connect with
                  like-minded individuals, showcase their skills, and contribute
                  to the collective learning experience. Through features such
                  as code sharing, commenting, and collaborative editing, we
                  encourage active participation and meaningful interaction
                  within our vibrant community.
                  <br />
                  <br />
                  At CodeWith, we{"'"}re committed to continuous improvement and
                  innovation. We{"'"}re always exploring new ways to enhance the
                  user experience, introduce cutting-edge features, and stay
                  ahead of the curve in a rapidly evolving tech landscape.
                  <br />
                  <br />
                  Join us on our journey to revolutionize the way developers
                  collaborate and learn. Whether you{"'"}re here to code, learn,
                  or connect with fellow enthusiasts, CodeWith is your trusted
                  partner every step of the way. Let{"'"}s build something
                  amazing together, one line of code at a time!
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

const Badge = ({ className }: { className?: string }) => {
  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 56 56"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M56 28C56 43.464 43.464 56 28 56C12.536 56 0 43.464 0 28C0 12.536 12.536 0 28 0C43.464 0 56 12.536 56 28Z"
        fill="#00AA45"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M28 54C42.3594 54 54 42.3594 54 28C54 13.6406 42.3594 2 28 2C13.6406 2 2 13.6406 2 28C2 42.3594 13.6406 54 28 54ZM28 56C43.464 56 56 43.464 56 28C56 12.536 43.464 0 28 0C12.536 0 0 12.536 0 28C0 43.464 12.536 56 28 56Z"
        fill="#219653"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M27.0769 12H15V46H24.3846V38.8889H27.0769C34.7305 38.8889 41 32.9048 41 25.4444C41 17.984 34.7305 12 27.0769 12ZM24.3846 29.7778V21.1111H27.0769C29.6194 21.1111 31.6154 23.0864 31.6154 25.4444C31.6154 27.8024 29.6194 29.7778 27.0769 29.7778H24.3846Z"
        fill="#24292E"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M18 11H29.0769C36.2141 11 42 16.5716 42 23.4444C42 30.3173 36.2141 35.8889 29.0769 35.8889H25.3846V43H18V11ZM25.3846 28.7778H29.0769C32.1357 28.7778 34.6154 26.39 34.6154 23.4444C34.6154 20.4989 32.1357 18.1111 29.0769 18.1111H25.3846V28.7778Z"
        fill="white"
      ></path>
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M17 10H29.0769C36.7305 10 43 15.984 43 23.4444C43 30.9048 36.7305 36.8889 29.0769 36.8889H26.3846V44H17V10ZM19 12V42H24.3846V34.8889H29.0769C35.6978 34.8889 41 29.7298 41 23.4444C41 17.1591 35.6978 12 29.0769 12H19ZM24.3846 17.1111H29.0769C32.6521 17.1111 35.6154 19.9114 35.6154 23.4444C35.6154 26.9775 32.6521 29.7778 29.0769 29.7778H24.3846V17.1111ZM26.3846 19.1111V27.7778H29.0769C31.6194 27.7778 33.6154 25.8024 33.6154 23.4444C33.6154 21.0864 31.6194 19.1111 29.0769 19.1111H26.3846Z"
        fill="#24292E"
      ></path>
    </svg>
  );
};
