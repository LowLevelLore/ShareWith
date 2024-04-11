"use client";
import React, { useState, FC, useEffect, useRef } from "react";
import Client from "@/components/Client/Client";
import Editor__ from "@/components/Editor/Editor";
import { initSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import ACTIONS from "@/components/Editor/Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";

type Client = {
  socketId: string;
  username: string;
};

interface Params {
  params: { id: string };
}

const Page: FC<Params> = ({ params }) => {
  const supabase = createClientComponentClient();
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>();
  const socketRef = useRef<Socket<any, any>>();
  const [clients, setClients] = useState<Client[]>();
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    async function flow() {
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
      function handleErrors(e: Error) {
        console.log("socket error", e);
        toast.error("Socket connection failed, try again later.");
        window.location.pathname = "/";
      }
      await checkLogin();
      const init = async () => {
        if (!socketRef.current) {
          socketRef.current = await initSocket();
          socketRef.current.on("connect_error", (err) => handleErrors(err));
          socketRef.current.on("connect_failed", (err: Error) =>
            handleErrors(err)
          );

          if (!localStorage.getItem("username")) {
            handleErrors(new Error("You must have a username"));
          }

          socketRef.current.emit(ACTIONS.JOIN, {
            roomId: params.id,
            username: localStorage.getItem("username"),
          });

          socketRef.current.on(
            ACTIONS.JOINED,
            (data: { clients: any; username: string; socketId: string }) => {
              try {
                if (
                  data.username != localStorage.getItem("username") &&
                  !data.username.startsWith("null")
                ) {
                  toast.success(`${data.username} joined the room`);
                }
              } catch {
                console.log("Some Error, Malicious user entered");
              }
              setClients(data.clients);
              socketRef.current?.emit(ACTIONS.SYNC_CODE, {
                code: localStorage.getItem("code"),
                socketId: data.socketId,
              });
            }
          );

          socketRef.current.on(
            ACTIONS.DISCONNECTED,
            (data: { socketId: string; username: string }) => {
              try {
                if (!data.username.startsWith("null"))
                  toast.warn(`${data.username} has left the room !`);
              } catch {
                console.log("Some Error, Malicious user left");
              }
              setClients((prev) => {
                return prev?.filter(
                  (client) => client.socketId != data.socketId
                );
              });
            }
          );
        }
      };

      init();

      return () => {
        socketRef.current?.disconnect();
        socketRef.current?.off(ACTIONS.JOINED);
        socketRef.current?.off(ACTIONS.DISCONNECTED);
      };
    }
    flow();
  }, [code]);

  return (
    <>
      <ToastContainer className={"text-black"} />
      <div className="mainWrap">
        <div className="aside">
          <div className="asideInner">
            <div className="logo w-full flex items-center justify-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="logoImage" src="/CodeWith.png" alt="logo" />
            </div>
            <div className="w-full text-xl flex justify-center items-center my-2 mt-4 font-bold">
              Connected
            </div>
            <div className="clientsList">
              {clients &&
                clients.map((client) => (
                  <Client
                    key={client.socketId}
                    username={client.username}
                    socketId={client.socketId}
                  />
                ))}
            </div>
          </div>
          <button
            className="btn copyBtn"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(
                  window.location.pathname.split("/")[
                    window.location.pathname.split("/").length - 1
                  ]
                );
                toast.success("Room ID copied to clipboard");
              } catch (error) {
                toast.warn("Cannot copy Room ID to clipboard");
              }
            }}
          >
            Copy Room ID
          </button>
          <button
            className="btn leaveBtn"
            onClick={() => {
              window.location.pathname = "/";
            }}
          >
            Leave
          </button>
        </div>
        <div className="editorWrap">
          <Editor__
            roomId={params.id}
            socketRef={socketRef}
            onCodeChange__={(code_: string) => {
              localStorage.setItem("code", code_);
              setCode(code_);
            }}
          />
        </div>
      </div>
    </>
  );
};

export default Page;
