"use client";
import React, {
  useState,
  FC,
  useEffect,
  useRef,
  TextareaHTMLAttributes,
} from "react";
import Client from "@/components/Client/Client";
import Editor__ from "@/components/Editor/Editor";
import { initSocket } from "@/lib/socket";
import { Socket } from "socket.io-client";
import ACTIONS from "@/components/Editor/Actions";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
var axios = require("axios");
import CIcon from "@coreui/icons-react";
import { cilTerminal } from "@coreui/icons";
import {
  User,
  createClientComponentClient,
} from "@supabase/auth-helpers-nextjs";
import Modal from "react-modal";
import Piston, { SubmissionResult } from "piston-js";

const customStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    width: "80%",
    height: "60%",
    backgroundColor: "black",
    opacity: "1",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    overflow: "hidden",
  },
};

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
  const [done, setDone] = useState<boolean>(false);
  const [modalIsOpen, setIsOpen] = useState<boolean>(false);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState<string[] | null>([]);
  const [runText, setRunText] = useState<string>("Run");

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

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
        console.log("inti ran");
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

          const getUsernames = () => {
            let usernames: string[] = [];

            clients?.map((elem) => {
              usernames.push(elem.username);
            });

            return usernames;
          };

          socketRef.current.on(
            ACTIONS.JOINED,
            (data: { clients: any; username: string; socketId: string }) => {
              try {
                if (
                  data.username != localStorage.getItem("username") &&
                  !data.username.startsWith("null")
                ) {
                  toast.success(`${data.username} joined the room`);
                  // const newClient: Client = {
                  //   socketId: data.socketId,
                  //   username: data.username,
                  // };
                  // if (clients) {
                  //   setClients([...clients, newClient]);
                  // } else {
                  //   setClients([newClient]);
                  // }
                  // console.log(getUsernames());
                }
                setClients(data.clients);
              } catch {
                console.log("Some Error, Malicious user entered");
              }
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

      if (!done) {
        init();
        setDone(true);
      }

      return () => {
        socketRef.current?.disconnect();
        socketRef.current?.off(ACTIONS.JOINED);
        socketRef.current?.off(ACTIONS.DISCONNECTED);
      };
    }

    flow();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  return (
    <>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className="w-full h-[100%] flex justify-center items-center border-2 border-white bg-black overflow-hidden">
          <div className="left w-1/3 h-full !border-r-2 border-r-white">
            <div className="title w-full flex justify-center items-center mt-3 font-extrabold text-lg">
              Inputs
            </div>
            <div>
              <form className="h-full">
                <div className="w-full mb-4 border-t-0 mt-3 border-gray-200 rounded-lg bg-gray-50 dark:bg-black dark:border-gray-600 h-full">
                  <div className="py-2 bg-white rounded-t-lg dark:bg-black mx-2 h-full">
                    <label htmlFor="comment" className="sr-only">
                      Inputs
                    </label>
                    <textarea
                      id="inputs"
                      className="w-full p-3 text-sm text-gray-900 border-b-2 border-white bg-white border-0 dark:bg-black dark:text-white dark:placeholder-gray-400 h-[80%]"
                      placeholder="Your inputs go here ..."
                      rows={13}
                      required
                    />
                  </div>
                  <div className="flex items-center justify-center px-3 py-2 border-t-0 dark:border-gray-600">
                    <button
                      onClick={async (event) => {
                        event.preventDefault();
                        setRunText("running...");
                        const inp: HTMLTextAreaElement | null =
                          document.getElementById("inputs");
                        if (localStorage.getItem("code") != null) {
                          const options = {
                            method: "POST",
                            url: "https://online-code-compiler.p.rapidapi.com/v1/",
                            headers: {
                              "content-type": "application/json",
                              "X-RapidAPI-Key":
                                "beffd5b897mshfc71b5776ff983dp145860jsn33dd55627068",
                              "X-RapidAPI-Host":
                                "online-code-compiler.p.rapidapi.com",
                            },
                            data: {
                              language: "python3",
                              version: "latest",
                              code: localStorage.getItem("code"),

                              input: inp?.value,
                            },
                          };

                          // console.log(document.getElementById("inputs")?.value);

                          try {
                            const response = await axios.request(options);
                            let sample = response.data.output;
                            let out: string[] = [];
                            sample.split("\n").forEach((element: string) => {
                              let line = "";
                              element.split("\t").forEach((sub: string) => {
                                line += sub;
                                line += "    ";
                              });
                              out.push(line.trimEnd());
                              setOutput(out);
                            });
                          } catch (error) {
                            console.error(error);
                          }
                        }
                        setRunText("Run");
                      }}
                      type="submit"
                      className="inline-flex items-center text-sm py-2.5 px-4 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                    >
                      {runText}
                    </button>
                    <button
                      onClick={() => {
                        setOutput([]);
                      }}
                      className="inline-flex ml-4 items-center text-sm py-2.5 px-4 font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800"
                    >
                      Clear
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="right w-2/3 h-full">
            <div className="title w-full flex justify-center items-center mt-3 font-extrabold text-lg">
              Outputs
            </div>
            <div
              className="output w-full px-4 overflow-y-auto overflow-x-hidden p-3 mt-4 text-white border-b-2 border-white bg-white border-0 dark:bg-black dark:text-white dark:placeholder-gray-400 h-full"
              id="code_outputs"
            >
              {output?.map((elem, index) => (
                <div key={index}>
                  <span style={{ whiteSpace: "pre-wrap" }}>{elem}</span>
                  <br />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="w-full h-[10%] flex justify-center items-center"></div>
      </Modal>
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
          <div className="flex justify-around items-center">
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
              className="btn copyBtn"
              onClick={async () => {
                openModal();
              }}
            >
              <img src="/terminal.png" alt="Terminal" height={32} width={32} />
            </button>
          </div>

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
